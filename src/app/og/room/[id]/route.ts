import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { InviteImage } from "@/components/results/invite-image";
import { getRoomShareInfo } from "@/lib/room-share";

export const runtime = "nodejs";

/**
 * 초대 링크의 OG 미리보기 이미지.
 *
 * `/api/*`와 `/room/*`은 robots.txt에서 막혀 있어서 얌전한 크롤러(페이스북 등)가
 * 이미지를 못 가져간다. 그래서 별도 `/og/*` 경로에 둔다 — robots.ts의 allow 목록과
 * 같이 움직여야 하니 둘 중 하나만 고치지 말 것.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const info = await getRoomShareInfo(id);

  if (!info) {
    return NextResponse.json({ error: "방을 찾을 수 없어요." }, { status: 404 });
  }

  return new ImageResponse(InviteImage({ info }), {
    width: 1200,
    height: 630,
    headers: {
      // 크롤러가 한 번 가져가면 오래 캐싱하니 참여자 수가 조금 늦게 반영돼도 괜찮다.
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
