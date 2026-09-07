import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { hasCompletedAnswers, participantCookieName } from "@/lib/participant-session";
import { archivePath } from "@/lib/room-archive";
import { getRoomBundle } from "@/lib/room-query";
import { serializeLobbyRoom } from "@/lib/serialize";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { RoomClient } from "./room-client";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await getRoomBundle(id);

  if (!room) notFound();

  // 동결 보존된 방은 읽기 전용 아카이브가 정본이다. 중복 URL을 만들지 않는다.
  if (room.frozenAt) redirect(archivePath(id));

  // 이미 참여한 사람은 결과 페이지로
  const cookieStore = await cookies();
  const participantId = cookieStore.get(participantCookieName(id))?.value;
  const viewer = room.participants.find((p) => p.id === participantId);
  if (hasCompletedAnswers(viewer, room.questions.length)) {
    redirect(`/room/${id}/results`);
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

  const serializedRoom = serializeLobbyRoom(room);

  return <RoomClient room={serializedRoom} />;
}
