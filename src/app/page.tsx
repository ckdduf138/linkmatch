import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { PublicRoomsSection } from "@/components/landing/PublicRoomsSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { getPublicRooms } from "@/lib/discover-rooms";

export const revalidate = 30;

/**
 * 공개방 목록은 서버에서 읽는다. 예전엔 클라이언트가 마운트 후 fetch 했는데,
 * 그러면 크롤러와 첫 페인트에는 "공개방을 불러오는 중이에요"만 남는다 — 랜딩의
 * 본문 절반이 통째로 비어 보인다는 뜻이다. getPublicRooms는 이미 캐시된
 * 서버 함수라 여기서 그냥 await 하면 된다.
 */
export default async function Home() {
  const publicRooms = await getPublicRooms({ page: 1, sort: "popular", pageSize: 2 })
    .then((data) => ({ ...data, error: null as string | null }))
    .catch(() => ({
      rooms: [],
      total: 0,
      hasMore: false,
      error: "공개방을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
    }));

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <LandingNav />
      <HeroSection />
      <PublicRoomsSection
        rooms={publicRooms.rooms}
        total={publicRooms.total}
        hasMore={publicRooms.hasMore}
        error={publicRooms.error}
      />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
