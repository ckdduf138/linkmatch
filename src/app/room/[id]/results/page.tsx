import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { canViewResults, participantCookieName } from "@/lib/participant-session";
import { archivePath } from "@/lib/room-archive";
import { getRoomBundle } from "@/lib/room-query";
import { serializeResultsRoom } from "@/lib/serialize";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { ResultsClient } from "./results-client";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await getRoomBundle(id);

  if (!room) notFound();

  if (room.frozenAt) redirect(archivePath(id));

  // 모든 질문에 답변한 참여자만 결과 열람 가능 — 단, 공개방은 링크를 아는
  // 아무나 결과를 볼 수 있는 게 의도된 동작이라 이 게이트를 건너뛴다.
  const cookieStore = await cookies();
  const participantId = cookieStore.get(participantCookieName(id))?.value;
  const viewer = room.participants.find((p) => p.id === participantId);

  if (!canViewResults({
    isPublic: room.isPublic,
    participant: viewer,
    totalQuestions: room.questions.length,
  })) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6 px-4">
        <AntlerLogo className="w-10 h-12 text-stone-300" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-2">
            참여 후 결과를 볼 수 있어요
          </h1>
          <p className="text-sm text-stone-500">
            질문에 답변하면 모두의 결과를 확인할 수 있어요
          </p>
        </div>
        <Link
          href={`/room/${id}`}
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          답변하러 가기
        </Link>
      </div>
    );
  }

  if (new Date(room.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6 px-4">
        <AntlerLogo className="w-10 h-12 text-stone-300" />
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-2">
            방이 만료됐어요
          </h1>
          <p className="text-sm text-stone-500">
            보관 기간이 지나 더 이상 접근할 수 없어요
          </p>
        </div>
        <Link
          href="/create"
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
        >
          새 방 만들기
        </Link>
      </div>
    );
  }

  const serializedRoom = serializeResultsRoom(room);

  return <ResultsClient room={serializedRoom} />;
}
