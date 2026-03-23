import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: "asc" } },
      participants: {
        include: { answers: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  }

  if (new Date(room.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  return NextResponse.json(room);
}
