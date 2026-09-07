"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { isKakaoShareEnabled, shareRoomToKakao } from "@/lib/kakao-share";

/**
 * 카카오 키가 없으면 아무것도 그리지 않는다. 눌렀는데 안 되는 버튼보다 없는 게 낫다.
 */
export function KakaoShareButton({
  roomId,
  roomTitle,
  description,
  roomUrl,
  className,
}: {
  roomId: string;
  roomTitle: string;
  description: string;
  roomUrl: string;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  if (!isKakaoShareEnabled() || !roomUrl) return null;

  const handleClick = async () => {
    setError(null);
    const origin = new URL(roomUrl).origin;
    const ok = await shareRoomToKakao({
      title: roomTitle,
      description,
      roomUrl,
      imageUrl: `${origin}/og/room/${encodeURIComponent(roomId)}`,
    });
    if (!ok) {
      setError("카카오톡 공유를 열지 못했어요. 링크 복사를 이용해 주세요.");
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fee500] px-5 text-sm font-semibold text-[#191600] transition-opacity hover:opacity-90"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        카카오톡으로 공유
      </button>
      {error && (
        <p className="mt-2 text-xs leading-relaxed text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
