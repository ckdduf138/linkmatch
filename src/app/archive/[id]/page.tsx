import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archivePath } from "@/lib/room-archive";
import { getRoomBundle } from "@/lib/room-query";
import { getRoomShareInfo, roomShareDescription } from "@/lib/room-share";
import { serializeResultsRoom } from "@/lib/serialize";
import { ResultsClient } from "@/app/room/[id]/results/results-client";

/**
 * 동결 보존된 방의 영구 페이지.
 *
 * /room/* 은 robots.txt에서 막혀 있어서(만료되는 방을 색인시킬 이유가 없다) 여기로 분리했다.
 * 이 경로만 색인 대상이고, 실제 사람들이 답한 집계가 그대로 남는 유일한 자산이다.
 */
// 동결된 방의 내용은 두 번 다시 바뀌지 않는다. 색인 대상이니 매 요청마다 DB를 칠 이유가 없다.
export const revalidate = 86400;

async function findFrozenRoom(id: string) {
  const room = await getRoomBundle(id);
  return room?.frozenAt ? room : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const info = await getRoomShareInfo(id);
  if (!info || !info.frozen) return { robots: { index: false, follow: false } };

  const description = roomShareDescription(info);
  const imageUrl = `/og/room/${encodeURIComponent(id)}`;

  return {
    title: `${info.title} - ${info.participantCount}명의 답변 결과`,
    description,
    alternates: { canonical: archivePath(id) },
    robots: { index: true, follow: true },
    openGraph: {
      title: info.title,
      description,
      url: archivePath(id),
      siteName: "Deerlink",
      type: "article",
      locale: "ko_KR",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${info.title} 결과` }],
    },
    twitter: {
      card: "summary_large_image",
      title: info.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArchivedRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await findFrozenRoom(id);
  if (!room) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "지난 방 결과", item: `${baseUrl}/archive` },
      {
        "@type": "ListItem",
        position: 2,
        name: room.title,
        item: `${baseUrl}${archivePath(id)}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ResultsClient room={serializeResultsRoom(room)} archived />
    </>
  );
}
