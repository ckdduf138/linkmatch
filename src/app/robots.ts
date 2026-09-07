import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /og/* 는 링크 미리보기 이미지다. 페이스북·카카오 같은 크롤러가 og:image를
      // 가져갈 수 있어야 하므로 /room/, /api/ 와 달리 반드시 열어둔다.
      allow: ["/", "/create", "/popular", "/discover", "/archive", "/og/"],
      disallow: ["/room/", "/api/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
