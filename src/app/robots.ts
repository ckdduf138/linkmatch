import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/create"],
      disallow: ["/room/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
