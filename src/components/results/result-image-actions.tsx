"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Download, Image as ImageIcon, Loader2, RefreshCw, Share2, Sparkles } from "lucide-react";
import type { ResultsRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

const IMAGE_TIMEOUT_MS = 15_000;
const MIN_PNG_BYTES = 1_000;

type PreparedImage = {
  file: File;
  previewUrl: string;
};

function isShareCanceled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * 결과 이미지는 사용자가 누를 때 만든다.
 *
 * 예전엔 마운트 즉시 fetch 해서, 결과 페이지에 들어오기만 해도 서버가 1080x1080
 * ImageResponse를 매번 구웠다 (라우트가 force-dynamic + no-store다). 공유 버튼을
 * 누르지도 않은 사람 몫까지 굽고 있었다는 뜻이다.
 */
export function ResultImageActions({ room }: { room: ResultsRoom }) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // attempt 0은 "아직 아무도 안 눌렀다"는 뜻이다.
    if (attempt === 0) return;

    const controller = new AbortController();
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, IMAGE_TIMEOUT_MS);

    async function loadImage() {
      try {
        const response = await fetch(`/api/rooms/${room.id}/image?attempt=${attempt}`, {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "결과 이미지를 만들지 못했어요.");
        }
        const contentType = response.headers.get("content-type")?.split(";")[0];
        const blob = await response.blob();
        if (contentType !== "image/png" || blob.type !== "image/png" || blob.size < MIN_PNG_BYTES) {
          throw new Error("완성된 PNG를 확인하지 못했어요. 다시 시도해 주세요.");
        }

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const previewUrl = URL.createObjectURL(blob);
        previewUrlRef.current = previewUrl;
        setPrepared({
          previewUrl,
          file: new File([blob], `deerlink-${room.id}.png`, { type: "image/png" }),
        });
        setStatus("ready");
      } catch (error: unknown) {
        if (controller.signal.aborted && !timedOut) return;
        setStatus("error");
        setMessage(
          timedOut
            ? "이미지 생성 시간이 15초를 넘었어요. 네트워크를 확인하고 다시 시도해 주세요."
            : error instanceof Error
              ? error.message
              : "결과 이미지를 만들지 못했어요. 다시 시도해 주세요."
        );
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadImage();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt, room.id]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const generate = () => {
    setPrepared(null);
    setStatus("loading");
    setMessage(null);
    setAttempt((value) => value + 1);
  };

  const saveImage = () => {
    if (!prepared) return;
    const link = document.createElement("a");
    link.href = prepared.previewUrl;
    link.download = prepared.file.name;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setMessage("이미지를 저장했어요. 다운로드에서 확인해 주세요.");
  };

  const shareImage = async () => {
    if (!prepared) return;
    setMessage(null);
    try {
      if (navigator.share && navigator.canShare?.({ files: [prepared.file] })) {
        await navigator.share({
          files: [prepared.file],
          title: room.title,
          text: "Deerlink에서 발견한 우리 결과예요.",
        });
        setMessage("공유 창에 이미지를 준비했어요.");
        return;
      }

      saveImage();
      setMessage("이 브라우저는 파일 공유를 지원하지 않아 이미지를 저장했어요.");
    } catch (error) {
      if (!isShareCanceled(error)) {
        setMessage("공유 창을 열지 못했어요. 이미지 저장을 이용해 주세요.");
      }
    }
  };

  return (
    <section aria-labelledby="result-image-heading">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id="result-image-heading" className="text-lg font-bold text-stone-900">
            결과 이미지
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">
            {status === "idle"
              ? "1080×1080 정사각 이미지로 만들어 저장하거나 공유할 수 있어요."
              : "이미지를 저장하거나 공유하세요."}
          </p>
        </div>
        {status === "ready" && (
          <button
            type="button"
            onClick={generate}
            className="inline-flex min-h-11 flex-shrink-0 items-center gap-1.5 px-2 text-xs font-medium text-stone-600 transition-colors hover:text-stone-900"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            다시 만들기
          </button>
        )}
      </div>

      <div className="aspect-square overflow-hidden rounded-2xl border border-amber-100 bg-white">
        {status === "idle" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <ImageIcon className="h-7 w-7 text-stone-400" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-stone-600">
              아직 이미지를 만들지 않았어요.
            </p>
          </div>
        )}
        {status === "loading" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-stone-600" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
            <p className="text-sm">1080×1080 이미지를 준비하고 있어요.</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <ImageIcon className="mb-4 h-7 w-7 text-stone-500" aria-hidden="true" />
            <p className="max-w-sm text-sm leading-relaxed text-red-700" role="alert">
              {message}
            </p>
            <button
              type="button"
              onClick={generate}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </button>
          </div>
        )}
        {status === "ready" && prepared && (
          <Image
            src={prepared.previewUrl}
            alt={`${room.title} 결과 이미지 미리보기`}
            width={1080}
            height={1080}
            unoptimized
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {status === "idle" ? (
        <button
          type="button"
          onClick={generate}
          className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition-colors hover:bg-amber-500"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          결과 이미지 만들기
        </button>
      ) : (
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={saveImage}
          disabled={status !== "ready" || !prepared}
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
            status === "ready"
              ? "border-amber-200 bg-white text-stone-800 hover:border-amber-300"
              : "cursor-wait border-stone-200 bg-stone-100 text-stone-500"
          )}
        >
          <Download className="h-4 w-4" />
          이미지 저장
        </button>
        <button
          type="button"
          onClick={shareImage}
          disabled={status !== "ready" || !prepared}
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors",
            status === "ready"
              ? "bg-amber-600 text-white shadow-lg shadow-amber-900/25 hover:bg-amber-500"
              : "cursor-wait bg-stone-200 text-stone-500"
          )}
        >
          <Share2 className="h-4 w-4" />
          공유하기
        </button>
      </div>
      )}

      {message && status !== "error" && (
        <p className="mt-3 text-center text-xs leading-relaxed text-amber-800" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </section>
  );
}
