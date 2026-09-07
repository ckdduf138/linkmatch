import { cache } from "react";
import { prisma } from "./prisma";

/**
 * 방 하나를 왕복 한 번에 읽는다.
 *
 * Prisma는 중첩 include를 테이블마다 별도 쿼리로 쪼갠다 (Room/Question/Participant/Answer
 * 네 번). libSQL HTTP 클라이언트는 한 스트림에서 요청을 직렬화하니 Promise.all로 감싸도
 * 왕복 수가 그대로다 - 2026-09-08 실측으로 순차 177ms, Promise.all 177ms, $transaction
 * 배열은 BEGIN/COMMIT이 붙어 오히려 215ms였다. 줄일 수 있는 건 왕복 횟수뿐이라
 * SQLite JSON1로 한 번에 접었다 (44ms).
 *
 * React cache()로 감싸 같은 요청 안의 generateMetadata와 page가 결과를 나눠 쓴다.
 *
 * 서브쿼리가 만든 JSON은 반드시 json()으로 다시 감싼다. SQLite는 json_* 함수가 만든 값에
 * JSON subtype 플래그를 달아 중첩을 알아보는데, 스칼라 서브쿼리를 거치면 그 플래그가 날아가
 * 바깥 json_object가 값을 평범한 TEXT로 보고 통째로 이스케이프한다 (중첩 객체 대신
 * "{\"id\":...}" 문자열이 박힌다). json()은 NULL을 NULL 그대로 돌려주니 없는 행에도 안전하다.
 *
 * DateTime은 strftime으로 UTC 문자열을 만들어 꺼낸다. 컬럼에 두 포맷이 섞여 있어서다 -
 * Prisma가 쓴 행은 "...+00:00"으로, 테스트·시드가 쓴 행은 오프셋 없이 저장돼 있다.
 * 후자를 그대로 new Date()에 넣으면 실행 환경의 시간대로 읽혀 KST에서 9시간이 밀린다.
 * strftime은 둘 다 UTC로 정규화해서 Prisma의 타입 리더와 같은 값을 낸다.
 */

export interface RoomBundleQuestion {
  id: string;
  type: string;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

export interface RoomBundleAnswer {
  id: string;
  questionId: string;
  value: string;
}

export interface RoomBundleParticipant {
  id: string;
  nickname: string;
  answers: RoomBundleAnswer[];
}

export interface RoomBundle {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: Date;
  expiresAt: Date;
  frozenAt: Date | null;
  questions: RoomBundleQuestion[];
  participants: RoomBundleParticipant[];
}

interface RawBundle {
  id: string;
  title: string;
  /** SQLite는 boolean을 0/1 정수로 저장한다 */
  isPublic: number;
  /** DateTime은 ISO 문자열(TEXT)로 저장된다 */
  createdAt: string;
  expiresAt: string;
  frozenAt: string | null;
  questions: RoomBundleQuestion[];
  participants: RoomBundleParticipant[];
}

export const getRoomBundle = cache(async function getRoomBundle(
  id: string
): Promise<RoomBundle | null> {
  const rows = await prisma.$queryRaw<{ bundle: string }[]>`
    SELECT json_object(
      'id', r.id,
      'title', r.title,
      'isPublic', r.isPublic,
      'createdAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.createdAt),
      'expiresAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.expiresAt),
      'frozenAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.frozenAt),
      'questions', json((
        SELECT COALESCE(json_group_array(json_object(
          'id', q.id, 'type', q.type, 'title', q.title,
          'optionA', q.optionA, 'optionB', q.optionB,
          'options', q.options, 'order', q."order"
        )), json_array())
        FROM (SELECT * FROM Question WHERE roomId = r.id ORDER BY "order" ASC) q
      )),
      'participants', json((
        SELECT COALESCE(json_group_array(json_object(
          'id', p.id, 'nickname', p.nickname,
          'answers', json((
            SELECT COALESCE(json_group_array(json_object(
              'id', a.id, 'questionId', a.questionId, 'value', a.value
            )), json_array())
            FROM Answer a WHERE a.participantId = p.id
          ))
        )), json_array())
        FROM (SELECT * FROM Participant WHERE roomId = r.id ORDER BY createdAt ASC) p
      ))
    ) AS bundle
    FROM Room r
    WHERE r.id = ${id}
  `;

  if (rows.length === 0) return null;

  const raw = JSON.parse(rows[0].bundle) as RawBundle;

  return {
    id: raw.id,
    title: raw.title,
    isPublic: raw.isPublic === 1,
    createdAt: new Date(raw.createdAt),
    expiresAt: new Date(raw.expiresAt),
    frozenAt: raw.frozenAt === null ? null : new Date(raw.frozenAt),
    questions: raw.questions,
    participants: raw.participants,
  };
});

export interface SubmissionContext {
  room: {
    id: string;
    isPublic: boolean;
    createdAt: Date;
    expiresAt: Date;
    questions: { id: string; type: string; options: string | null }[];
  };
  participant: {
    id: string;
    roomId: string;
    nickname: string;
    createdAt: Date;
    answeredQuestionIds: string[];
  } | null;
}

/**
 * 답변 제출이 쓰기 전에 확인해야 하는 것 전부를 왕복 한 번에 읽는다: 방과 문항,
 * 그리고 이 제출자가 이미 참여자로 존재하는지와 어떤 문항에 답했는지.
 *
 * 후보 id는 쿠키와 submissionId로 만든 결정적 id 둘뿐이라 IN 두 자리로 충분하다.
 * ORDER BY로 쿠키 쪽을 먼저 고르는데, 원래 findFirst는 순서가 정해져 있지 않았다.
 *
 * cache()로 감싸지 않는다 - 쓰기 경로의 선행 조회라 요청 안에서 재사용되면 안 된다.
 */
export async function getSubmissionContext(
  roomId: string,
  candidateParticipantIds: readonly string[]
): Promise<SubmissionContext | null> {
  const preferred = candidateParticipantIds[0];
  const fallback = candidateParticipantIds[1] ?? preferred;

  const rows = await prisma.$queryRaw<{ context: string }[]>`
    SELECT json_object(
      'id', r.id,
      'isPublic', r.isPublic,
      'createdAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.createdAt),
      'expiresAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.expiresAt),
      'questions', json((
        SELECT COALESCE(json_group_array(json_object(
          'id', q.id, 'type', q.type, 'options', q.options
        )), json_array())
        FROM (SELECT * FROM Question WHERE roomId = r.id ORDER BY "order" ASC) q
      )),
      'participant', json((
        SELECT json_object(
          'id', p.id, 'roomId', p.roomId, 'nickname', p.nickname,
          'createdAt', strftime('%Y-%m-%dT%H:%M:%fZ', p.createdAt),
          'answeredQuestionIds', json((
            SELECT COALESCE(json_group_array(a.questionId), json_array())
            FROM Answer a WHERE a.participantId = p.id
          ))
        )
        FROM Participant p
        WHERE p.roomId = r.id AND p.id IN (${preferred}, ${fallback})
        ORDER BY CASE WHEN p.id = ${preferred} THEN 0 ELSE 1 END
        LIMIT 1
      ))
    ) AS context
    FROM Room r
    WHERE r.id = ${roomId}
  `;

  if (rows.length === 0) return null;

  const raw = JSON.parse(rows[0].context) as {
    id: string;
    isPublic: number;
    createdAt: string;
    expiresAt: string;
    questions: { id: string; type: string; options: string | null }[];
    participant: {
      id: string;
      roomId: string;
      nickname: string;
      createdAt: string;
      answeredQuestionIds: string[];
    } | null;
  };

  return {
    room: {
      id: raw.id,
      isPublic: raw.isPublic === 1,
      createdAt: new Date(raw.createdAt),
      expiresAt: new Date(raw.expiresAt),
      questions: raw.questions,
    },
    participant: raw.participant
      ? { ...raw.participant, createdAt: new Date(raw.participant.createdAt) }
      : null,
  };
}
