import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PopularQuestion } from "@/data/popular-questions";
import { QUESTION_META } from "@/lib/question-meta";

/**
 * /popular 과 /popular/[topic] 이 같은 카드를 쓴다.
 * 카드 테두리는 유형과 무관하게 amber 단색이다 — 예전엔 객관식만 teal 테두리였는데,
 * teal은 밸런스 B 옵션 대비색이라 카드 계열색으로 쓰면 의미가 두 개가 된다.
 */
function QuestionBody({ question }: { question: PopularQuestion }) {
  if (question.type === "balance") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="py-2 px-3 rounded-lg border border-amber-100 bg-amber-50 text-xs font-medium text-amber-900 text-center">
          {question.optionA}
        </div>
        <div className="py-2 px-3 rounded-lg border border-teal-100 bg-teal-50 text-xs font-medium text-teal-900 text-center">
          {question.optionB}
        </div>
      </div>
    );
  }

  if (question.type === "multiple") {
    return (
      <ul className="space-y-1.5">
        {question.options?.map((option) => (
          <li key={option} className="flex items-center gap-2 text-xs text-stone-600">
            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
            {option}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export function PopularQuestionCard({
  question,
  index,
  showType,
}: {
  question: PopularQuestion;
  index: number;
  showType: boolean;
}) {
  const meta = QUESTION_META[question.type];

  return (
    <li className="rounded-2xl border border-amber-100 bg-white p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs tabular-nums text-amber-700">
          {String(index + 1).padStart(2, "0")}
        </span>
        {showType && (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}
          >
            {meta.label}
          </span>
        )}
      </div>
      <h3 className="mb-3 text-base font-semibold leading-snug text-stone-900">
        {question.title}
      </h3>
      <QuestionBody question={question} />
      <Link
        href={`/create?question=${encodeURIComponent(question.id)}`}
        className="mt-4 flex min-h-11 items-center justify-end gap-1.5 border-t border-amber-100 pt-3 text-sm font-semibold text-amber-800 transition-colors hover:text-amber-950"
      >
        이 질문으로 시작
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </li>
  );
}

export function PopularQuestionList({
  questions,
  showType = false,
}: {
  questions: PopularQuestion[];
  showType?: boolean;
}) {
  return (
    <ol className="space-y-4">
      {questions.map((question, index) => (
        <PopularQuestionCard
          key={question.id}
          question={question}
          index={index}
          showType={showType}
        />
      ))}
    </ol>
  );
}
