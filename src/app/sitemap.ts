import { MetadataRoute } from "next";
import { QUESTION_TOPICS } from "@/data/question-topics";
import { archivePath, getArchivedRooms } from "@/lib/room-archive";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...QUESTION_TOPICS.map((topic) => ({
      url: `${baseUrl}/popular/${topic.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // 동결 보존된 방은 사람들이 실제로 답한 유일한 색인 대상이다.
  // DB가 죽어도 사이트맵 전체가 깨지면 안 되니 실패는 빈 배열로 흡수한다.
  const archived = await getArchivedRooms({ limit: 500 }).catch(() => []);
  if (archived.length === 0) return staticEntries;

  return [
    ...staticEntries,
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(archived[0].frozenAt),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...archived.map((room) => ({
      url: `${baseUrl}${archivePath(room.id)}`,
      lastModified: new Date(room.frozenAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
