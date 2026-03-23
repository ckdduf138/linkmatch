export type QuestionType = "balance" | "multiple" | "subjective";

export interface PopularQuestion {
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

export const POPULAR_QUESTIONS: PopularQuestion[] = [
  // 밸런스 8개
  {
    type: "balance",
    title: "평생 돈은 없지만 하고 싶은 일 vs 하기 싫은 일이지만 연봉 3억",
    optionA: "하고 싶은 일",
    optionB: "연봉 3억",
  },
  {
    type: "balance",
    title: "애인이 가난하지만 나를 미치게 사랑 vs 부자지만 나한테 무관심",
    optionA: "가난하지만 사랑",
    optionB: "부자지만 무관심",
  },
  {
    type: "balance",
    title: "모든 사람이 내 속마음을 읽을 수 있음 vs 나만 모든 사람 속마음을 읽을 수 있음",
    optionA: "내 마음이 투명",
    optionB: "남의 마음이 보임",
  },
  {
    type: "balance",
    title: "지금 이 순간 기억 전부 삭제 vs 앞으로 아무것도 기억 못함",
    optionA: "과거 기억 삭제",
    optionB: "미래 기억 불가",
  },
  {
    type: "balance",
    title: "친구 10명한테 욕먹는 소문 퍼짐 vs SNS에서 1만 명한테 공개 망신",
    optionA: "친구들한테 욕",
    optionB: "1만 명 공개 망신",
  },
  {
    type: "balance",
    title: "강아지 vs 고양이",
    optionA: "강아지",
    optionB: "고양이",
  },
  {
    type: "balance",
    title: "밤샘 vs 푹 쉬기",
    optionA: "밤샘",
    optionB: "푹 쉬기",
  },
  {
    type: "balance",
    title: "평생 혼자지만 원하는 모든 것을 가짐 vs 사랑하는 사람과 함께지만 항상 가난",
    optionA: "혼자지만 풍요",
    optionB: "함께지만 가난",
  },

  // 객관식 7개
  {
    type: "multiple",
    title: "지금 당장 10억이 생기면 제일 먼저 하고 싶은 것은?",
    options: ["서울 아파트 구매", "세계 여행", "사업 시작", "부모님께 드림"],
  },
  {
    type: "multiple",
    title: "연인과 싸웠을 때 나의 반응은?",
    options: ["바로 화해 시도", "냉각기 필요", "혼자 삭히고 넘어감", "상황에 따라 다름"],
  },
  {
    type: "multiple",
    title: "나의 음주 스타일은?",
    options: ["아예 안 마심", "가끔 1-2잔", "분위기 따라 적당히", "한 번 시작하면 끝장"],
  },
  {
    type: "multiple",
    title: "새벽 2시에 갑자기 놀 수 있으면 뭐 할 것 같아?",
    options: ["유튜브/넷플릭스", "야식 배달", "오래된 친구한테 연락", "일찍 잠들기"],
  },
  {
    type: "multiple",
    title: "첫 만남에서 호감 생기는 포인트는?",
    options: ["눈 마주침", "목소리/말투", "유머 감각", "경청하는 태도"],
  },
  {
    type: "multiple",
    title: "우리 그룹에서 나는 어떤 포지션?",
    options: ["분위기 메이커", "분위기 파악러", "조용한 관찰자", "중재자"],
  },
  {
    type: "multiple",
    title: "요즘 스트레스 수준은?",
    options: ["여유롭다", "보통", "힘들다", "죽겠다"],
  },

  // 주관식 5개
  {
    type: "subjective",
    title: "살면서 가장 후회하는 선택은?",
  },
  {
    type: "subjective",
    title: "이 그룹 사람들한테 하고 싶었던 말이 있다면?",
  },
  {
    type: "subjective",
    title: "지금 이 순간 솔직히 가장 걱정되는 것은?",
  },
  {
    type: "subjective",
    title: "나를 한 문장으로 소개한다면?",
  },
  {
    type: "subjective",
    title: "10년 후 나는 어디서 뭘 하고 있을 것 같아?",
  },
];
