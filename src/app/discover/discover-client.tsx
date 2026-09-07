"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

export function DiscoverClient({
  initialRooms,
  initialTotal,
  initialHasMore,
  initialError,
  archivedCount,
}: {
  initialRooms: DiscoverRoom[];
  initialTotal: number;
  initialHasMore: boolean;
  initialError: string | null;
  archivedCount: number;
}) {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 tracking-tight">
            <AntlerLogo className="w-3 h-[15px] text-amber-500" />
            Deerlink
          </span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
            공개방 둘러보기
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            질문을 골라 익명으로 답해보세요.
          </p>
        </div>

        <PublicRoomsFeed
          initialRooms={initialRooms}
          initialTotal={initialTotal}
          initialHasMore={initialHasMore}
          initialSort="recent"
          initialError={initialError}
        />

        {archivedCount > 0 && (
          <Link
            href="/archive"
            className="group mt-10 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-white px-5 text-sm text-stone-700 transition-colors hover:border-amber-300 hover:text-stone-900"
          >
            <span>
              끝난 방 결과도 {archivedCount}개 남아 있어요
            </span>
            <ArrowRight
              className="h-4 w-4 flex-shrink-0 text-amber-800 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
