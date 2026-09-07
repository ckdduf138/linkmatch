import type { CSSProperties, ReactElement } from "react";
import { ANTLER_LOGO_PATHS } from "@/components/landing/antler-logo-paths";
import { formatEstimatedDuration } from "@/lib/format";
import type { RoomShareInfo, RoomSharePreview } from "@/lib/room-share";

const row: CSSProperties = { display: "flex", alignItems: "center" };
const column: CSSProperties = { display: "flex", flexDirection: "column" };

const TYPE_LABEL: Record<RoomSharePreview["type"], string> = {
  balance: "밸런스 게임",
  multiple: "객관식",
  subjective: "주관식",
};

function titleFontSize(text: string): number {
  if (text.length > 40) return 46;
  if (text.length > 24) return 56;
  return 66;
}

function questionFontSize(text: string): number {
  if (text.length > 46) return 30;
  if (text.length > 26) return 34;
  return 38;
}

function QuestionCard({ question }: { question: RoomSharePreview }): ReactElement {
  return (
    <div
      style={{
        ...column,
        gap: 20,
        marginTop: 30,
        padding: "30px 34px",
        border: "2px solid #fde6c1",
        borderRadius: 24,
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ fontSize: 21, fontWeight: 700, color: "#92400e" }}>
        {TYPE_LABEL[question.type]}
      </div>
      <div
        style={{
          fontSize: questionFontSize(question.title),
          lineHeight: 1.3,
          fontWeight: 700,
          color: "#1c1917",
          overflowWrap: "anywhere",
        }}
      >
        {question.title}
      </div>

      {question.type === "balance" && (
        <div style={{ display: "flex", gap: 14 }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              padding: "16px 18px",
              borderRadius: 14,
              backgroundColor: "#fef3e2",
              color: "#78350f",
              fontSize: 26,
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {question.optionA}
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              padding: "16px 18px",
              borderRadius: 14,
              backgroundColor: "#e6f4f1",
              color: "#115e56",
              fontSize: 26,
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {question.optionB}
          </div>
        </div>
      )}

      {question.type === "multiple" && question.options.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {question.options.slice(0, 4).map((option) => (
            <div
              key={option}
              style={{
                display: "flex",
                padding: "11px 18px",
                borderRadius: 999,
                backgroundColor: "#f5f5f4",
                color: "#44403c",
                fontSize: 23,
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 초대 링크(단톡방에 붙여넣는 그 링크)의 미리보기 이미지.
 * 결과 공유용 ShareImage와 달리 답변 데이터를 일절 담지 않는다 — 쿠키 없는
 * 크롤러가 가져가는 이미지라 Answer Lock 바깥에서 안전해야 한다.
 */
export function InviteImage({ info }: { info: RoomShareInfo }): ReactElement {
  const title = info.expired ? "만료된 방이에요" : info.title;

  return (
    <div
      lang="ko-KR"
      style={{
        ...column,
        width: 1200,
        height: 630,
        padding: 56,
        boxSizing: "border-box",
        backgroundColor: "#fafaf8",
        backgroundImage: "radial-gradient(#f3d9a8 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
        color: "#1c1917",
        fontFamily: "GowunDodum, sans-serif",
      }}
    >
      <div style={{ ...row, gap: 12 }}>
        <svg
          viewBox="0 0 24 28"
          width="28"
          height="33"
          fill="none"
          stroke="#d97706"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {ANTLER_LOGO_PATHS.map((path) => (
            <path key={path} d={path} />
          ))}
        </svg>
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>Deerlink</span>
      </div>

      <div
        style={{
          marginTop: 26,
          fontSize: titleFontSize(title),
          lineHeight: 1.18,
          fontWeight: 700,
          letterSpacing: -1,
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </div>

      {info.firstQuestion && !info.expired ? (
        <QuestionCard question={info.firstQuestion} />
      ) : (
        <div
          style={{
            display: "flex",
            marginTop: 30,
            padding: "34px 34px",
            border: "2px solid #fde6c1",
            borderRadius: 24,
            backgroundColor: "#ffffff",
            fontSize: 34,
            lineHeight: 1.35,
            fontWeight: 700,
            color: "#44403c",
          }}
        >
          {info.expired
            ? "새 방을 만들어 다시 비교해보세요."
            : "링크 하나로 그룹의 답을 비교해요."}
        </div>
      )}

      <div
        style={{
          ...row,
          justifyContent: "space-between",
          marginTop: "auto",
          fontSize: 23,
          color: "#57534e",
        }}
      >
        <span>
          {info.expired
            ? "deerlink.kr에서 새 방 만들기"
            : `질문 ${info.questionCount}개, ${formatEstimatedDuration(info.questionCount)}${
                info.participantCount > 0 ? `, ${info.participantCount}명 참여` : ""
              }`}
        </span>
        <span style={{ color: "#92400e", fontWeight: 700 }}>deerlink.kr</span>
      </div>
    </div>
  );
}
