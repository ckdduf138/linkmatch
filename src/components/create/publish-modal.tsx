"use client";

import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { AlertCircle, ArrowRight, Clock3, Globe, Loader2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { roomLifetimeLabel } from "@/lib/room-lifetime";
import { useAccessibleDialog } from "@/lib/use-accessible-dialog";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  isPublic: boolean;
  onPublicChange: (isPublic: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}

export function PublishModal({
  open,
  onClose,
  isPublic,
  onPublicChange,
  onConfirm,
  loading,
  error,
}: PublishModalProps) {
  const y = useMotionValue(0);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      handleClose();
    }
  };
  const dialogRef = useAccessibleDialog(open, handleClose, loading);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            key="sheet"
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
            className="fixed bottom-0 inset-x-0 z-[60] rounded-t-3xl bg-white border-t border-amber-100 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-dialog-title"
            tabIndex={-1}
          >
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-stone-200" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4">
              <h2 id="publish-dialog-title" className="text-base font-semibold text-stone-900">
                공개 범위를 선택하세요
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex min-h-11 min-w-11 items-center justify-center text-stone-500 transition-colors hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onPublicChange(false)}
                  aria-pressed={!isPublic}
                  data-dialog-autofocus
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    !isPublic
                      ? "border-amber-600 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  )}
                >
                  <Lock className={cn("h-4 w-4", !isPublic ? "text-amber-900" : "text-stone-500")} />
                  <p className={cn("mt-2 text-sm font-semibold", !isPublic ? "text-amber-900" : "text-stone-900")}>
                    비공개
                  </p>
                  <p className={cn("mt-1 text-xs leading-relaxed", !isPublic ? "text-amber-900" : "text-stone-500")}>
                    링크를 받은 사람만 참여할 수 있어요
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onPublicChange(true)}
                  aria-pressed={isPublic}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    isPublic
                      ? "border-amber-600 bg-amber-50"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  )}
                >
                  <Globe className={cn("h-4 w-4", isPublic ? "text-amber-900" : "text-stone-500")} />
                  <p className={cn("mt-2 text-sm font-semibold", isPublic ? "text-amber-900" : "text-stone-900")}>
                    공개
                  </p>
                  <p className={cn("mt-1 text-xs leading-relaxed", isPublic ? "text-amber-900" : "text-stone-500")}>
                    누구나 발견하고 답할 수 있어요. 닉네임 없이 익명으로 참여해요
                  </p>
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-900">
                <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <p className="text-xs leading-relaxed">
                  {isPublic
                    ? `공개방과 답변은 생성 후 ${roomLifetimeLabel(true)} 동안 유지돼요. 다른 사람들이 둘러보고 답할 시간이 필요해서 비공개방보다 오래 남아요.`
                    : `방과 답변은 생성 후 ${roomLifetimeLabel(false)} 동안 유지돼요. 시간이 지나면 자동으로 삭제됩니다.`}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-relaxed">
                    {error}
                    <br />
                    <span className="text-red-600">
                      작성한 내용은 저장돼 있으니 그대로 다시 시도하면 돼요.
                    </span>
                  </p>
                </div>
              )}

              <button
                onClick={onConfirm}
                disabled={loading}
                className={cn(
                  "w-full min-h-12 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2",
                  loading
                    ? "bg-stone-200 text-stone-500"
                    : "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                )}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {error ? "다시 시도" : "링크 만들기"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
