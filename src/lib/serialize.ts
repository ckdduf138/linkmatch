import type {
  AdminRoom,
  Answer,
  DiscoverRoom,
  LobbyRoom,
  Participant,
  ParticipantSummary,
  Question,
  QuestionType,
  ResultsRoom,
} from "./types";

/**
 * Prisma 레코드를 클라이언트 컴포넌트로 넘길 수 있는 평범한 객체로 바꾼다.
 * Date 직렬화와 Question.type 좁히기를 한 곳에서만 하려는 목적이다.
 */

interface DbQuestion {
  id: string;
  type: string;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

interface DbAnswer {
  id: string;
  questionId: string;
  value: string;
}

interface DbParticipant {
  id: string;
  nickname: string;
}

interface DbRoom {
  id: string;
  title: string;
  isPublic: boolean;
  expiresAt: Date;
  frozenAt: Date | null;
  questions: DbQuestion[];
}

export function serializeQuestion(question: DbQuestion): Question {
  return {
    id: question.id,
    type: question.type as QuestionType,
    title: question.title,
    optionA: question.optionA,
    optionB: question.optionB,
    options: question.options,
    order: question.order,
  };
}

function serializeAnswer(answer: DbAnswer): Answer {
  return { id: answer.id, questionId: answer.questionId, value: answer.value };
}

export function serializeParticipant(
  participant: DbParticipant & { answers: DbAnswer[] }
): Participant {
  return {
    id: participant.id,
    nickname: participant.nickname,
    answers: participant.answers.map(serializeAnswer),
  };
}

function serializeSummary(participant: DbParticipant): ParticipantSummary {
  return { id: participant.id, nickname: participant.nickname };
}

export function serializeLobbyRoom(
  room: DbRoom & { participants: DbParticipant[] }
): LobbyRoom {
  return {
    id: room.id,
    title: room.title,
    isPublic: room.isPublic,
    expiresAt: room.expiresAt.toISOString(),
    frozenAt: room.frozenAt?.toISOString() ?? null,
    questions: room.questions.map(serializeQuestion),
    participants: room.participants.map(serializeSummary),
  };
}

export function serializeResultsRoom(
  room: DbRoom & { participants: (DbParticipant & { answers: DbAnswer[] })[] }
): ResultsRoom {
  return {
    id: room.id,
    title: room.title,
    isPublic: room.isPublic,
    expiresAt: room.expiresAt.toISOString(),
    frozenAt: room.frozenAt?.toISOString() ?? null,
    questions: room.questions.map(serializeQuestion),
    participants: room.participants.map(serializeParticipant),
  };
}

export function serializeDiscoverRoom(room: {
  id: string;
  title: string;
  createdAt: Date;
  expiresAt: Date;
  _count: { questions: number; participants: number };
  questions?: (DbQuestion & { answers: { value: string }[] })[];
}): DiscoverRoom {
  const first = room.questions?.[0];
  const previewQuestion = first
    ? {
        type: first.type as QuestionType,
        title: first.title,
        optionA: first.optionA,
        optionB: first.optionB,
        countA: first.answers.filter((a) => a.value === "A").length,
        countB: first.answers.filter((a) => a.value === "B").length,
      }
    : null;

  return {
    id: room.id,
    title: room.title,
    questionCount: room._count.questions,
    participantCount: room._count.participants,
    createdAt: room.createdAt.toISOString(),
    expiresAt: room.expiresAt.toISOString(),
    previewQuestion,
  };
}

export function serializeAdminRoom(
  room: DbRoom & {
    createdAt: Date;
    participants: (DbParticipant & { answers: DbAnswer[] })[];
  }
): AdminRoom {
  return {
    ...serializeResultsRoom(room),
    createdAt: room.createdAt.toISOString(),
  };
}
