import Link from "next/link";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

export function PopularNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-[#fafaf8]/80 backdrop-blur-md border-b border-amber-100/50">
      <Link
        href="/"
        className="flex min-h-11 items-center gap-2 text-sm font-semibold text-stone-900 tracking-tight"
      >
        <AntlerLogo className="w-3.5 h-[18px] text-amber-500" />
        Deerlink
      </Link>
      <Link
        href="/create"
        className="flex min-h-11 items-center px-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
      >
        방 만들기 &rarr;
      </Link>
    </nav>
  );
}
