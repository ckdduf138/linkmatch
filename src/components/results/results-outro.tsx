import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

/**
 * 결과를 다 본 사람이 다음에 할 일을 놓는 자리.
 *
 * 예전엔 접힌 목록들 맨 밑에 text-xs 링크 하나였는데, 퍼널에서 가장 중요한 전환이
 * 여기다 — 남의 방에 답하러 온 사람이 자기 방을 만드는 순간. 공개방은 링크만 알면
 * 아무나 들어오므로 제품 설명 한 줄도 같이 둔다.
 */
export function ResultsOutro({ isPublic }: { isPublic: boolean }) {
  return (
    <section
      aria-labelledby="results-outro-heading"
      className="mt-12 rounded-3xl border border-amber-100 bg-amber-50 px-6 py-12 text-center sm:px-10"
    >
      <AntlerLogo className="mx-auto mb-6 h-11 w-9 text-amber-500" />
      <h2
        id="results-outro-heading"
        className="text-2xl font-bold leading-snug tracking-tight text-stone-900 md:text-3xl"
      >
        다음 질문도 준비돼 있어요
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-600">
        질문을 고르고 링크를 보내면 끝이에요. 각자 답을 마쳐야 서로의 선택이 열리니까,
        눈치 보고 맞추는 대답이 나오지 않아요. 회원가입은 필요 없어요.
      </p>
      <Link
        href="/create"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-amber-600 px-7 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-colors hover:bg-amber-500"
      >
        내 방 만들기
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        <Link
          href="/popular"
          className="inline-flex min-h-11 items-center text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          질문 모음 보기
        </Link>
        {isPublic && (
          <Link
            href="/discover"
            className="inline-flex min-h-11 items-center text-sm text-stone-600 transition-colors hover:text-stone-900"
          >
            다른 공개방 둘러보기
          </Link>
        )}
      </div>
    </section>
  );
}
