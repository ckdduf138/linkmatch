import { cache } from "react";
import { prisma } from "./prisma";
import { parseOptions, type QuestionType } from "./types";

export interface RoomSharePreview {
  type: QuestionType;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string[];
}

export interface RoomShareInfo {
  id: string;
  title: string;
  isPublic: boolean;
  expired: boolean;
  frozen: boolean;
  questionCount: number;
  participantCount: number;
  firstQuestion: RoomSharePreview | null;
}

/**
 * 링크 미리보기(OG)용 최소 정보만 읽는다.
 *
 * 이 값은 쿠키 없이 크롤러에게 그대로 나가므로 Answer Lock 바깥이다. 그래서
 * 참여자 닉네임과 답변은 한 글자도 담지 않는다. 질문 본문은 담아도 되는데,
 * Answer Lock이 가리는 건 "남이 뭘 골랐는지"지 "무슨 질문인지"가 아니고,
 * 링크를 받은 사람은 클릭하는 순간 어차피 같은 질문을 본다.
 */
export const getRoomShareInfo = cache(async function getRoomShareInfo(
  id: string
): Promise<RoomShareInfo | null> {
  // 왕복 한 번. Prisma의 _count + 중첩 select는 쿼리 두 개로 쪼개진다.
  const rows = await prisma.$queryRaw<{ info: string }[]>`
    SELECT json_object(
      'id', r.id,
      'title', r.title,
      'isPublic', r.isPublic,
      'expiresAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.expiresAt),
      'frozenAt', strftime('%Y-%m-%dT%H:%M:%fZ', r.frozenAt),
      'questionCount', (SELECT COUNT(*) FROM Question q WHERE q.roomId = r.id),
      'participantCount', (SELECT COUNT(*) FROM Participant p WHERE p.roomId = r.id),
      -- json()으로 감싸지 않으면 서브쿼리가 JSON subtype을 잃어 문자열로 이중 인코딩된다
      'firstQuestion', json((
        SELECT json_object(
          'type', q.type, 'title', q.title,
          'optionA', q.optionA, 'optionB', q.optionB, 'options', q.options
        )
        FROM Question q WHERE q.roomId = r.id ORDER BY q."order" ASC LIMIT 1
      ))
    ) AS info
    FROM Room r
    WHERE r.id = ${id}
  `;

  if (rows.length === 0) return null;

  const raw = JSON.parse(rows[0].info) as {
    id: string;
    title: string;
    isPublic: number;
    expiresAt: string;
    frozenAt: string | null;
    questionCount: number;
    participantCount: number;
    firstQuestion: {
      type: string;
      title: string;
      optionA: string | null;
      optionB: string | null;
      options: string | null;
    } | null;
  };

  return {
    id: raw.id,
    title: raw.title,
    isPublic: raw.isPublic === 1,
    // 동결된 방은 만료 시각이 지났어도 "만료"가 아니다. 결과가 영구히 남는 상태다.
    expired: new Date(raw.expiresAt) < new Date() && raw.frozenAt === null,
    frozen: raw.frozenAt !== null,
    questionCount: raw.questionCount,
    participantCount: raw.participantCount,
    firstQuestion: raw.firstQuestion
      ? {
          type: raw.firstQuestion.type as QuestionType,
          title: raw.firstQuestion.title,
          optionA: raw.firstQuestion.optionA,
          optionB: raw.firstQuestion.optionB,
          options: parseOptions(raw.firstQuestion.options),
        }
      : null,
  };
});

export { roomShareDescription } from "./room-share-text";

export function roomShareTitle(info: RoomShareInfo): string {
  return info.expired ? "만료된 방" : info.title;
}
