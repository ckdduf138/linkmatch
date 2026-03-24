import type { Metadata, Viewport } from "next";
import { Gowun_Dodum } from "next/font/google";
import "./globals.css";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gowun-dodum",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
    "투표",
    "설문조사",
    "Answer Lock",
    "Deerlink",
    "디어링크",
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
  verification: {
    google: "P6K0w_olXohe-HY7SjqzGxOT4_Pvtx97_7FIXKicZkM",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Deerlink",
  url: baseUrl,
  description:
    "링크 하나로 그룹 전체가 같은 질문에 답하고 서로의 선택을 한꺼번에 비교하는 서비스. 밸런스게임, 객관식, 주관식 질문 지원.",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko-KR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={gowunDodum.variable}>
      <head>
        <meta name="naver-site-verification" content="e27d20053691ae1e1d1d23a7a14da0d60cccf90d" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
