/**
 * 한국어 조사 선택.
 *
 * 결과 화면 문장은 사용자가 쓴 선택지 텍스트를 그대로 끼워 넣기 때문에 조사를 고정하면
 * 반드시 틀린다 ("부먹"를, "칼퇴"를). 동결 보존된 방은 이 문장이 영구 색인 페이지에
 * 남으므로 더 그렇다.
 */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

/** 숫자를 한국어로 읽었을 때 받침이 있는지 (일, 삼, 육, 칠, 팔) */
const DIGIT_HAS_FINAL: Record<string, boolean> = {
  "0": false, // 영
  "1": true, // 일
  "2": false, // 이
  "3": true, // 삼
  "4": false, // 사
  "5": false, // 오
  "6": true, // 육
  "7": true, // 칠
  "8": true, // 팔
  "9": false, // 구
};

/** 받침이 있으면 true. 판단할 수 없는 문자(영문 등)는 false로 둔다. */
function hasFinalConsonant(word: string): boolean {
  const last = word.trim().slice(-1);
  if (!last) return false;

  if (last >= "0" && last <= "9") return DIGIT_HAS_FINAL[last] ?? false;

  const code = last.charCodeAt(0);
  if (code < HANGUL_START || code > HANGUL_END) return false;
  return (code - HANGUL_START) % 28 !== 0;
}

/** 목적격: 부먹을 / 찍먹을 / 커피를 */
export function objectParticle(word: string): string {
  return hasFinalConsonant(word) ? "을" : "를";
}

/** 주격: 사람이 / 친구가 */
export function subjectParticle(word: string): string {
  return hasFinalConsonant(word) ? "이" : "가";
}
