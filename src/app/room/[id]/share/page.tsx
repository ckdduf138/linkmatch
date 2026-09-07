import Link from "next/link";
import { notFound } from "next/navigation";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { prisma } from "@/lib/prisma";
import { serializeLobbyRoom } from "@/lib/serialize";
import { ShareRoomClient } from "./share-room-client";

export default async function ShareRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!room) notFound();

  if (room.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#fafaf8] px-4">
        <AntlerLogo className="h-12 w-10 text-stone-300" />
        <div className="text-center">
          <h1 className="mb-2 text-xl font-bold text-stone-900">방이 만료됐어요</h1>
          <p className="text-sm text-stone-600">보관 기간이 지나 초대 링크를 쓸 수 없어요.</p>
        </div>
        <Link
          href="/create"
          className="inline-flex min-h-11 items-center rounded-xl bg-amber-600 px-5 text-sm font-medium text-white transition-colors hover:bg-amber-500"
        >
          새 방 만들기
        </Link>
      </main>
    );
  }

  return <ShareRoomClient room={serializeLobbyRoom(room)} />;
}
