import type { Metadata } from "next";
import { getPublicRooms } from "@/lib/discover-rooms";
import { countArchivedRooms } from "@/lib/room-archive";
import { DiscoverClient } from "./discover-client";

export const metadata: Metadata = {
  title: "공개방 둘러보기 - Deerlink",
  description: "Deerlink에서 공개로 만들어진 방을 둘러보고 참여해보세요.",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const result = await getPublicRooms({ page: 1, sort: "recent" })
    .then((data) => ({ ...data, initialError: null }))
    .catch(() => ({
      rooms: [],
      total: 0,
      hasMore: false,
      initialError: "공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    }));

  // 보존된 방이 하나도 없을 땐 링크를 걸지 않는다. 빈 페이지로 보내는 링크는 없느니만 못하다.
  const archivedCount = await countArchivedRooms().catch(() => 0);

  return (
    <DiscoverClient
      initialRooms={result.rooms}
      initialTotal={result.total}
      initialHasMore={result.hasMore}
      initialError={result.initialError}
      archivedCount={archivedCount}
    />
  );
}
