# Deerlink — AGENTS.md

이 파일은 Codex가 일관된 코드를 생성하기 위한 프로젝트 가이드입니다.

---

## 프로젝트 개요

**Deerlink** — 링크 하나로 그룹 의견을 비교하는 플랫폼. 사슴 뿔처럼 여러 가지가 하나의 뿌리에서 만나는 컨셉.
방 생성자가 질문을 만들고 링크를 공유하면, 참여자 전원이 답변 후 결과를 비교한다.
핵심 원칙: **Answer Lock** — 본인이 모든 질문에 답하기 전까지 남의 답변 열람 불가 (API 레벨 강제).

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (`src/components/ui/`) |
| Animation | Framer Motion |
| Icons | lucide-react |
| ORM | Prisma 7 (driver adapter, `src/generated/prisma`) |
| DB | SQLite / libSQL (프로덕션 Turso) |
| Runtime | Node.js (서버 컴포넌트 + Route Handlers), 미들웨어는 Edge |

---

## 디렉토리 구조

```
src/
├── middleware.ts           # /admin, /api/admin 세션 가드
├── app/
│   ├── layout.tsx          # Root layout (라이트, Gowun Dodum 폰트)
│   ├── globals.css         # Tailwind + CSS 변수 정의
│   ├── page.tsx            # 랜딩 (Server Component)
│   ├── not-found.tsx       # 404
│   ├── manifest.ts / robots.ts / sitemap.ts / opengraph-image.tsx
│   ├── create/page.tsx     # 방 만들기 (Client)
│   ├── popular/page.tsx    # SEO용 인기 질문 모음
│   ├── admin/              # 어드민 대시보드 + 로그인
│   ├── room/[id]/
│   │   ├── page.tsx        # 방 입장 (Server) → room-client.tsx
│   │   └── results/
│   │       ├── page.tsx    # Answer Lock 게이트 (Server)
│   │       ├── results-client.tsx
│   │       └── share-card.tsx
│   └── api/
│       ├── rooms/                      # POST / , GET·[id] , POST·[id]/answers
│       ├── admin/                      # auth, rooms (미들웨어가 보호)
│       ├── feedback/route.ts           # Discord 웹훅
│       └── cron/cleanup/route.ts       # 만료 방 삭제 (Vercel cron)
├── components/
│   ├── landing/            # 랜딩 섹션 (전부 Client — 애니메이션 때문)
│   │   # Hero(체험형) → AnswerLock → Steps → QuestionTypes → UseCases → Cta
│   │   # 섹션마다 레이아웃 계열이 달라야 한다 (아래 "랜딩 규칙" 참고)
│   ├── create/             # question-card, create-editor, pack-picker
│   ├── room/               # lobby, answer-mode, group-report
│   ├── admin/
│   ├── ResultBar.tsx       # 밸런스 게임 결과 비율 막대 (아래 "결과 시각화" 참고)
│   └── ui/                 # shadcn/ui (수정 금지)
├── data/
│   ├── popular-questions.ts   # id 붙은 인기 질문 28개 (단일 출처)
│   └── question-packs.ts      # 질문팩 — popular-questions를 id로 참조
└── lib/
    ├── prisma.ts               # Prisma client 싱글턴 (libSQL adapter)
    ├── admin-session.ts        # 어드민 HMAC 서명 세션 토큰
    ├── participant-session.ts  # participant 쿠키명 + Answer Lock 판정
    ├── rate-limit.ts           # 메모리 슬라이딩 윈도우 레이트리밋
    ├── group-stats.ts          # 궁합·소수파 계산 (결과 페이지 + 공유 카드 공용)
    ├── types.ts                # Room/Question/Participant/Answer + parseOptions()
    ├── serialize.ts            # Prisma 레코드 → 클라이언트 props
    ├── question-meta.ts        # 질문 유형별 아이콘·라벨·색 (단일 출처)
    ├── draft-storage.ts        # 작성/답변 임시저장 (localStorage)
    ├── use-hydrated.ts         # 브라우저 전용 값 읽기 전 게이트
    ├── format.ts               # formatRemaining()
    └── utils.ts                # cn()
```

---

## 디자인 시스템

**라이트 테마다.** 예전 다크 팔레트(`#0d0a07` 계열)는 폐기됐다. 새 화면을 다크로 만들지 말 것.

### 색상 팔레트

```
배경:        #fafaf8   (따뜻한 오프화이트)
카드 배경:   #ffffff
전경/제목:   #1c1412   ≈ text-stone-900
border:      border-amber-100 (기본) / border-stone-200 (중립)
Accent:      #e8a038   (amber-500, 사슴 털 색)
Accent 버튼: amber-600 → hover amber-500
Accent 배경: bg-amber-50 (연한 강조 면)
대비 색상:   teal — amber와 대비 목적으로만 (balance game B 옵션)
```

**텍스트 위계** (실제 사용 빈도순)

```
text-stone-900   제목·강조
text-stone-700   본문 강조
text-stone-600   본문 기본
text-stone-500   보조
text-stone-400   캡션·placeholder
text-stone-300   장식용 대형 숫자, 비활성 로고
```

**색상 원칙**
- accent는 **amber 단색**만. 따뜻한 느낌 유지.
- 그라디언트 남용 금지. 필요 시 `from-amber-50 to-amber-100/40` 정도.
- `globals.css`의 `.dark` 블록은 현재 `:root`와 값이 완전히 동일하다 — 다크 모드는 실질적으로 비활성 상태다. 다크를 되살릴 게 아니면 건드리지 말 것.

### 타이포그래피

```
폰트:    Gowun Dodum (next/font/google, --font-gowun-dodum → --font-sans)
영문:    tracking-tight
숫자:    font-mono tabular-nums

히어로:  text-5xl ~ text-[82px]  font-bold  tracking-tight  leading-[1.05]
섹션:    text-3xl ~ text-4xl     font-bold  tracking-tight
카드:    text-sm ~ text-base     font-semibold
본문:    text-sm                 text-stone-600  leading-relaxed
캡션:    text-[10px] ~ text-xs   text-stone-400  uppercase tracking-widest
```

`globals.css`에서 input/textarea는 `font-size: 1rem` 강제 — iOS Safari 포커스 확대 방지용이니 제거하지 말 것.

### 컴포넌트 스타일 패턴

```tsx
// 카드 — 기본
className="rounded-2xl border border-amber-100 bg-white p-5"

// 카드 — 떠 있는 강조
className="rounded-2xl border border-amber-100/80 bg-white shadow-lg shadow-amber-100/60 overflow-hidden"

// 카드 — selected/active
className="border-amber-300 bg-amber-50"

// 버튼 — 주요 CTA
className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/30 hover:-translate-y-0.5"

// 버튼 — 주요 CTA (disabled 포함)
className="bg-amber-600 hover:bg-amber-500 disabled:bg-stone-200 disabled:text-stone-500 text-white text-sm font-medium transition-colors"

// 버튼 — 보조
className="text-sm text-stone-600 hover:text-stone-900 transition-colors duration-200"

// 고정 상단 네비
className="fixed top-0 inset-x-0 z-50 border-b border-amber-100 bg-white/90 backdrop-blur-md"

// 태그/뱃지 — amber 면 위에서는 amber 계열 전경
className="px-3 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-amber-900"

// 섹션 구분선
className="h-px bg-amber-100"
```

### 접근성 하한선 (지킬 것)

색 조합을 새로 쓸 때 아래는 실제로 미달이라 쓰면 안 된다.

```
placeholder:text-stone-400          # 흰/amber-50 위 2.4:1 → stone-500 사용
disabled:text-stone-400 + bg-stone-200  # 1.8:1 → disabled:text-stone-500
text-amber-400 / text-teal-400      # 흰 배경 위 텍스트로 2:1 미만 → 700 계열
흰 배경 위 text-stone-400 아이콘 버튼   # 2.5:1, 비텍스트 최소 3:1 미달 → stone-500
```

- **amber-50 면 위의 중립 회색 텍스트는 쓰지 않는다.** 칩·뱃지·강조 면은 `text-amber-900`로 통일한다. (입력 필드의 `text-stone-900` 입력 텍스트는 예외 — 16:1로 의도된 조합이다.)
- 탭 가능한 요소는 최소 44px를 확보한다. 시각 요소가 작으면 `min-h-11`이나 패딩으로 히트 영역만 키운다 (예: 답변 화면 진행 점).
- 폼 오류는 필드 바로 아래에 `role="alert"`로 붙인다.

### 결과 시각화 (`ResultBar`) · 발굽

결과 그래프는 amber/teal 비율 막대다. **뿔 모양 SVG로 결과를 그리던 `AntlerTally`/`AntlerSpread`는 2026-08에 걷어냈다 — 되살리지 말 것.** 굵기를 `sqrt(share)`로 완만하게 죽이는 공식 때문에 0명도 `MIN_WIDTH`만큼 두께가 남아 "0명인데 왜 가지가 있지?"로 읽혔고, 객관식의 곡선 다지(多枝) 뿔은 각도·길이가 제각각이라 굵기만으로 비중을 비교하기 어려웠다. 게다가 객관식은 뿔 그림 아래 이미 숫자·퍼센트·참여자 칩이 있어서 뿔이 같은 정보를 다시 그리는 순수 장식이었다 — 심지어 공유 카드는 애초에 객관식에 뿔을 쓰지 않고 막대를 썼다, 즉 뿔이 정말 필요했으면 거기부터 깨졌어야 했다. 데이터 시각화는 그림과 숫자가 항상 같은 값을 말해야 신뢰가 생긴다. 폭 = 비율인 막대가 그 조건을 가장 단순하게 만족한다.

```tsx
// 이지선다 — amber(A) / teal(B) 두 세그먼트, 폭이 곧 %
<BalanceRatioBar a={{ label, count }} b={{ label, count }} mine="a" />

// 객관식 — 옵션별 행에 슬림 막대. 1위 bg-amber-500, 나머지 bg-stone-300 (results-client.tsx의 MultipleResult 참고, 별도 컴포넌트로 안 뺐다)
```

- 세그먼트 폭은 `Math.round(count/total*100)`의 **선형 퍼센트**다. sqrt 완화 공식은 폐기했다 — 막대는 폭이 왜곡되면 바로 눈에 띄어서 애초에 죽일 필요가 없다.
- 0명은 그 색 세그먼트를 아예 렌더링하지 않는다 (`count > 0 &&`). 조작 없이 자연스럽게 폭 0이 된다.
- 시각적으로만 값을 나타내는 막대 div는 `aria-hidden="true"`를 단다 — 바로 옆에 실제 텍스트(라벨·인원·%)가 항상 같이 있으니 스크린리더가 두 번 읽을 필요가 없다.
- 공유 카드(`share-card.tsx`)도 같은 퍼센트로 계산한 막대를 인라인 스타일로 그린다. `BalanceRatioBar`와 `share-card`가 다른 공식을 쓰면 안 된다 — 페이지 결과와 공유 이미지가 다른 숫자를 말하면 안 된다는 원칙은 그대로다.
- 헤더의 작은 `AntlerLogo`(뿔 모양 브랜드 마크)는 데이터가 아니라 로고이므로 이 정리와 무관하다. 계속 쓴다.
- `DeerHoofMark`는 답변 화면 진행 표시다. 지나온 질문을 발자국으로 남기고, 좌우로 번갈아 기울여 걸어간 느낌을 준다. 순수 장식으로만 쓰지 말 것.

**일러스트 캐릭터(`DeerMascot`)는 2026-08에 걷어냈다 — 되살리지 말 것.** 로딩·빈 상태·404·완료 같은 상태 표시는 이제 lucide 아이콘(예: `Loader2`, `Sparkles`, `Users`)과 기존 텍스트만으로 처리한다. 손으로 그린 SVG 캐릭터는 참고 일러스트와 나란히 렌더링해서 비교해보니 품질 격차가 커서 유지보수 대상에서 제외했다 — 새 캐릭터 자산을 다시 만들 필요가 생기면 AI 이미지 생성(예: Gemini API, 결제 연동 필요) 없이는 이 프로젝트 수준에서 벡터로 재현하기 어렵다는 점을 먼저 감안할 것.

### 그룹 리포트 (`lib/group-stats.ts`)

"지우와 87% 일치" 같은 숫자 — 익명 통계 서비스(푸슝·PIKU류)는 구조적으로 못 만든다. 이름 붙은 유한 그룹의 답변만 있으면 계산되고, 스키마 변경이 없다. 이게 이 제품의 실질적 차별점이니 신중하게 다룰 것.

- `computePairScores` / `bestPair` / `computeLoneDissenter` / `computeClosestBalance`는 순수 함수다. **결과 페이지(`GroupReport`)와 공유 카드가 반드시 이 파일 하나만 참조한다** — 계산을 각자 다시 짜면 두 화면이 다른 숫자를 말하게 된다.
- 데이터가 부족하면 그 통계는 **숨긴다** (예: 비교 가능한 질문이 1개 이하인 쌍은 계산에서 제외, 참여자 3명 미만이면 "최악 궁합" 미표시). 가짜 정밀도보다 침묵이 낫다.
- 주관식은 궁합 계산에서 제외한다 — 자유 텍스트 일치는 의미가 없다.

### 아이콘

- **lucide-react** 사용.
- 크기: 카드 내부 `w-4 h-4`, 버튼 내부 `w-3.5 h-3.5`, 대형 `w-5 h-5`.
- **아이콘-인-박스 패턴 금지** (icon을 둥근 배경 box 안에 넣는 것). 인라인으로 사용.

---

## 답변 화면 자동 진행

밸런스·객관식은 고르면 `AUTO_ADVANCE_MS`(380ms) 뒤 다음 질문으로 넘어간다. 예전엔
문항마다 "선택 -> 다음" 두 번을 눌러야 해서 20문항이면 40번이었다. 지연을 두는 건
선택이 화면에 반영되는 걸 보고 넘어가야 하기 때문이다 - 즉시 전환하면 뭘 골랐는지 모른다.

- 주관식은 자동 진행하지 않는다 (`selectAnswer`를 쓰고 `selectAndAdvance`를 쓰지 않는다).
- 마지막 문항에서는 넘어갈 곳이 없으니 예약하지 않는다. 제출 버튼이 그 자리다.
- `prefers-reduced-motion`이면 자동 진행을 끈다. 예고 없는 화면 전환을 원하지 않는
  사용자에게 굳이 만들지 않는다. "다음" 버튼은 언제나 그대로 동작한다.
- 예약된 이동은 `goTo`(발굽·이전·다음)와 제출에서 반드시 취소한다. 안 그러면 직접
  이동한 뒤에 예약분이 뒤늦게 실행돼서 화면이 혼자 튄다.

## 애니메이션 원칙

Framer Motion 사용. **기능적 애니메이션만** — 장식용 bounce/infinite 남용 금지.

```tsx
// 페이지 진입 — 기본
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}

// 스크롤 트리거 — 기본
initial={{ opacity: 0, y: 12 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-60px" }}
transition={{ duration: 0.45, delay: i * 0.08 }}

// 순차 등장 — stagger delay
transition={{ duration: 0.35, delay: index * 0.1 }}

// ease — string 대신 배열 사용 (TypeScript 에러 방지)
ease: [0.16, 1, 0.3, 1]   // spring-like
ease: "easeOut"            // 가능하지만 as const 불필요
```

**viewport={{ once: true }}** — 스크롤 재진입 시 재실행 금지.

---

## 코드 컨벤션

### 컴포넌트

```tsx
// Server Component — "use client" 없음
export default function Page() { ... }
export function SomeSection() { ... }

// Client Component — 최상단에 선언
"use client";
export function InteractiveComponent() { ... }
```

- 상태/이벤트/훅이 필요한 경우만 `"use client"` 추가.
- 랜딩 섹션은 애니메이션 때문에 모두 Client Component.
- 페이지(`page.tsx`)는 Server Component로 두고, 인터랙션은 `*-client.tsx`로 분리한다 (room, results가 이 패턴).

### 브라우저 전용 값 읽기

`localStorage`·`window.location`을 effect 안에서 읽고 `setState` 하지 말 것 — 린트(`react-hooks/set-state-in-effect`)가 막고, 하이드레이션 불일치도 생긴다.

```tsx
// 단일 값이면 useSyncExternalStore
const url = useSyncExternalStore(neverChanges, () => window.location.href, () => "");

// localStorage는 스토어로 구독한다 (draft-storage가 변경을 알림)
const raw = useSyncExternalStore(subscribeDrafts, () => draftSnapshot(key), () => null);
const draft = useMemo(() => parseDraft<AnswerDraft>(raw) ?? EMPTY, [raw]);
```

**`useHydrated()` 게이트로 페이지 전체를 감싸지 말 것.** 서버 HTML이 로딩 마크만 남는다. 특히 `/room/[id]`는 공유 링크를 받은 사람이 처음 보는 화면이라 반드시 서버에서 내용이 그려져야 한다. 게이트는 정말 브라우저 값이 있어야만 그릴 수 있는 부분에만 좁혀 쓴다.

### 입력 보존과 실패 처리

- 방 만들기·답변 작성은 `@/lib/draft-storage`로 localStorage에 임시저장한다. 새로고침·실수로 닫기·제출 실패로 입력이 날아가면 안 된다.
- 제출이 실패하면 **입력을 지우지 말고** 에러 메시지 + 재시도 경로를 준다. `catch {}`로 삼키거나 `submitting`을 true로 둔 채 끝내면 사용자가 갇힌다.
- 비활성 버튼은 회색으로만 두지 말고 **무엇이 빠졌는지** 문구로 알려준다 (`findMissing()` 패턴).

### 타입 정의

```tsx
import { parseOptions, type LobbyRoom, type ResultsRoom, type Question } from "@/lib/types";
```

- 도메인 타입은 **전부 `@/lib/types`에 있다.** 컴포넌트 파일에서 `Room`/`Question`/`Participant`/`Answer`를 재선언하지 말 것.
- 방 타입은 화면이 받는 데이터에 따라 나뉜다 — `LobbyRoom`(남의 답변 없음) / `ResultsRoom`(답변 포함) / `AdminRoom`(+createdAt).
- `any` 사용 금지. unknown 또는 명시적 타입 사용.
- DB에서 오는 `options`는 `string | null`(JSON 배열)이다. **직접 `JSON.parse` 하지 말고 `parseOptions()`를 쓸 것** — 값이 깨져도 화면이 죽지 않는다.
- Prisma 레코드를 클라이언트로 넘길 땐 `@/lib/serialize`의 `serializeLobbyRoom` / `serializeResultsRoom` / `serializeAdminRoom`을 쓴다. Date 직렬화와 `Question.type` 좁히기가 여기 한 곳에만 있다.
- 질문 유형별 아이콘·라벨·색은 `@/lib/question-meta`의 `QUESTION_META`가 단일 출처다.

### 유틸리티

```tsx
import { cn } from "@/lib/utils";  // clsx + tailwind-merge
```

조건부 클래스는 항상 `cn()` 사용.

### API Route

```tsx
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json(data);
}
```

- 에러는 `NextResponse.json({ error: "메시지" }, { status: 4xx })` 형식.
- params는 항상 `Promise<{ id: string }>` + `await params`.
- 쿠키를 읽어야 하면 `request: NextRequest` + `request.cookies.get(...)`.
- **쓰기 엔드포인트(POST/PUT/DELETE)는 반드시 `@/lib/rate-limit`의 `checkRateLimit` + `clientKey`로 시작한다.** 429면 `Retry-After` 헤더를 붙인다. 메모리 기반이라 인스턴스 여러 개에서는 인스턴스별로 따로 논다는 한계는 있지만, 단일 요청 경로를 두들기는 가장 흔한 남용은 막아준다.
- **바디 필드는 전부 `typeof` + 길이 상한을 서버에서 다시 검증한다.** 클라이언트 `maxLength`는 UI 편의일 뿐 보안 경계가 아니다 — 프론트 상한과 서버 상한 숫자를 반드시 맞출 것 (예: `rooms/route.ts`의 `TITLE_MAX`는 `create-editor.tsx`의 `TITLE_MAX`와 같은 50).
- 다른 리소스를 참조하는 id(예: `questionId`)가 바디에 오면, **그 id가 실제로 이 요청이 속한 리소스(방)의 것인지 반드시 검증한다.** 안 그러면 다른 방의 id를 주입할 수 있다.

### Prisma

```tsx
import { prisma } from "@/lib/prisma";

const room = await prisma.room.findUnique({
  where: { id },
  include: {
    questions: { orderBy: { order: "asc" } },
    participants: { include: { answers: true } },
  },
});
```

---

## 동결 보존 (아카이브)

공개방은 만료되면 지워지고 방 페이지는 전부 noindex다. 즉 사람들이 실제로 답을 채운
콘텐츠가 통째로 증발하고 검색에 남는 게 하나도 없었다. 그래서 참여자가
`FREEZE_MIN_PARTICIPANTS`명 이상인 공개방만 삭제 대신 얼린다 (`src/lib/room-archive.ts`).

- `Room.frozenAt`이 찍히면 동결이다. `/api/cron/cleanup`이 **삭제보다 먼저** 얼린다 -
  순서가 바뀌면 보존 대상이 그대로 지워진다. 삭제 쿼리는 `frozenAt: null`로 한정한다.
- **비공개방은 절대 얼리지 않는다.** 닉네임이 실명일 수 있고 닫힌 그룹에만 공유된 링크다.
  색인 가능한 영구 페이지로 만드는 건 그 전제를 깨는 짓이다.
- 정본 URL은 `/archive/[id]` 하나다. `/room/[id]`와 `/room/[id]/results`는 동결 방이면
  거기로 리다이렉트한다. `/room/*`이 robots.txt에서 막혀 있어서 `/room/` 밑에 두면
  색인 자체가 안 된다 - 그래서 경로를 분리했다.
- 화면은 `ResultsClient`에 `archived` prop을 넘겨 재사용한다. 초대·공유 버튼과 결과
  이미지 섹션은 숨긴다 (이미지 라우트는 만료 방에 410을 준다).
- 동결 방은 만료 시각이 지났으므로 `POST /api/rooms/[id]/answers`가 이미 410으로 막는다.
  별도 가드를 넣지 않았다.

## 인기 질문 집계 (`Question.sourceId`)

"이 질문이 실제로 몇 명한테 답을 받았나"를 세려면 방의 문항이 어느 인기 질문에서
왔는지 알아야 한다. 예전엔 방을 만들 때 문항 **텍스트만** 복사돼서 출처가 끊겼고,
제목은 편집 가능하니 텍스트 매칭도 못 쓴다.

- `Question.sourceId`에 `POPULAR_QUESTIONS`의 id를 남긴다. 사용자가 직접 쓴 질문은 null.
- 서버는 클라이언트가 보낸 id를 그대로 믿지 않고 `POPULAR_QUESTION_IDS`에 있는지 확인한다.
  안 그러면 조작된 값이 집계에 섞인다.
- 인기 순위 기준은 **답변 수**로 정했다 (채택된 방 수가 아니라). 방장의 선택만 세면
  아무도 안 답한 방이 순위를 만든다.
- 주간 Top 10 UI는 아직 없다. 데이터가 쌓이기 전에 만들면 빈 페이지가 되고,
  `/popular/*`는 이제 검색 진입점이라 본문이 매주 갈리면 오히려 손해다. 나중에 붙일 땐
  기존 큐레이션 목록을 **대체하지 말고 위에 얹을 것** - 데이터가 없으면 섹션이 안 그려지게.

## 공유·검색 유입

- **링크 미리보기(OG)**: `src/app/room/[id]/layout.tsx`의 `generateMetadata`가 방마다 다른 제목·설명을 만들고,
  이미지는 `/og/room/[id]`가 굽는다 (`InviteImage`, 1200x630). page.tsx가 아니라 layout에 있는 이유는
  메타데이터가 레이아웃을 따라 내려가야 `/results`와 `/share`까지 같은 미리보기를 쓰기 때문이다.
- OG 이미지 경로가 `/api/`나 `/room/` 밑이면 안 된다 — robots.txt에서 막혀 있어서 크롤러가 못 가져간다.
  `robots.ts`의 allow 목록에 `/og/`가 들어 있으니 둘 중 하나만 고치지 말 것.
- **OG에 답변 데이터를 넣지 말 것.** `getRoomShareInfo()`는 제목·질문 수·참여자 수·첫 질문만 읽는다.
  쿠키 없는 크롤러에게 그대로 나가는 값이라 Answer Lock 바깥이다.
- **주제 페이지**(`/popular/[topic]`)는 `src/data/question-topics.ts`가 단일 출처다. 테마(question-packs)와
  달리 문항이 겹쳐도 된다 — 검색 의도별 랜딩이라 "탕수육 부먹 찍먹"이 술자리에도 MT에도 들어간다.
  문항은 여기서도 id로만 참조한다. 주제를 추가하면 sitemap은 자동으로 따라온다.

## 인기 질문 · 질문 테마

`popular-questions.ts`의 28문항이 유일한 출처다. 각 문항은 안정적인 `id`(예: `b-tangsuyuk`)를 갖는다.

사용자에게 보이는 명칭은 **테마**다 ("팩"은 2026-08에 "테마"로 바꿨다 — `PackPicker`/`question-packs.ts`/`QuestionPack`/`initialSource="pack"` 같은 코드 식별자는 그대로 두고, 화면에 노출되는 문구만 바꿨다는 뜻. 새 코드에서도 변수명은 `pack` 계열을 그대로 쓰고, 사용자 문구에서만 "테마"라고 쓸 것 — 식별자까지 바꾸는 전면 리네임은 하지 않았다).

- `question-packs.ts`의 테마 정의는 **문항 텍스트를 복사하지 않고 `id` 배열로 참조**한다. 테마에 새 문항이 필요하면 먼저 `popular-questions.ts`에 `id`를 붙여 추가하고, 테마 정의에서는 그 id만 적을 것. 텍스트를 두 곳에 적으면 나중에 한쪽만 고치는 사고가 난다.
- 테마 하나는 5문항, 여러 유형을 섞는다. 같은 문항을 두 테마에 중복으로 넣지 않는다 — 사용자가 여러 테마를 훑어볼 때 겹치면 재탕처럼 보인다.
- `/create`에서 테마를 고르면 `CreateEditor`에 `initialSource="pack"`으로 들어간다. `initialSource="storage"`(기본값)만 "작성 중이던 내용을 불러왔어요" 배너를 띄운다 — 테마 선택은 복원이 아니라 사용자가 방금 고른 것이니 혼동하지 말 것.

---

## DB 스키마 요약

```
Room         id(cuid), title, isPublic(기본 false), createdAt, expiresAt
Question     id, roomId, type, title, optionA?, optionB?, options?(JSON), order
Participant  id, roomId, nickname, createdAt
Answer       id, questionId, participantId, value
             unique(questionId, participantId)
```

- `Question.type`: `"balance"` | `"multiple"` | `"subjective"`
- `Question.options`: `JSON.stringify(string[])` — 객관식 선택지
- `Answer.value`: balance → `"A"` | `"B"`, multiple → 인덱스 문자열, subjective → 자유 텍스트
- 방 수명은 공개 여부로 갈린다 (`src/lib/room-lifetime.ts`가 단일 출처): 비공개 24시간, 공개 7일.
  **공개방은 새 참여자 한 명당 하루씩 늘어나고, 생성 시각 기준 30일이 상한이다.**
  이게 이 제품의 유일한 유포 동기다 - 공개방을 만든 사람에게 "친구한테 보낼 이유"를,
  답하는 사람에게 기여감을 만든다. 그래서 수명 계산보다 **화면에 뜨는 문구가 본체다**
  (로비 "지금 답하면 하루 더 열려요", 결과 "한 명 답할 때마다 하루 더 열려요, 지금 N일 남음").
  연장 단위를 1시간처럼 잘게 잡지 말 것 - "N일 남음"이 안 움직이면 없는 기능이다.
  연장은 `status === "created"`, 즉 **진짜 새 참여자일 때만** 한다. 재제출(recovered/replayed)로
  수명을 계속 늘릴 수 있으면 안 된다. 상한은 중복 참여 우회로 무한정 늘리는 것도 같이 막는다.
  공개방이 더 오래 사는 건 랜딩·`/discover`가 공개방으로 채워지기 때문이다 - 24시간마다 전부
  사라지면 새 방문자가 빈 사이트를 본다. `/api/cron/cleanup`이 만료 방을 지우고, 같은 실행에서
  `topUpPublicRooms()`로 공개방 수를 `PUBLIC_ROOM_FLOOR`까지 테마 방으로 채운다.

---

## 보안 불변식

새 코드로 이 규칙들을 깨뜨리지 말 것.

### Answer Lock

남의 답변은 **본인이 전 문항을 답한 뒤에만** 보인다. 방 참여만으로는 부족하다. **단, `room.isPublic`이 true인 방은 이 게이트를 건너뛴다** — 공개방은 링크를 아는 누구나 답변 없이 결과를 볼 수 있는 게 의도된 동작이다 (`results/page.tsx`에서 `!room.isPublic && !hasCompletedAnswers(...)`로 체크).

```tsx
import { hasCompletedAnswers, participantCookieName } from "@/lib/participant-session";

const participantId = request.cookies.get(participantCookieName(roomId))?.value;
const viewer = participants.find((p) => p.id === participantId);

if (!room.isPublic && !hasCompletedAnswers(viewer, room.questions.length)) {
  // participants[].answers 를 응답에 포함하지 말 것
}
```

- `participant_<roomId>` 쿠키는 **`POST /api/rooms/[id]/answers` 응답에서 서버가 httpOnly로 굽는다.** 클라이언트에서 `document.cookie`로 심지 말 것.
- 답변 데이터를 반환하는 새 엔드포인트를 만들면 반드시 같은 게이트를 통과시킬 것 (단 위의 공개방 예외는 지킬 것).
- `GroupReport`(궁합·소수파 통계)는 공개방에서 **숨긴다** (`!room.isPublic && ...`). "지우와 87% 일치"는 이름 붙은 우리 그룹 전제인데, 공개방은 서로 모르는 사람들이 보는 결과라 그 전제가 깨진다. 참여자별 `ResultBar` 집계는 공개방에서도 그대로 보여준다 — 숨기는 건 궁합 계산뿐이다.
- **공개방은 익명이다** (2026-08 추가). `POST /api/rooms/[id]/answers`는 `room.isPublic`이면 클라이언트가 보낸 닉네임을 무시하고 서버가 `참여자 N`을 자동으로 붙인다. `Participant.nickname`은 공개방에서는 실명이 아니라 서버가 만든 placeholder다 — **새 화면에서 닉네임을 신원처럼 쓰기 전에 반드시 `room.isPublic`을 확인할 것.** 결과 화면의 참여자별 롤스터·투표자 칩·참여자 목록 카드는 공개방에서 전부 숨기고 집계 막대·숫자만 보여준다 (`results-client.tsx`의 `anonymous` prop). `share-card.tsx`의 궁합 칩도 같은 이유로 `!room.isPublic`일 때만 계산한다 — 예전엔 이 게이트가 빠져 있었다.
- **공개방 발견 피드**(`/discover`, 랜딩의 `DiscoverTeaserSection`, `PackPicker`의 링크)도 2026-08에 붙었다. `GET /api/rooms/discover`가 페이지네이션(최신순/인기순/답변 많은순)을 맡고, `src/lib/discover-rooms.ts`의 `getPublicRooms()` 하나만 랜딩·피드 페이지·API 라우트가 공유한다 — 목록 쿼리를 각자 다시 짜지 말 것. **신고·숨김 같은 모더레이션은 아직 없다** — 낯선 방문자에게 노출되는 표면인데도 사용자 요청으로 이번 범위에서 의도적으로 뺐다. 나중에 붙일 때 숨김 처리는 **어드민 페이지에서만** 하기로 이미 정했다 (공개 피드에 신고 버튼 같은 걸 노출하지 말 것).

### 어드민

- `/admin/*` 과 `/api/admin/*` 은 `src/middleware.ts`가 지킨다. **어드민 경로를 추가하면 matcher도 같이 갱신할 것.**
- 세션 쿠키는 비밀번호가 아니라 `lib/admin-session.ts`의 HMAC 서명 토큰이다. 비밀번호를 쿠키·응답·로그에 넣지 말 것.
- 비밀번호 비교는 `verifyAdminPassword()`만 사용 (타이밍 안전 비교).

### 아직 안 된 것 (알려진 갭)

- 어드민 로그인에 브루트포스 방어 없음.
- 레이트리밋이 메모리 기반이라 멀티 인스턴스 배포에서는 인스턴스별로 카운터가 따로 논다. 트래픽이 실제로 커지면 Upstash/KV 같은 공유 저장소로 옮길 것.
- 참여자 중복 제출 방지는 쿠키/리다이렉트뿐이다 (`/room/[id]/page.tsx`가 기존 참여자를 결과로 돌려보냄). 시크릿 모드·쿠키 삭제로 우회 가능 — 친구 그룹 규모에서는 사회적으로 자정된다고 보고 의도적으로 막지 않았다. 공개방 익명화(위 참고) 이후에도 이건 안 바뀌었다: 답변은 여전히 참여자당 1회(`@@unique([questionId, participantId])`)로 막혀 있다. **무제한 재투표를 허용하는 모드는 여전히 계획에서 제외**되어 있다 (푸슝·PIKU가 이미 점유한 자리와 겹친다). "닉네임을 안 받는다"(신원 비공개)와 "몇 번이든 답할 수 있다"(무제한 재투표)는 서로 다른 결정이다 — 공개방의 익명 참여를 이유로 재투표 제한까지 같이 풀지 말 것.

---

## 랜딩 규칙

랜딩은 2026-08 전면 재작업했다. 예전 버전은 "AI가 만든 SaaS 랜딩" 특징을 거의 다 갖고 있었고, 아래는 그때 걷어낸 것들이다. **되살리지 말 것.**

- **히어로는 설명이 아니라 체험이다.** `HeroSection`의 밸런스 질문은 실제로 눌리고 결과가 나온다. div로 만든 가짜 제품 스크린샷으로 되돌리지 말 것.
- **eyebrow 금지.** 섹션 제목 위 작은 대문자 라벨(`text-[10px] uppercase tracking-widest`)은 랜딩에 하나도 없다. 특히 라벨 양옆에 짧은 선을 두는 형태는 가장 알아보기 쉬운 생성형 시그니처다.
- **섹션마다 레이아웃 계열을 바꾼다.** 현재: 비대칭 split / 중앙 진술 + 상태 카드 쌍 / 구분선 행 / 벤토(1 큰 셀 + 2) / 라벨 + 칩 / 중앙 마감. 같은 계열을 두 번 쓰지 말 것.
- **3등분 균등 카드 그리드 금지.** 예전 Steps와 Features가 둘 다 이 형태여서 페이지가 통째로 템플릿처럼 보였다.
- **단계 번호(`01` `02` `03`) 금지.** 단계 제목 자체가 라벨이다.
- **사용자에게 보이는 문자열에 em-dash(`—`) 금지.** 마침표·쉼표·괄호로 바꾼다. (한글 코드 주석은 무관)
- **중간점(`·`) 구분자와 버전 푸터(`v0.1.0`) 금지.** 마케팅 페이지에 빌드 정보를 넣지 않는다.
- **태그 색을 무지개로 돌리지 말 것.** 칩은 amber 단색이다.
- 히어로 텍스트 요소는 최대 4개 (제목, 본문, CTA, + 하나). CTA 밑 작은 태그라인 금지.
- 전체 높이는 `min-h-[100dvh]` (iOS Safari 주소창 때문에 `h-screen` 금지).

랜딩 본문은 `text-base`(16px) 이상을 쓴다. 처음 오는 사람이 읽는 화면이라 앱 내부보다 크게 간다.

---

## 금지 사항

- 이모지 사용 금지 (코드 내, DeerPlaceholder에서만 사용)
- 3D 라이브러리 (`@react-three/fiber` 등) 랜딩 페이지에 사용 금지
- 아이콘-인-박스 UI 패턴 금지
- violet/sky 색상 사용 금지 (대신 amber/teal 사용)
- 다크 배경(`#0d0a07`, `bg-stone-900` 등) 신규 사용 금지 — 라이트 테마다
- `any` 타입 금지
- 불필요한 `useEffect` 남용 금지 — 서버에서 처리 가능한 건 서버에서
- `// 주석` — 명백한 코드엔 주석 불필요. 비즈니스 로직 의도 설명 시에만.

---

## 개발 명령어

```bash
yarn dev          # 개발 서버 (Turbopack)
yarn build        # prisma generate + 프로덕션 빌드
yarn lint         # ESLint
npx prisma studio # DB 관리 UI
```

**주의**: `.env`가 프로덕션 Turso를 가리킨다. `src/lib/prisma.ts`는 `TURSO_DATABASE_URL`을 `DATABASE_URL`보다 먼저 본다 — 즉 아무 설정 없이 `yarn dev`를 돌리면 로컬 실험이 그대로 프로덕션 DB에 씁니다.

**로컬 실험은 반드시 `.env.local`로 덮어쓸 것.** 쉘에서 `TURSO_DATABASE_URL=` 처럼 값만 비우거나 `env -u`로 지워도 소용없다 — Next.js가 프로세스 시작 후 자체적으로 `.env`를 다시 읽어서 그 값을 채워 넣는다. `.env.local`은 `.env`보다 우선순위가 높고 `.gitignore`에 이미 걸려 있어서, 여기서 덮어쓴 값만 실제로 이긴다.

```
# .env.local — 로컬에서만, 절대 커밋되지 않는다
TURSO_DATABASE_URL="file:./dev.db"
TURSO_AUTH_TOKEN=
DATABASE_URL="file:./dev.db"
```

### 환경 변수

```
TURSO_DATABASE_URL / TURSO_AUTH_TOKEN   # 프로덕션 DB
DATABASE_URL                            # prisma CLI 및 로컬 폴백
ADMIN_PASSWORD                          # 어드민 로그인
ADMIN_SESSION_SECRET                    # (선택) 세션 서명 키, 없으면 ADMIN_PASSWORD 사용
CRON_SECRET                             # /api/cron/cleanup Bearer 토큰
DISCORD_WEBHOOK_URL                     # 피드백 전달
NEXT_PUBLIC_KAKAO_JS_KEY                # (선택) 카카오 공유. 없으면 카카오 버튼이 아예 안 그려지고
                                        # navigator.share/링크 복사 경로가 그대로 쓰인다
```
