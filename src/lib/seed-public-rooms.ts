import { packQuestions, QUESTION_PACKS } from "@/data/question-packs";
import { prisma } from "./prisma";
import { roomExpiresAt } from "./room-lifetime";

/**
 * 랜딩의 "한 번 답해보세요"와 /discover는 살아 있는 공개방으로 채워진다.
 * 공개방이 0개가 되는 순간 처음 온 방문자는 죽은 사이트를 보게 되므로,
 * 최소 개수만큼은 테마 방으로 채워둔다.
 *
 * 참여자 0명으로 시작하는 건 의도한 것이다 — 발견 피드의 기본 정렬이 인기순이라
 * 사람이 실제로 답한 방이 항상 이 방들보다 위에 온다. 자리를 뺏지 않고 빈자리만 메운다.
 */
export const PUBLIC_ROOM_FLOOR = 5;

export async function topUpPublicRooms(): Promise<number> {
  const live = await prisma.room.findMany({
    where: { isPublic: true, expiresAt: { gt: new Date() } },
    select: { title: true },
  });

  const shortfall = PUBLIC_ROOM_FLOOR - live.length;
  if (shortfall <= 0) return 0;

  const liveTitles = new Set(live.map((room) => room.title));
  const packs = QUESTION_PACKS.filter((pack) => !liveTitles.has(pack.roomTitle)).slice(
    0,
    shortfall
  );

  for (const pack of packs) {
    await prisma.room.create({
      data: {
        title: pack.roomTitle,
        isPublic: true,
        expiresAt: roomExpiresAt(true),
        questions: {
          create: packQuestions(pack).map((question, order) => ({
            type: question.type,
            title: question.title,
            optionA: question.optionA,
            optionB: question.optionB,
            options: question.options ? JSON.stringify(question.options) : null,
            order,
          })),
        },
      },
    });
  }

  return packs.length;
}
