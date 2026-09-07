export type QuestionType = "balance" | "multiple" | "subjective";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

export interface Answer {
  id: string;
  questionId: string;
  value: string;
}

export interface ParticipantSummary {
  id: string;
  nickname: string;
}

export interface Participant extends ParticipantSummary {
  answers: Answer[];
}

interface RoomBase {
  id: string;
  title: string;
  isPublic: boolean;
  expiresAt: string;
  /** 동결 보존된 방이면 그 시각. 읽기 전용 아카이브라 초대·공유 동선을 숨긴다. */
  frozenAt: string | null;
  questions: Question[];
}

/** 방 입장 화면 — Answer Lock 때문에 남의 답변은 내려오지 않는다 */
export interface LobbyRoom extends RoomBase {
  participants: ParticipantSummary[];
}

/** 결과 화면 — 전 문항을 답한 뒤에만 받는 모양 */
export interface ResultsRoom extends RoomBase {
  participants: Participant[];
}

export interface AdminRoom extends ResultsRoom {
  createdAt: string;
}

/**
 * 첫 질문 미리보기 — 밸런스 게임만 실시간 비율을 함께 보여준다. 공개방은 결과 열람에
 * Answer Lock이 없으니(참고: room.isPublic) 카드에 집계 숫자를 노출해도 원칙에 어긋나지 않는다.
 */
export interface DiscoverPreviewQuestion {
  type: QuestionType;
  title: string;
  optionA: string | null;
  optionB: string | null;
  countA: number;
  countB: number;
}

/** 공개방 발견 피드 카드 — 참여자 닉네임·개별 답변은 담지 않는다. Answer Lock과 무관한 디렉터리다. */
export interface DiscoverRoom {
  id: string;
  title: string;
  questionCount: number;
  participantCount: number;
  createdAt: string;
  expiresAt: string;
  previewQuestion: DiscoverPreviewQuestion | null;
}

/**
 * 동결 보존된 방 카드. 끝난 방이라 남은 시간이 없고, 대신 동결 시각을 보여준다.
 * 공개방만 동결되므로 닉네임은 담지 않는다 (공개방은 익명이다).
 */
export interface ArchivedRoom {
  id: string;
  title: string;
  questionCount: number;
  participantCount: number;
  frozenAt: string;
  previewQuestion: DiscoverPreviewQuestion | null;
}

/** DB의 options는 JSON 문자열이다. 깨져 있어도 화면이 죽지 않아야 한다. */
export function parseOptions(options: string | null): string[] {
  if (!options) return [];
  try {
    const parsed: unknown = JSON.parse(options);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((option): option is string => typeof option === "string");
  } catch {
    return [];
  }
}
