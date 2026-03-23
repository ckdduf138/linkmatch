"use client";

import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { X, Scale, ListChecks, PenLine } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { POPULAR_QUESTIONS, PopularQuestion } from "@/data/popular-questions";

type FilterType = "all" | "balance" | "multiple" | "subjective";

const TYPE_CONFIG = {
  balance: { icon: Scale, label: "밸런스", color: "text-amber-400", badge: "border-amber-200 bg-amber-50 text-amber-700" },
  multiple: { icon: ListChecks, label: "객관식", color: "text-teal-400", badge: "border-teal-200 bg-teal-50 text-teal-700" },
  subjective: { icon: PenLine, label: "주관식", color: "text-stone-400", badge: "border-stone-200 bg-stone-100 text-stone-600" },
} as const;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "balance", label: "밸런스" },
  { key: "multiple", label: "객관식" },
  { key: "subjective", label: "주관식" },
];

interface PopularQuestionsSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (question: PopularQuestion) => void;
}

function QuestionCard({ question, onSelect }: { question: PopularQuestion; onSelect: (q: PopularQuestion) => void }) {
  const { icon: Icon } = TYPE_CONFIG[question.type];

  let preview = "";
  if (question.type === "balance") {
    preview = `${question.optionA} · ${question.optionB}`;
  } else if (question.type === "multiple") {
    const opts = question.options?.slice(0, 2) ?? [];
    preview = opts.join(" · ");
  } else {
    preview = "자유 답변";
  }

  return (
    <motion.button
      onClick={() => onSelect(question)}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left px-4 py-4 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/30 transition-colors duration-200"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-900 leading-snug mb-1.5">{question.title}</p>
          <p className="text-[11px] text-stone-500 truncate">{preview}</p>
        </div>
      </div>
    </motion.button>
  );
}

export function PopularQuestionsSheet({ open, onClose, onSelect }: PopularQuestionsSheetProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const y = useMotionValue(0);

  const filteredQuestions = POPULAR_QUESTIONS.filter((q) => filter === "all" || q.type === filter);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleSelect = (question: PopularQuestion) => {
    onSelect(question);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
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
            className="fixed bottom-0 inset-x-0 z-[60] h-[70vh] rounded-t-3xl bg-white border-t border-amber-100 overflow-hidden"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-stone-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-base font-semibold text-stone-900">인기 질문</h2>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 pb-4 flex gap-2 border-b border-stone-200">
              {FILTERS.map(({ key, label }) => (
                <motion.button
                  key={key}
                  onClick={() => setFilter(key)}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150",
                    filter === key ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Question List */}
            <div
              className="overflow-y-auto h-[calc(70vh-140px)] px-4 pb-8 space-y-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question, idx) => (
                    <motion.div
                      key={question.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                    >
                      <QuestionCard question={question} onSelect={handleSelect} />
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-stone-500">질문이 없습니다</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
