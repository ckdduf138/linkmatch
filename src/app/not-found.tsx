import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0a07] flex flex-col items-center justify-center gap-10 px-4">
      <svg
        viewBox="0 0 24 28"
        fill="none"
        stroke="#e8a038"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-12 opacity-30"
        aria-hidden="true"
      >
        <path d="M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4" />
        <path d="M5.5 9 C3 7 1.5 5 2 2" />
        <path d="M7.5 14 C5 13 3.5 11 4 8" />
        <path d="M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4" />
        <path d="M18.5 9 C21 7 22.5 5 22 2" />
        <path d="M16.5 14 C19 13 20.5 11 20 8" />
      </svg>

      <div className="text-center">
        <div className="text-[96px] font-bold leading-none tracking-tight text-stone-800 mb-6">
          404
        </div>
        <p className="text-stone-400 text-base mb-2">
          찾을 수 없는 페이지예요
        </p>
        <p className="text-stone-600 text-sm">
          링크가 만료됐거나 잘못된 주소일 수 있어요
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-200 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
