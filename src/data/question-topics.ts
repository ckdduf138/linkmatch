import { POPULAR_QUESTIONS, type PopularQuestion } from "./popular-questions";
import { QUESTION_PACKS, type QuestionPack } from "./question-packs";

/**
 * 검색 유입용 주제 분류.
 *
 * 테마(question-packs)와 목적이 다르다. 테마는 "방 하나에 넣을 5문항"이라 서로 겹치면
 * 안 되지만, 주제는 검색 의도별 랜딩이라 겹쳐도 된다 — "탕수육 부먹 찍먹"은 술자리에서도
 * MT에서도 단톡방에서도 쓰인다. 그래서 두 목록을 합치지 않았다.
 *
 * 공통 규칙은 그대로다: 문항 텍스트를 복사하지 않고 id로만 참조한다.
 */
export interface QuestionTopic {
  slug: string;
  /** 목록 카드에 쓰는 짧은 이름 */
  label: string;
  /** 카드 한 줄 설명 */
  tagline: string;
  /** 페이지 h1 (두 줄로 끊어 쓴다) */
  headingTop: string;
  headingBottom: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** "이 주제로 방 만들기"가 집어드는 테마 */
  packId: string;
  questionIds: string[];
}

const TOPIC_DEFS: QuestionTopic[] = [
  {
    slug: "couple",
    label: "커플",
    tagline: "연애 취향과 가치관을 나란히 놓고 보는 질문",
    headingTop: "연인과 해보는",
    headingBottom: "커플 밸런스게임 12선",
    intro:
      "연애 습관부터 미래 계획까지, 사귀는 사이에서 한 번쯤 물어보고 싶었던 질문을 모았어요. 링크를 보내면 서로 답을 마친 뒤에 상대의 선택이 열려서, 눈치 보고 맞추는 대답이 나오지 않아요.",
    metaTitle: "커플 밸런스게임 12선 - 연인끼리 하는 가치관 테스트 질문",
    metaDescription:
      "연인과 함께 하는 커플 밸런스게임, 연애 가치관 테스트 질문 12개. 링크 하나로 서로의 답을 비교하고, 내 답을 마쳐야 상대의 선택이 열려요.",
    keywords: [
      "커플 밸런스게임",
      "커플 밸런스게임 질문",
      "연인 밸런스게임",
      "커플 가치관 테스트",
      "커플 질문",
      "연애 질문 모음",
      "썸 질문",
      "커플 게임",
    ],
    packId: "dating",
    questionIds: [
      "b-jjaksarang",
      "b-seontok-katok",
      "b-honja-gachi",
      "b-tumyeong-maeum",
      "b-yeohaeng-style",
      "b-sanbada",
      "m-katok-wass",
      "m-galdeung",
      "m-yaksok-sigan",
      "s-ten-years",
      "s-anywhere",
      "s-into-lately",
    ],
  },
  {
    slug: "mt",
    label: "MT와 워크샵",
    tagline: "처음 만난 사람끼리도 바로 도는 아이스브레이커",
    headingTop: "MT에서 바로 도는",
    headingBottom: "단체 게임 질문 12선",
    intro:
      "MT, 워크샵, 오리엔테이션처럼 사람은 많은데 아직 서먹한 자리를 위한 질문이에요. 한 명씩 돌아가며 말하지 않아도 되고, 링크를 단톡방에 올리면 각자 답한 뒤 결과만 같이 봅니다.",
    metaTitle: "MT 단체 게임 질문 12선 - 워크샵 아이스브레이킹 밸런스게임",
    metaDescription:
      "MT, 워크샵, 오리엔테이션에서 바로 쓰는 단체 게임 질문 12개. 아이스브레이킹용 밸런스게임과 객관식을 링크 하나로 공유하고 결과를 비교해요.",
    keywords: [
      "MT 게임",
      "MT 질문",
      "MT 밸런스게임",
      "워크샵 게임",
      "단체 게임",
      "아이스브레이킹 게임",
      "아이스브레이킹 질문",
      "팀빌딩 게임",
      "오리엔테이션 게임",
    ],
    packId: "gathering",
    questionIds: [
      "b-sowon-changpi",
      "b-tangsuyuk",
      "b-chicken",
      "b-yeohaeng-style",
      "b-sanbada",
      "m-position",
      "m-danche-sajin",
      "m-yeohaeng-jjim",
      "m-stress",
      "s-anywhere",
      "s-gachi-yeohaeng",
      "s-choegeun-utgin",
    ],
  },
  {
    slug: "drink",
    label: "술자리",
    tagline: "취기 오를 때쯤 던지면 제일 시끄러워지는 질문",
    headingTop: "술자리에서 던지는",
    headingBottom: "밸런스게임 질문 12선",
    intro:
      "벌칙도 준비물도 필요 없는 술자리 게임이에요. 답이 갈릴수록 재밌어지는 질문만 모았고, 모두가 답을 마치면 누가 소수파였는지 한 화면에서 드러납니다.",
    metaTitle: "술자리 게임 질문 12선 - 회식에서 바로 쓰는 밸런스게임",
    metaDescription:
      "술자리와 회식에서 바로 쓰는 밸런스게임 질문 12개. 벌칙도 준비물도 없이 링크 하나로, 답이 갈리는 질문만 골라 모았어요.",
    keywords: [
      "술자리 게임",
      "술자리 질문",
      "술게임 질문",
      "회식 게임",
      "웃긴 밸런스게임",
      "술자리 밸런스게임",
      "친구와 할 수 있는 게임",
    ],
    packId: "friends",
    questionIds: [
      "b-tangsuyuk",
      "b-chicken",
      "b-1eok-jeolyeon",
      "b-sowon-changpi",
      "b-tumyeong-maeum",
      "m-katok-wass",
      "m-gongpo-movie",
      "m-stress",
      "m-position",
      "s-first-married",
      "s-want-to-say",
      "s-choegeun-utgin",
    ],
  },
  {
    slug: "work",
    label: "직장인",
    tagline: "일과 돈 앞에서 팀원들이 뭘 고르는지",
    headingTop: "회사에서 돌려보는",
    headingBottom: "직장인 밸런스게임 10선",
    intro:
      "연봉, 워라밸, 갈등 상황처럼 회사 사람들과 말로 꺼내기는 애매한 주제를 질문으로 바꿨어요. 익명 공개방으로 만들면 이름 없이 집계만 볼 수 있어서 팀 회식이나 워크샵에서 쓰기 편합니다.",
    metaTitle: "직장인 밸런스게임 10선 - 팀빌딩과 회식 아이스브레이킹 질문",
    metaDescription:
      "연봉, 워라밸, 갈등 상황까지 직장인 밸런스게임 질문 10개. 팀빌딩과 회식 아이스브레이킹용으로 링크 하나면 되고, 익명 공개방도 만들 수 있어요.",
    keywords: [
      "직장인 밸런스게임",
      "회사 밸런스게임",
      "회식 게임",
      "팀빌딩 게임",
      "팀빌딩 질문",
      "워크샵 아이스브레이킹",
      "직장인 질문",
      "연봉 밸런스게임",
    ],
    packId: "values",
    questionIds: [
      "b-200man-1000man",
      "b-1eok-jeolyeon",
      "b-honja-gachi",
      "m-position",
      "m-galdeung",
      "m-stress",
      "m-yaksok-sigan",
      "m-10eok",
      "s-ten-years",
      "s-into-lately",
    ],
  },
  {
    slug: "friends",
    label: "단톡방",
    tagline: "오래 본 사이일수록 답이 갈리는 질문",
    headingTop: "단톡방에 던지는",
    headingBottom: "친구 질문 12선",
    intro:
      "이미 서로 잘 안다고 생각하는 사이에서 오히려 답이 갈리는 질문을 모았어요. 모두 답을 마치면 누구와 몇 퍼센트 맞았는지 궁합까지 나오니까, 링크 하나 던져놓고 결과를 같이 보면 됩니다.",
    metaTitle: "단톡방 질문 12선 - 친구끼리 하는 밸런스게임과 궁합 비교",
    metaDescription:
      "단톡방에 바로 던지는 친구 질문 12개. 밸런스게임과 객관식으로 답을 비교하고, 누구와 몇 퍼센트 맞는지 그룹 궁합까지 확인해요.",
    keywords: [
      "단톡방 질문",
      "단톡방 밸런스게임",
      "단톡방 투표",
      "친구 밸런스게임",
      "친구 궁합",
      "친구 질문 모음",
      "카톡 투표",
    ],
    packId: "friends",
    questionIds: [
      "b-tangsuyuk",
      "b-chicken",
      "b-1eok-jeolyeon",
      "b-sowon-changpi",
      "b-tumyeong-maeum",
      "m-position",
      "m-katok-wass",
      "m-danche-sajin",
      "m-jumal-achim",
      "s-first-married",
      "s-want-to-say",
      "s-gachi-yeohaeng",
    ],
  },
];

export const QUESTION_TOPICS: QuestionTopic[] = TOPIC_DEFS;

export function findTopic(slug: string): QuestionTopic | null {
  return QUESTION_TOPICS.find((topic) => topic.slug === slug) ?? null;
}

export function topicQuestions(topic: QuestionTopic): PopularQuestion[] {
  return topic.questionIds.map((id) => {
    const question = POPULAR_QUESTIONS.find((candidate) => candidate.id === id);
    if (!question) throw new Error(`question-topics: 존재하지 않는 id "${id}"`);
    return question;
  });
}

export function topicPack(topic: QuestionTopic): QuestionPack | null {
  return QUESTION_PACKS.find((pack) => pack.id === topic.packId) ?? null;
}
