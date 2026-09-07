import { prisma } from "./prisma";
import type { ArchivedRoom, DiscoverPreviewQuestion, QuestionType } from "./types";

/**
 * 동결 보존.
 *
 * 공개방은 만료되면 지워진다. 그런데 사람들이 실제로 답을 채운 콘텐츠가 그대로 증발하고,
 * 방 페이지는 전부 noindex라 검색에 남는 것도 없다. 어느 정도 모인 공개방만 삭제 대신
 * 얼려서 읽기 전용 아카이브(/archive/[id])로 남긴다.
 *
 * 비공개방은 절대 동결하지 않는다. 닉네임이 실명일 수 있고 닫힌 그룹에만 공유된 링크다.
 * 색인 가능한 영구 페이지로 만드는 건 그 전제를 깨는 짓이다.
 */
export const FREEZE_MIN_PARTICIPANTS = 5;

function toPreview(
  question:
    | {
        type: string;
        title: string;
        optionA: string | null;
        optionB: string | null;
        answers: { value: string }[];
      }
    | undefined
): DiscoverPreviewQuestion | null {
  if (!question) return null;
  return {
    type: question.type as QuestionType,
    title: question.title,
    optionA: question.optionA,
    optionB: question.optionB,
    countA: question.answers.filter((answer) => answer.value === "A").length,
    countB: question.answers.filter((answer) => answer.value === "B").length,
  };
}

/** 만료된 공개방 중 기준을 넘긴 것을 얼린다. 삭제보다 먼저 돌아야 한다. */
export async function freezeExpiredPublicRooms(): Promise<number> {
  const candidates = await prisma.room.findMany({
    where: { isPublic: true, frozenAt: null, expiresAt: { lt: new Date() } },
    select: { id: true, _count: { select: { participants: true } } },
  });

  const ids = candidates
    .filter((room) => room._count.participants >= FREEZE_MIN_PARTICIPANTS)
    .map((room) => room.id);

  if (ids.length === 0) return 0;

  const result = await prisma.room.updateMany({
    where: { id: { in: ids } },
    data: { frozenAt: new Date() },
  });
  return result.count;
}

export async function countArchivedRooms(): Promise<number> {
  return prisma.room.count({ where: { frozenAt: { not: null } } });
}

export async function getArchivedRooms({
  limit = 50,
}: { limit?: number } = {}): Promise<ArchivedRoom[]> {
  const rooms = await prisma.room.findMany({
    where: { frozenAt: { not: null } },
    orderBy: [{ frozenAt: "desc" }, { id: "desc" }],
    take: limit,
    select: {
      id: true,
      title: true,
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
          answers: { select: { value: true } },
        },
      },
    },
  });

  return rooms.map((room) => ({
    id: room.id,
    title: room.title,
    questionCount: room._count.questions,
    participantCount: room._count.participants,
    // where 절에서 not null로 걸렀으니 여기서는 항상 값이 있다.
    frozenAt: (room.frozenAt ?? new Date()).toISOString(),
    previewQuestion: toPreview(room.questions[0]),
  }));
}

/** 아카이브 목록에 쓰는 URL. 방 경로(/room/*)는 robots.txt에서 막혀 있어 따로 둔다. */
export function archivePath(roomId: string): string {
  return `/archive/${encodeURIComponent(roomId)}`;
}
