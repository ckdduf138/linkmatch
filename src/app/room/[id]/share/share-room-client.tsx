"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Copy, ListChecks, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { KakaoShareButton } from "@/components/share/kakao-share-button";
import { formatEstimatedDuration } from "@/lib/format";
import { roomShareDescription } from "@/lib/room-share-text";
import { participantPath, participantUrl } from "@/lib/room-url";
import type { LobbyRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

const neverChanges = () => () => {};
const noUrl = () => "";

function isShareCanceled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function ShareRoomClient({ room }: { room: LobbyRoom }) {
  const inviteUrl = useSyncExternalStore(
    neverChanges,
    () => participantUrl(window.location.origin, room.id),
    noUrl
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shareDescription = roomShareDescription({
    expired: false,
    isPublic: room.isPublic,
    questionCount: room.questions.length,
    participantCount: room.participants.length,
  });

  const copyInvite = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setError(null);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("링크를 복사하지 못했어요. 주소를 길게 눌러 직접 복사해 주세요.");
    }
  };

  const shareInvite = async () => {
    if (!inviteUrl) return;
    if (!navigator.share) {
      await copyInvite();
      return;
    }
    try {
      await navigator.share({
        title: room.title,
        text: "Deerlink에서 같이 답해봐요.",
        url: inviteUrl,
      });
      setError(null);
    } catch (shareError) {
      if (!isShareCanceled(shareError)) {
        setError("공유 창을 열지 못했어요. 링크 복사를 이용해 주세요.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf8] px-4 pb-12 pt-10 text-stone-900 sm:pt-14">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center gap-2 text-sm font-semibold tracking-tight text-stone-900">
          <AntlerLogo className="h-[18px] w-3.5 text-amber-500" />
          Deerlink
        </div>

        <div className="mb-7">
          <div className="mb-4 flex items-center gap-2 text-amber-800">
            <Check className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-semibold">생성 완료</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-stone-900">
            방을 만들었어요
          </h1>
          <p className="mt-3 break-words text-base leading-relaxed text-stone-600">{room.title}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-stone-600">
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            <span>{room.questions.length}개 질문</span>
            <span aria-hidden="true">,</span>
            <span>{formatEstimatedDuration(room.questions.length)}</span>
          </div>
        </div>

        <section aria-labelledby="invite-heading" className="overflow-hidden rounded-2xl border border-amber-100 bg-white">
          <div className="border-b border-stone-100 px-5 py-4">
            <h2 id="invite-heading" className="text-base font-semibold text-stone-900">
              친구를 초대하세요
            </h2>
          </div>
          <div className="flex justify-center border-b border-stone-100 py-6">
            {inviteUrl ? (
              <div role="img" aria-label="참여 링크 QR 코드">
                <QRCodeSVG
                  value={inviteUrl}
                  size={176}
                  fgColor="#1c1917"
                  bgColor="transparent"
                  imageSettings={{ src: "/icon.png", width: 28, height: 28, excavate: true }}
                />
              </div>
            ) : (
              <div className="h-44 w-44 animate-pulse rounded-xl bg-stone-100" role="status">
                <span className="sr-only">QR 코드 준비 중</span>
              </div>
            )}
          </div>
          <p className="break-all border-b border-stone-100 px-5 py-3 text-xs leading-relaxed text-stone-600">
            {inviteUrl || "참여 주소를 준비하고 있어요."}
          </p>
          <KakaoShareButton
            className="border-b border-stone-100 px-5 py-4"
            roomId={room.id}
            roomTitle={room.title}
            description={shareDescription}
            roomUrl={inviteUrl}
          />
          <div className="grid grid-cols-2 divide-x divide-stone-100">
            <button
              type="button"
              onClick={copyInvite}
              disabled={!inviteUrl}
              className={cn(
                "flex min-h-12 items-center justify-center gap-2 text-sm font-medium transition-colors disabled:text-stone-500",
                copied ? "text-amber-700" : "text-stone-700 hover:text-stone-900"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "복사됨" : "링크 복사"}
            </button>
            <button
              type="button"
              onClick={shareInvite}
              disabled={!inviteUrl}
              className="flex min-h-12 items-center justify-center gap-2 text-sm font-medium text-stone-700 transition-colors hover:text-stone-900 disabled:text-stone-500"
            >
              <Share2 className="h-4 w-4" />
              공유하기
            </button>
          </div>
          {error && (
            <p className="border-t border-red-100 px-5 py-3 text-xs leading-relaxed text-red-700" role="alert">
              {error}
            </p>
          )}
        </section>

        <Link
          href={participantPath(room.id)}
          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition-colors hover:bg-amber-500"
        >
          나도 답하기
        </Link>
        <Link
          href="/"
          className="mt-2 flex min-h-11 w-full items-center justify-center text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
