import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ListChecks, Users } from "lucide-react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { archivePath, getArchivedRooms } from "@/lib/room-archive";

export const metadata: Metadata = {
  title: "지난 방 결과 모음 - 사람들이 실제로 답한 집계",
  description:
    "Deerlink 공개방에서 실제로 모인 답변 결과를 모아뒀어요. 어떤 질문에 사람들이 어떻게 답했는지 그대로 볼 수 있어요.",
  alternates: { canonical: "/archive" },
};

export const revalidate = 300;

export default async function ArchivePage() {
  const rooms = await getArchivedRooms({ limit: 50 }).catch(() => []);

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 tracking-tight">
            <AntlerLogo className="w-3 h-[15px] text-amber-500" />
            Deerlink
          </span>
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
            지난 방 결과 모음
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            사람이 충분히 모인 공개방은 끝난 뒤에도 결과가 그대로 남아요. 익명 집계라
            누가 답했는지는 나오지 않아요.
          </p>
        </header>

        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-amber-100 bg-white px-6 py-14 text-center">
            <Users className="mx-auto mb-5 h-9 w-9 text-stone-300" aria-hidden="true" />
            <p className="text-sm text-stone-600">아직 보존된 방이 없어요.</p>
            <p className="mt-1 text-xs text-stone-600">
              공개방에 사람이 충분히 모이면 끝난 뒤에도 여기 남아요.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-500"
            >
              지금 열린 공개방 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={archivePath(room.id)}
                  className="group block rounded-2xl border border-amber-100 bg-white p-5 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                >
                  <p className="text-base font-bold leading-snug text-stone-900">{room.title}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                      {room.questionCount}개
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {room.participantCount}명이 답함
                    </span>
                  </div>
                  {room.previewQuestion && (
                    <p className="mt-4 line-clamp-2 border-t border-stone-100 pt-4 text-sm leading-snug text-stone-700">
                      {room.previewQuestion.title}
                    </p>
                  )}
                  <span className="mt-4 flex min-h-11 items-end justify-between gap-3 text-sm font-semibold text-amber-800">
                    결과 보기
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
