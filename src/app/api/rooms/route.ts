import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, questions } = body as {
    title: string;
    questions: {
      type: "balance" | "multiple" | "subjective";
      title: string;
      optionA?: string;
      optionB?: string;
      options?: string[];
    }[];
  };

  if (!title || !questions?.length) {
    return NextResponse.json({ error: "제목과 질문이 필요합니다" }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const room = await prisma.room.create({
    data: {
      title,
      expiresAt,
      questions: {
        create: questions.map((q, i) => ({
          type: q.type,
          title: q.title,
          optionA: q.optionA,
          optionB: q.optionB,
          options: q.options ? JSON.stringify(q.options) : null,
          order: i,
        })),
      },
    },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(room);
}
