import { prisma } from "@/lib/prisma";
import { DISCOVER_CACHE_TAG } from "@/lib/discover-rooms";
import { freezeExpiredPublicRooms } from "@/lib/room-archive";
import { topUpPublicRooms } from "@/lib/seed-public-rooms";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 삭제보다 먼저 얼려야 한다. 순서가 바뀌면 보존 대상이 그대로 지워진다.
  const frozen = await freezeExpiredPublicRooms();

  const result = await prisma.room.deleteMany({
    where: { expiresAt: { lt: new Date() }, frozenAt: null },
  });

  // 만료 정리 직후가 공개방이 가장 적은 순간이다. 같은 실행에서 바로 채워야
  // 랜딩과 발견 피드가 비어 있는 창이 생기지 않는다.
  const seeded = await topUpPublicRooms();

  if (result.count > 0 || seeded > 0) revalidateTag(DISCOVER_CACHE_TAG, { expire: 0 });

  return NextResponse.json({ frozen, deleted: result.count, seeded });
}
