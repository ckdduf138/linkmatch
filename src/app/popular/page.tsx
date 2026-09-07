import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { PopularNav } from "@/components/popular/popular-nav";
import { PopularQuestionList } from "@/components/popular/question-list";
import { POPULAR_QUESTIONS } from "@/data/popular-questions";
import { QUESTION_TOPICS } from "@/data/question-topics";
import { QUESTION_META } from "@/lib/question-meta";
import type { QuestionType } from "@/lib/types";

export const metadata: Metadata = {
  title: "밸런스게임 질문 모음 28선 - 단톡방과 MT에서 바로 쓰는 인기 질문",
  description:
    "친구들과 단톡방, MT, 회식, 술자리에서 바로 쓸 수 있는 인기 밸런스게임 질문 11개, 객관식 10개, 주관식 7개를 모았어요. 내가 답을 마치면 친구들의 선택이 열립니다.",
  alternates: {
    canonical: "/popular",
  },
  openGraph: {
    title: "밸런스게임 질문 모음 28선 | Deerlink",
    description:
      "단톡방과 MT에서 바로 쓰는 인기 밸런스게임, 객관식, 주관식 질문 모음. 링크 하나로 공유.",
    url: "/popular",
  },
  keywords: [
    "밸런스게임 질문",
    "밸런스게임 질문 모음",
    "인기 밸런스게임",
    "밸런스게임 추천",
    "단톡방 밸런스게임",
    "단톡방 질문",
    "MT 밸런스게임",
    "MT 질문",
    "술자리 게임 질문",
    "친구와 할 수 있는 게임",
    "커플 밸런스게임 질문",
    "웃긴 밸런스게임",
  ],
};

const balance = POPULAR_QUESTIONS.filter((q) => q.type === "balance");
const multiple = POPULAR_QUESTIONS.filter((q) => q.type === "multiple");
const subjective = POPULAR_QUESTIONS.filter((q) => q.type === "subjective");

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "밸런스게임 질문 모음 28선",
  description: "단톡방, MT, 술자리에서 바로 쓰는 인기 질문 모음",
  numberOfItems: POPULAR_QUESTIONS.length,
  itemListElement: POPULAR_QUESTIONS.map((q, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: q.title,
  })),
};

export default function PopularPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <PopularNav />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
            단톡방에서 바로 쓰는
            <br />
            <span className="text-stone-500">밸런스게임 질문 28선</span>
          </h1>
          <p className="text-base text-stone-600 leading-relaxed mb-8 max-w-xl">
            친구들과 단톡방, MT, 술자리, 회식에서 바로 쓸 수 있는 밸런스게임,
            객관식, 주관식 질문을 모았어요. 마음에 드는 질문을 골라 링크 하나로
            공유하면, 내가 모든 질문에 답한 뒤 친구들의 선택과 결과를 볼 수 있어요.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/30 hover:-translate-y-0.5"
          >
            방 만들기 시작
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </header>

        <section aria-labelledby="topics-heading" className="border-y border-amber-100 py-10">
          <h2
            id="topics-heading"
            className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900"
          >
            어떤 자리에서 쓸 건가요?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
            자리에 맞게 골라둔 묶음이에요. 하나를 고르면 그 주제 질문만 모아서 보고, 바로
            방까지 만들 수 있어요.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {QUESTION_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/popular/${topic.slug}`}
                className="group rounded-2xl border border-amber-100 bg-white p-5 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
              >
                <p className="text-base font-bold text-stone-900">{topic.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">{topic.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-800">
                  질문 {topic.questionIds.length}개 보기
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Section
          type="balance"
          count={balance.length}
          title="둘 중 하나만 골라야 한다면?"
          description="가치관, 취향, 인간관계까지, 양자택일로 친구들의 진짜 생각을 확인하는 질문들이에요. 단톡방, MT, 커플 데이트에서 가장 많이 쓰는 유형."
        >
          <PopularQuestionList questions={balance} />
        </Section>

        <Section
          type="multiple"
          count={multiple.length}
          title="여러 선택지 중에 가장 가까운 건?"
          description="간단한 객관식 질문으로 그룹 내 성향을 빠르게 비교. 가치관 테스트, 팀 빌딩, 아이스브레이킹에 잘 맞아요."
        >
          <PopularQuestionList questions={multiple} />
        </Section>

        <Section
          type="subjective"
          count={subjective.length}
          title="자유롭게 답하는 질문들"
          description="형식 없는 짧은 답변으로 의외의 진심을 모으는 질문. 모임의 마지막에 던지면 분위기가 깊어져요."
        >
          <PopularQuestionList questions={subjective} />
        </Section>

        <section className="mt-20 rounded-3xl bg-amber-50 border border-amber-100 px-8 py-14 text-center">
          <AntlerLogo className="w-10 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-4">
            마음에 드는 질문 있었나요?
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-8 max-w-md mx-auto">
            지금 방을 만들면 인기 질문 시트에서 위 질문들을 그대로 가져올 수
            있어요. 회원가입 없이 30초면 링크 완성.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/40 hover:-translate-y-0.5"
          >
            지금 방 만들기
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </section>

        <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-600">&copy; 2026 Deerlink</p>
        </footer>
      </main>
    </div>
  );
}

function Section({
  type,
  count,
  title,
  description,
  children,
}: {
  type: QuestionType;
  count: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const meta = QUESTION_META[type];
  const Icon = meta.icon;
  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="flex items-center gap-2.5 text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-3">
          <Icon className={`h-5 w-5 flex-shrink-0 ${meta.accent}`} aria-hidden="true" />
          {title}
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed max-w-xl">
          {description}
        </p>
        <span
          className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${meta.badge}`}
        >
          {meta.longLabel} {count}선
        </span>
      </div>
      {children}
    </section>
  );
}
