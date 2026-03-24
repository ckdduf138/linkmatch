import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: roomId } = await params;
  const body = await request.json();
  const { nickname, answers } = body as {
    nickname: string;
    answers: { questionId: string; value: string }[];
  };

  if (!nickname || !answers?.length) {
    return NextResponse.json({ error: "닉네임과 답변이 필요합니다" }, { status: 400 });
  }

  // Verify room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { questions: true },
  });

  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  }

  // Create participant and answers in a transaction
  const participant = await prisma.$transaction(async (tx) => {
    const p = await tx.participant.create({
      data: { roomId, nickname },
    });

    await tx.answer.createMany({
      data: answers.map((a) => ({
        questionId: a.questionId,
        participantId: p.id,
        value: a.value,
      })),
    });

    return p;
  });

  return NextResponse.json(participant);
}
