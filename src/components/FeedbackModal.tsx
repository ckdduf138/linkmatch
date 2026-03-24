"use client";

import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const y = useMotionValue(0);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (status === "sending") return;
    onClose();
    setTimeout(() => {
      setMessage("");
      setContact("");
      setStatus("idle");
    }, 300);
  };

  const handleSubmit = async () => {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contact }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

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
          />

          <motion.div
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
          >
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-stone-200" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-base font-semibold text-stone-900">피드백 보내기</h2>
              <button
                onClick={handleClose}
                className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-8 space-y-4">
              {status === "done" ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-medium text-stone-900 mb-1">피드백이 전달됐어요</p>
                  <p className="text-xs text-stone-500">소중한 의견 감사합니다.</p>
                </div>
              ) : (
                <>
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="버그 신고, 기능 제안, 뭐든 좋아요"
                      rows={5}
                      className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="연락처 (선택) — 이메일, 트위터 등"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition-colors"
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-xs text-red-500">전송에 실패했어요. 다시 시도해 주세요.</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || status === "sending"}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-medium transition-colors"
                  >
                    {status === "sending" ? "전송 중..." : "보내기"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
