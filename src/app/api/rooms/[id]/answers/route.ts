import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  PARTICIPANT_COOKIE_MAX_AGE,
  participantCookieName,
} from "@/lib/participant-session";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";
import { extendedPublicExpiry } from "@/lib/room-lifetime";
import { getSubmissionContext } from "@/lib/room-query";
import { DISCOVER_CACHE_TAG } from "@/lib/discover-rooms";
import { parseOptions } from "@/lib/types";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const NICKNAME_MAX = 20;
const VALUE_MAX = 500;
const QUESTION_ID_MAX = 100;
const MAX_ANSWERS = 20;
const SUBMISSION_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface AnswerInput {
  questionId: string;
  value: string;
}

interface SubmittedParticipant {
  id: string;
  roomId: string;
  nickname: string;
  createdAt: Date;
}

function validAnswers(answers: unknown): answers is AnswerInput[] {
  if (!Array.isArray(answers) || answers.length === 0 || answers.length > MAX_ANSWERS) {
    return false;
  }

  return answers.every((answer) => {
    if (typeof answer !== "object" || answer === null) return false;
    const { questionId, value } = answer as Record<string, unknown>;
    return (
      typeof questionId === "string" &&
      questionId.length > 0 &&
      questionId.length <= QUESTION_ID_MAX &&
      typeof value === "string" &&
      value.length <= VALUE_MAX
    );
  });
}

function validValue(
  question: { type: string; options: string | null },
  value: string
): boolean {
  if (question.type === "balance") return value === "A" || value === "B";

  if (question.type === "multiple") {
    if (!/^\d+$/.test(value)) return false;
    const optionIndex = Number(value);
    const options = parseOptions(question.options);
    return optionIndex >= 0 && optionIndex < options.length;
  }

  if (question.type === "subjective") return value.trim().length > 0;
  return false;
}

function participantIdFor(roomId: string, submissionId: string): string {
  const digest = createHash("sha256")
    .update(`${roomId}:${submissionId}`)
    .digest("hex")
    .slice(0, 40);
  return `submission_${digest}`;
}

function participantResponse({
  participant,
  roomId,
  status,
  startedAt,
  dbDurationMs,
}: {
  participant: SubmittedParticipant;
  roomId: string;
  status: "created" | "replayed" | "recovered";
  startedAt: number;
  dbDurationMs: number;
}) {
  const totalDurationMs = performance.now() - startedAt;
  const response = NextResponse.json(participant, {
    headers: {
      "Server-Timing": `db;dur=${dbDurationMs.toFixed(1)}, total;dur=${totalDurationMs.toFixed(1)}`,
      "X-Submission-Status": status,
    },
  });

  response.cookies.set(participantCookieName(roomId), participant.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARTICIPANT_COOKIE_MAX_AGE,
  });

  if (totalDurationMs >= 750) {
    console.warn(
      JSON.stringify({
        event: "slow_answer_submission",
        totalMs: Math.round(totalDurationMs),
        dbMs: Math.round(dbDurationMs),
        region: process.env.VERCEL_REGION ?? "local",
        status,
      })
    );
  }

  return response;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = performance.now();
  let dbDurationMs = 0;
  const { id: roomId } = await params;

  const limit = checkRateLimit(`answers:${clientKey(request)}`, 30, 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "너무 많이 시도했어요. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "잘못된 요청이에요" }, { status: 400 });
  }

  const { nickname, answers, submissionId } = body as {
    nickname: unknown;
    answers: unknown;
    submissionId: unknown;
  };

  if (typeof submissionId !== "string" || !SUBMISSION_ID_PATTERN.test(submissionId)) {
    return NextResponse.json(
      { error: "제출 정보를 확인할 수 없어요. 페이지를 새로고침한 뒤 다시 시도해주세요." },
      { status: 400 }
    );
  }

  if (!validAnswers(answers)) {
    return NextResponse.json({ error: "답변 형식을 확인해주세요" }, { status: 400 });
  }

  const cookieParticipantId = request.cookies.get(participantCookieName(roomId))?.value;
  const deterministicParticipantId = participantIdFor(roomId, submissionId);
  const candidateIds = [cookieParticipantId, deterministicParticipantId].filter(
    (candidate): candidate is string => typeof candidate === "string"
  );

  // 방·문항과 "이 사람이 이미 참여자인가"를 한 왕복에 읽는다. 예전엔 조회 두 개였고,
  // libSQL은 요청을 직렬화하니 그게 곧 왕복 두 번이었다.
  const contextStartedAt = performance.now();
  const context = await getSubmissionContext(roomId, candidateIds);
  dbDurationMs += performance.now() - contextStartedAt;

  if (!context) {
    return NextResponse.json({ error: "방을 찾을 수 없습니다" }, { status: 404 });
  }

  const room = context.room;
  const existingParticipant = context.participant;

  if (new Date(room.expiresAt) < new Date()) {
    return NextResponse.json({ error: "만료된 방이에요" }, { status: 410 });
  }

  if (!room.isPublic) {
    if (typeof nickname !== "string" || !nickname.trim() || nickname.length > NICKNAME_MAX) {
      return NextResponse.json({ error: "닉네임을 확인해주세요" }, { status: 400 });
    }
  }

  const deduped = [...new Map(answers.map((answer) => [answer.questionId, answer])).values()];
  if (deduped.length !== answers.length || deduped.length !== room.questions.length) {
    return NextResponse.json({ error: "모든 질문에 한 번씩 답변해주세요" }, { status: 400 });
  }

  const questionsById = new Map(room.questions.map((question) => [question.id, question]));
  if (
    !deduped.every((answer) => {
      const question = questionsById.get(answer.questionId);
      return question ? validValue(question, answer.value) : false;
    })
  ) {
    return NextResponse.json({ error: "답변 내용을 확인해주세요" }, { status: 400 });
  }

  const existingQuestionIds = new Set(existingParticipant?.answeredQuestionIds ?? []);
  const hasCompletedExistingSubmission = room.questions.every((question) =>
    existingQuestionIds.has(question.id)
  );

  if (existingParticipant && hasCompletedExistingSubmission) {
    return participantResponse({
      participant: {
        id: existingParticipant.id,
        roomId: existingParticipant.roomId,
        nickname: existingParticipant.nickname,
        createdAt: existingParticipant.createdAt,
      },
      roomId,
      status: "replayed",
      startedAt,
      dbDurationMs,
    });
  }

  const participantId = existingParticipant?.id ?? deterministicParticipantId;
  const writeStartedAt = performance.now();
  const writeResult = await prisma.$transaction(async (tx) => {
    if (existingParticipant) {
      await tx.answer.deleteMany({ where: { participantId } });
      await tx.answer.createMany({
        data: deduped.map((answer) => ({
          questionId: answer.questionId,
          participantId,
          value: answer.value,
        })),
      });
      const recoveredParticipant = await tx.participant.findUniqueOrThrow({
        where: { id: participantId },
      });
      return { participant: recoveredParticipant, status: "recovered" as const };
    }

    const resolvedNickname = room.isPublic
      ? `참여자 ${(await tx.participant.count({ where: { roomId } })) + 1}`
      : (nickname as string).trim();

    const upsertedParticipant = await tx.participant.upsert({
      where: { id: participantId },
      update: {},
      create: { id: participantId, roomId, nickname: resolvedNickname },
    });

    if (upsertedParticipant.roomId !== roomId) {
      throw new Error("Submission participant collision");
    }

    const existingAnswerCount = await tx.answer.count({ where: { participantId } });
    if (existingAnswerCount === room.questions.length) {
      return { participant: upsertedParticipant, status: "replayed" as const };
    }
    if (existingAnswerCount > 0) {
      await tx.answer.deleteMany({ where: { participantId } });
    }

    await tx.answer.createMany({
      data: deduped.map((answer) => ({
        questionId: answer.questionId,
        participantId,
        value: answer.value,
      })),
    });

    const status = existingAnswerCount > 0 ? ("recovered" as const) : ("created" as const);

    // 진짜 새 참여자일 때만 연장한다. recovered/replayed는 이미 세어진 사람이라
    // 재제출로 수명을 계속 늘릴 수 있으면 안 된다.
    if (room.isPublic && status === "created") {
      const extended = extendedPublicExpiry(room);
      if (extended) {
        await tx.room.update({ where: { id: roomId }, data: { expiresAt: extended } });
      }
    }

    return { participant: upsertedParticipant, status };
  });
  dbDurationMs += performance.now() - writeStartedAt;

  if (room.isPublic && writeResult.status !== "replayed") {
    revalidateTag(DISCOVER_CACHE_TAG, { expire: 0 });
  }

  return participantResponse({
    participant: writeResult.participant,
    roomId,
    status: writeResult.status,
    startedAt,
    dbDurationMs,
  });
}
