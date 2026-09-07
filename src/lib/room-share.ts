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
export async function getRoomShareInfo(id: string): Promise<RoomShareInfo | null> {
  const room = await prisma.room.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      isPublic: true,
      expiresAt: true,
      frozenAt: true,
      _count: { select: { questions: true, participants: true } },
      questions: {
        orderBy: { order: "asc" },
        take: 1,
        select: {
          type: true,
          title: true,
          optionA: true,
          optionB: true,
          options: true,
        },
      },
    },
  });

  if (!room) return null;

  const first = room.questions[0];

  return {
    id: room.id,
    title: room.title,
    isPublic: room.isPublic,
    // 동결된 방은 만료 시각이 지났어도 "만료"가 아니다. 결과가 영구히 남는 상태다.
    expired: room.expiresAt < new Date() && room.frozenAt === null,
    frozen: room.frozenAt !== null,
    questionCount: room._count.questions,
    participantCount: room._count.participants,
    firstQuestion: first
      ? {
          type: first.type as QuestionType,
          title: first.title,
          optionA: first.optionA,
          optionB: first.optionB,
          options: parseOptions(first.options),
        }
      : null,
  };
}

export { roomShareDescription } from "./room-share-text";

export function roomShareTitle(info: RoomShareInfo): string {
  return info.expired ? "만료된 방" : info.title;
}
