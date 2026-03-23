# Deerlink

링크 하나로 그룹 전체의 생각을 비교하는 플랫폼.

방 생성자가 질문을 만들고 링크를 공유하면, 참여자 전원이 같은 질문에 답한 뒤 결과를 한꺼번에 비교합니다.

## 핵심 기능

- **밸런스 게임** — A vs B, 둘 중 하나를 선택
- **객관식** — 여러 선택지 중 하나
- **주관식** — 자유 텍스트 응답
- **Answer Lock** — 모두가 답변을 완료하기 전까지 다른 참여자의 선택 비공개 (API 레벨 강제)

## 기술 스택

| 레이어 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Icons | lucide-react |
| ORM | Prisma 7 |
| DB | SQLite → Turso (libSQL) |

## 로컬 실행

```bash
# 의존성 설치
pnpm install

# DB 초기화
npx prisma migrate dev --name init

# 개발 서버 실행
pnpm dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

## 배포 (Vercel + Turso)

### 1. Turso DB 세팅

```bash
# Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 로그인 및 DB 생성
turso auth login
turso db create deerlink

# 환경변수 확인
turso db show deerlink --url
turso db tokens create deerlink
```

### 2. Prisma 설정 변경

`prisma/schema.prisma`에서 datasource를 libsql로 변경:

```prisma
datasource db {
  provider = "libsql"
  url      = env("TURSO_DATABASE_URL")
  authToken = env("TURSO_AUTH_TOKEN")
}
```

### 3. Vercel 배포

1. GitHub에 push
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경변수 설정 (아래 참고)
4. Deploy

## 환경변수

```env
# Turso (프로덕션)
TURSO_DATABASE_URL=libsql://[db-name]-[org].turso.io
TURSO_AUTH_TOKEN=your-token-here

# 앱 URL (OG 이미지, sitemap)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## DB 스키마

```
Room         id(cuid), title, createdAt
Question     id, roomId, type, title, optionA?, optionB?, options?(JSON), order
Participant  id, roomId, nickname, createdAt
Answer       id, questionId, participantId, value
```

- `Answer.value`: balance → `"A"` | `"B"`, multiple → 인덱스 문자열, subjective → 자유 텍스트
