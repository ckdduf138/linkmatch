export type QuestionType = "balance" | "multiple" | "subjective";

export interface PopularQuestion {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

export const POPULAR_QUESTIONS: PopularQuestion[] = [
  // 밸런스 11개
  {
    id: "b-1eok-jeolyeon",
    type: "balance",
    title: "1억 받고 절친과 영원히 절연 vs 1억 포기하고 평생 절친",
    optionA: "1억 받고 절연",
    optionB: "1억 포기하고 절친",
  },
  {
    id: "b-jjaksarang",
    type: "balance",
    title: "내가 미치게 좋아하는 사람과 연애 vs 나를 미치게 좋아하는 사람과 연애",
    optionA: "내가 좋아하는 사람",
    optionB: "나를 좋아하는 사람",
  },
  {
    id: "b-tumyeong-maeum",
    type: "balance",
    title: "모든 사람이 내 속마음을 읽을 수 있음 vs 나만 모든 사람 속마음을 읽을 수 있음",
    optionA: "내 마음이 투명",
    optionB: "남의 마음이 보임",
  },
  {
    id: "b-seontok-katok",
    type: "balance",
    title: "선톡 절대 안 하는 애인 vs 하루종일 카톡 폭격하는 애인",
    optionA: "선톡 안 하는 애인",
    optionB: "카톡 폭격 애인",
  },
  {
    id: "b-200man-1000man",
    type: "balance",
    title: "월급 200만원 좋아하는 일 vs 월급 1,000만원 하기 싫은 일",
    optionA: "200만원 좋아하는 일",
    optionB: "1,000만원 싫은 일",
  },
  {
    id: "b-tangsuyuk",
    type: "balance",
    title: "탕수육은 부먹 vs 찍먹",
    optionA: "부먹",
    optionB: "찍먹",
  },
  {
    id: "b-sowon-changpi",
    type: "balance",
    title: "친구 10명한테 욕먹는 소문 퍼짐 vs SNS에서 1만 명한테 공개 망신",
    optionA: "친구들한테 욕",
    optionB: "1만 명 공개 망신",
  },
  {
    id: "b-honja-gachi",
    type: "balance",
    title: "평생 혼자지만 원하는 모든 것을 가짐 vs 사랑하는 사람과 함께지만 항상 가난",
    optionA: "혼자지만 풍요",
    optionB: "함께지만 가난",
  },
  {
    id: "b-chicken",
    type: "balance",
    title: "치킨은 후라이드 vs 양념",
    optionA: "후라이드",
    optionB: "양념",
  },
  {
    id: "b-yeohaeng-style",
    type: "balance",
    title: "여행 스타일: 빡빡한 일정표 vs 그때그때 즉흥",
    optionA: "일정표파",
    optionB: "즉흥파",
  },
  {
    id: "b-sanbada",
    type: "balance",
    title: "여행지 고르면 산 vs 바다",
    optionA: "산",
    optionB: "바다",
  },

  // 객관식 10개
  {
    id: "m-katok-wass",
    type: "multiple",
    title: "카톡 왔을 때 나는?",
    options: ["즉시 답장", "읽고 나중에 답장", "읽씹할 때 있음", "알림 꺼놓음"],
  },
  {
    id: "m-yaksok-sigan",
    type: "multiple",
    title: "약속 시간 나는?",
    options: ["30분 전 도착", "딱 맞게 도착", "5~10분 지각", "항상 30분+ 지각"],
  },
  {
    id: "m-galdeung",
    type: "multiple",
    title: "갈등 생기면 나는?",
    options: ["바로 직접 말함", "삭히다가 폭발함", "그냥 넘어감", "슬쩍 멀어짐"],
  },
  {
    id: "m-position",
    type: "multiple",
    title: "우리 그룹에서 내 포지션은?",
    options: ["분위기 메이커", "조용한 관찰자", "분위기 파악러", "중재자"],
  },
  {
    id: "m-10eok",
    type: "multiple",
    title: "10억 생기면 가장 먼저?",
    options: ["집 구매", "세계 일주", "투자·사업", "부모님께 드림"],
  },
  {
    id: "m-stress",
    type: "multiple",
    title: "스트레스 받을 때 나는?",
    options: ["혼자 조용히", "친구 만나서 풀기", "먹방", "잠으로 해결"],
  },
  {
    id: "m-gongpo-movie",
    type: "multiple",
    title: "공포영화 보면 나는?",
    options: ["눈 딱 감음", "소리 지름", "옆사람 붙잡음", "멀쩡하게 봄"],
  },
  {
    id: "m-jumal-achim",
    type: "multiple",
    title: "주말 아침에 눈뜨면 나는?",
    options: ["바로 일어나서 뭐라도 함", "핸드폰 보다가 다시 잠", "커피부터 내림", "정오까지 안 일어남"],
  },
  {
    id: "m-danche-sajin",
    type: "multiple",
    title: "단체 사진 찍을 때 나는?",
    options: ["항상 가운데로 감", "구석에서 조용히", "포즈 열심히 잡음", "눈 감아서 다시 찍자고 함"],
  },
  {
    id: "m-yeohaeng-jjim",
    type: "multiple",
    title: "여행 짐 쌀 때 나는?",
    options: ["며칠 전부터 리스트 작성", "전날 밤에 몰아서", "당일 아침에 대충", "캐리어 상시 대기"],
  },

  // 주관식 7개
  {
    id: "s-first-married",
    type: "subjective",
    title: "이 그룹에서 제일 먼저 결혼할 것 같은 사람은? (이유도)",
  },
  {
    id: "s-anywhere",
    type: "subjective",
    title: "지금 당장 어디든 갈 수 있다면 어디 가고 싶어?",
  },
  {
    id: "s-want-to-say",
    type: "subjective",
    title: "이 그룹 사람들한테 하고 싶었던 말이 있다면?",
  },
  {
    id: "s-into-lately",
    type: "subjective",
    title: "요즘 꽂혀있는 것 하나만 말해봐",
  },
  {
    id: "s-ten-years",
    type: "subjective",
    title: "10년 후 나는 어디서 뭘 하고 있을 것 같아?",
  },
  {
    id: "s-choegeun-utgin",
    type: "subjective",
    title: "최근 본 것 중에 제일 웃겼던 거 하나만",
  },
  {
    id: "s-gachi-yeohaeng",
    type: "subjective",
    title: "이 그룹이랑 같이 가고 싶은 여행지 한 곳만 말해봐",
  },
];

/**
 * 방을 만들 때 "이 문항이 인기 질문에서 온 것인지" 판별하는 데 쓴다.
 * 서버가 클라이언트의 id를 그대로 믿지 않고 이 집합으로 걸러야, 사용자가 직접 쓴
 * 질문이나 조작된 값이 통계에 섞이지 않는다.
 */
export const POPULAR_QUESTION_IDS: ReadonlySet<string> = new Set(
  POPULAR_QUESTIONS.map((question) => question.id)
);
