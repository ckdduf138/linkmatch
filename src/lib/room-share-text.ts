import { formatEstimatedDuration } from "./format";

/**
 * OG 설명과 카카오 공유 메시지가 같은 문장을 쓰도록 순수 함수로 빼둔다.
 * room-share.ts는 prisma를 import하므로 클라이언트 컴포넌트가 이 파일만 가져가야 한다.
 */
export interface RoomShareFacts {
  expired: boolean;
  isPublic: boolean;
  questionCount: number;
  participantCount: number;
  /** 동결 보존된 방. 만료 시각은 지났지만 결과는 영구히 남는다. */
  frozen?: boolean;
}

export function roomShareDescription(facts: RoomShareFacts): string {
  if (facts.frozen) {
    return `${facts.participantCount}명이 답한 결과예요. 질문 ${facts.questionCount}개, 익명으로 모은 집계를 그대로 보여드려요.`;
  }
  if (facts.expired) {
    return "이 방은 만료됐어요. 새 방을 만들어 친구들과 답을 비교해보세요.";
  }

  const scale = `질문 ${facts.questionCount}개, ${formatEstimatedDuration(facts.questionCount)}`;
  const joined =
    facts.participantCount > 0 ? ` 이미 ${facts.participantCount}명이 답했어요.` : "";
  const rule = facts.isPublic
    ? "닉네임 없이 익명으로 답하면 전체 집계가 바로 열려요."
    : "내가 모든 질문에 답하면 친구들의 선택이 열려요.";

  return `${scale}.${joined} ${rule}`;
}
