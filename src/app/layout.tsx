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
    default: "밸런스게임 만들기 | 무료 온라인 투표·의견 비교 - Deerlink",
    template: "%s | Deerlink",
  },
  description:
    "링크 하나로 밸런스게임, 투표, 설문을 만들고 친구들과 생각을 비교해요. 술자리 게임, MT 단체 게임, 이심전심 게임, 고민 나누기까지. 회원가입 없이 무료로 시작하세요.",
  keywords: [
    "밸런스게임",
    "밸런스게임 만들기",
    "밸런스게임 사이트",
    "밸런스게임 질문",
    "밸런스게임 질문 모음",
    "밸런스게임 링크",
    "온라인 밸런스게임",
    "커플 밸런스게임",
    "웃긴 밸런스게임",
    "온라인 투표 만들기",
    "무료 투표 만들기",
    "링크 투표",
    "온라인 설문 만들기",
    "무료 설문 도구",
    "그룹 설문",
    "그룹 투표",
    "술자리 게임",
    "이심전심 게임",
    "MT 게임",
    "단체 게임",
    "워크샵 게임",
    "팀빌딩 게임",
    "아이스브레이킹 게임",
    "친구와 할 수 있는 게임",
    "의견 비교",
    "생각 비교",
    "가치관 비교",
    "가치관 테스트",
    "커플 가치관 테스트",
    "친구 궁합",
    "고민 나누기",
    "링크 공유",
    "링크 공유 게임",
    "회원가입 없는 설문",
    "설문조사",
    "투표",
    "Deerlink",
    "디어링크",
  ],
  openGraph: {
    title: "밸런스게임 만들기 - 우리 생각 얼마나 다를까? | Deerlink",
    description:
      "밸런스게임, 투표, 설문을 링크 하나로. 모두가 답할 때까지 서로의 선택은 비밀, 그 뒤엔 한꺼번에 공개.",
    siteName: "Deerlink",
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Deerlink — 밸런스게임 만들기, 링크 하나로 의견 비교" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "밸런스게임 만들기 - 우리 생각 얼마나 다를까? | Deerlink",
    description:
      "밸런스게임, 투표, 설문을 링크 하나로. 모두가 답할 때까지 서로의 선택은 비밀.",
    images: ["/opengraph-image"],
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

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Deerlink",
  alternateName: "디어링크",
  url: baseUrl,
  description:
    "밸런스게임 만들기, 온라인 투표, 그룹 설문을 링크 하나로 만들고 공유하는 무료 플랫폼. 술자리 게임, MT 단체 게임, 이심전심 게임, 고민 나누기까지 지원합니다.",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko-KR",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Deerlink는 무료인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 완전 무료입니다. 회원가입도 필요 없어요.",
      },
    },
    {
      "@type": "Question",
      name: "몇 명까지 참여할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "인원 제한 없이 링크를 공유하면 누구나 참여할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 질문 유형을 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "밸런스 게임(A vs B), 객관식, 주관식 세 가지 유형을 지원합니다.",
      },
    },
    {
      "@type": "Question",
      name: "답변 결과는 언제 공개되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "모든 참여자가 답변을 완료해야 결과가 공개됩니다. 미리 볼 수 없어요.",
      },
    },
    {
      "@type": "Question",
      name: "링크는 얼마나 유효한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "생성 후 24시간 동안 유효합니다.",
      },
    },
    {
      "@type": "Question",
      name: "밸런스게임 질문은 직접 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 밸런스게임(A vs B), 객관식, 주관식 질문을 자유롭게 만들 수 있습니다. 인기 질문 모음에서 바로 추가할 수도 있어요.",
      },
    },
    {
      "@type": "Question",
      name: "술자리나 MT에서도 사용할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 링크 하나만 공유하면 되기 때문에 술자리, MT, 워크샵, 팀빌딩 등 어떤 모임에서도 바로 사용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "이심전심 게임처럼 서로 답을 비교할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 모든 참여자가 답변을 완료하면 한꺼번에 결과가 공개되어 서로의 생각을 비교할 수 있습니다. 답변 전에는 다른 사람의 선택을 볼 수 없어요.",
      },
    },
    {
      "@type": "Question",
      name: "고민이나 의견을 익명으로 나눌 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "닉네임만 입력하면 참여할 수 있어 익명 또는 별명으로 자유롭게 의견을 나눌 수 있습니다. 회원가입이 필요 없어요.",
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
