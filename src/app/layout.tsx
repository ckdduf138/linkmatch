import type { Metadata } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Deerlink — 링크 하나로 모두의 생각을 비교해요",
    template: "%s | Deerlink",
  },
  description:
    "링크 하나로 그룹 전체가 같은 질문에 답하고 서로의 선택을 한꺼번에 비교해요. 밸런스게임, 객관식, 주관식 질문으로 친구들의 속마음을 알아보세요.",
  keywords: [
    "밸런스게임",
    "그룹 설문",
    "의견 비교",
    "링크 공유",
    "친구 비교",
    "가치관 비교",
    "Deerlink",
  ],
  openGraph: {
    title: "우리 생각 얼마나 다를까? | Deerlink",
    description:
      "링크 하나 공유하면 끝. 모두가 답할 때까지 서로의 선택은 비밀, 그 뒤엔 한꺼번에 공개.",
    siteName: "Deerlink",
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "우리 생각 얼마나 다를까? | Deerlink",
    description:
      "링크 하나 공유하면 끝. 모두가 답할 때까지 서로의 선택은 비밀.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
