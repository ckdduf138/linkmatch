import type { Metadata } from "next";
import { getRoomShareInfo, roomShareDescription, roomShareTitle } from "@/lib/room-share";

/**
 * 이 제품의 확산 경로는 단톡방에 붙여넣는 링크 하나다. 방마다 다른 제목과 첫 질문이
 * 미리보기에 떠야 그 링크가 브랜드 광고가 아니라 초대장으로 읽힌다.
 *
 * page.tsx가 아니라 layout에 두는 이유: 메타데이터는 레이아웃을 따라 아래로 내려간다.
 * page.tsx에 두면 /room/[id]/results 와 /room/[id]/share 는 사이트 공용 OG를 그대로 쓴다.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const info = await getRoomShareInfo(id);

  if (!info) {
    return {
      title: "방을 찾을 수 없어요",
      description: "링크가 만료됐거나 잘못된 주소예요. 새 방을 만들어보세요.",
    };
  }

  const title = roomShareTitle(info);
  const description = roomShareDescription(info);
  const imageUrl = `/og/room/${encodeURIComponent(id)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/room/${encodeURIComponent(id)}`,
      siteName: "Deerlink",
      type: "website",
      locale: "ko_KR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} 참여 링크 미리보기`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RoomIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
