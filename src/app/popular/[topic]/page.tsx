import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { PopularNav } from "@/components/popular/popular-nav";
import { PopularQuestionList } from "@/components/popular/question-list";
import {
  findTopic,
  QUESTION_TOPICS,
  topicPack,
  topicQuestions,
  type QuestionTopic,
} from "@/data/question-topics";

export function generateStaticParams() {
  return QUESTION_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = findTopic(slug);
  if (!topic) return {};

  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    keywords: topic.keywords,
    alternates: { canonical: `/popular/${topic.slug}` },
    openGraph: {
      title: `${topic.metaTitle} | Deerlink`,
      description: topic.metaDescription,
      url: `/popular/${topic.slug}`,
    },
  };
}

function jsonLd(topic: QuestionTopic, baseUrl: string) {
  const questions = topicQuestions(topic);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: topic.metaTitle,
        description: topic.metaDescription,
        numberOfItems: questions.length,
        itemListElement: questions.map((question, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: question.title,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "인기 질문",
            item: `${baseUrl}/popular`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: topic.label,
            item: `${baseUrl}/popular/${topic.slug}`,
          },
        ],
      },
    ],
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = findTopic(slug);
  if (!topic) notFound();

  const questions = topicQuestions(topic);
  const pack = topicPack(topic);
  const others = QUESTION_TOPICS.filter((item) => item.slug !== topic.slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deerlink.kr";
  const startHref = pack ? `/create?pack=${encodeURIComponent(pack.id)}` : "/create";

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(topic, baseUrl)) }}
      />

      <PopularNav />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <Link
          href="/popular"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          인기 질문 전체
        </Link>

        <header className="mt-4 mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-[1.1] mb-6">
            {topic.headingTop}
            <br />
            <span className="text-stone-500">{topic.headingBottom}</span>
          </h1>
          <p className="text-base text-stone-600 leading-relaxed mb-8 max-w-xl">{topic.intro}</p>
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/30 hover:-translate-y-0.5"
          >
            {pack ? `${pack.title} 테마로 방 만들기` : "방 만들기 시작"}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </header>

        <PopularQuestionList questions={questions} showType />

        <section className="mt-20 rounded-3xl bg-amber-50 border border-amber-100 px-8 py-14 text-center">
          <AntlerLogo className="w-10 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight mb-4">
            마음에 드는 질문 있었나요?
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-8 max-w-md mx-auto">
            질문을 고르면 방이 만들어지고, 링크를 보내면 친구들이 답합니다. 회원가입 없이
            30초면 끝나요.
          </p>
          <Link
            href={startHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/40 hover:-translate-y-0.5"
          >
            지금 방 만들기
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </section>

        <section className="mt-16" aria-labelledby="other-topics-heading">
          <h2
            id="other-topics-heading"
            className="mb-5 text-xl font-bold tracking-tight text-stone-900"
          >
            다른 자리에서 쓸 질문
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/popular/${item.slug}`}
                className="group rounded-2xl border border-amber-100 bg-white p-5 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
              >
                <p className="text-base font-bold text-stone-900">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-600">{item.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-800">
                  질문 {item.questionIds.length}개 보기
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-stone-200 text-center">
          <p className="text-xs text-stone-600">&copy; 2026 Deerlink</p>
        </footer>
      </main>
    </div>
  );
}
