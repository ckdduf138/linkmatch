import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "친구들의 답은 언제 볼 수 있나요?",
    answer:
      "비공개방에서는 내가 모든 질문에 답한 뒤 열려요. 아직 답하지 않은 질문이 있으면 다른 사람의 선택은 보이지 않아요.",
  },
  {
    question: "공개방과 비공개방은 무엇이 다른가요?",
    answer:
      "비공개방은 링크를 받은 사람만 참여하고 닉네임으로 답을 비교해요. 공개방은 누구나 결과를 볼 수 있고 닉네임 없이 익명으로 답해요.",
  },
  {
    question: "만든 방은 얼마나 유지되나요?",
    answer: "비공개방은 24시간, 공개방은 7일 동안 유지되고 그 뒤에는 자동으로 삭제돼요. 공개방이 더 오래 남는 건 다른 사람들이 둘러보고 답할 시간이 필요해서예요.",
  },
  {
    question: "회원가입이나 결제가 필요한가요?",
    answer: "필요하지 않아요. 회원가입 없이 무료로 방을 만들고 링크를 공유할 수 있어요.",
  },
];

/**
 * FAQPage 스키마 — 이 4개 문답이 랜딩의 유일한 본문 텍스트다.
 * 답변 문구를 고치면 화면과 스키마가 같이 움직이도록 FAQS 하나만 본다.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export function FaqSection() {
  return (
    <section className="border-t border-amber-100 bg-white px-6 py-24 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">시작하기 전에</h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-stone-600">
            결과 공개 방식과 보관 기간처럼, 방을 만들기 전에 알아야 할 내용을 모았어요.
          </p>
        </div>

        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {FAQS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold text-stone-900 marker:hidden">
                {item.question}
                <Plus
                  className="h-5 w-5 flex-shrink-0 text-amber-700 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-xl pb-5 text-base leading-relaxed text-stone-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
