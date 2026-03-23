import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Deerlink — 링크 하나로 모두의 생각을 비교해요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#fafaf8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <svg
          width="72"
          height="84"
          viewBox="0 0 24 28"
          fill="none"
          stroke="#e8a038"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4" />
          <path d="M5.5 9 C3 7 1.5 5 2 2" />
          <path d="M7.5 14 C5 13 3.5 11 4 8" />
          <path d="M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4" />
          <path d="M18.5 9 C21 7 22.5 5 22 2" />
          <path d="M16.5 14 C19 13 20.5 11 20 8" />
        </svg>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "#1c1917",
            letterSpacing: "-3px",
            marginTop: 20,
            lineHeight: 1,
          }}
        >
          Deerlink
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#78716c",
            marginTop: 18,
            letterSpacing: "-0.5px",
          }}
        >
          링크 하나로 모두의 생각을 비교해요
        </div>
        <div
          style={{
            width: 56,
            height: 3,
            background: "#e8a038",
            borderRadius: 4,
            marginTop: 28,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
