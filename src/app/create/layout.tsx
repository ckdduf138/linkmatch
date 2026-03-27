import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "밸런스게임 만들기 - 무료 온라인 투표·설문",
  description:
    "밸런스게임, 객관식, 주관식 질문으로 나만의 방을 만들고 링크를 공유하세요. 인기 질문 모음에서 바로 추가 가능. 술자리, MT, 모임에서 바로 사용할 수 있어요. 회원가입 없이 무료.",
  openGraph: {
    title: "밸런스게임 만들기 | Deerlink",
    description:
      "밸런스게임, 객관식, 주관식 질문을 만들고 링크 하나로 공유하세요. 무료, 회원가입 불필요.",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
