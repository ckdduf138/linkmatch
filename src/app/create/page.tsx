"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Scale,
  ListChecks,
  PenLine,
  GripVertical,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { PopularQuestionsSheet } from "@/components/PopularQuestionsSheet";
import type { PopularQuestion } from "@/data/popular-questions";

/* ─── Types ─────────────────────────────────────── */

type QuestionType = "balance" | "multiple" | "subjective";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  optionA?: string;
  optionB?: string;
  options?: string[];
}

/* ─── Config ─────────────────────────────────────── */

const TYPE_CONFIG = {
  balance: {
    icon: Scale,
    label: "밸런스",
    color: "text-amber-400",
  },
  multiple: {
    icon: ListChecks,
    label: "객관식",
    color: "text-teal-400",
  },
  subjective: {
    icon: PenLine,
    label: "주관식",
    color: "text-stone-400",
  },
} as const;

const MAX_QUESTIONS = 20;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── Question Card ─────────────────────────────── */

interface QuestionCardProps {
  question: Question;
  index: number;
  onChange: (id: string, updates: Partial<Question>) => void;
  onRemove: (id: string) => void;
}

function QuestionCard({ question, index, onChange, onRemove }: QuestionCardProps) {
  const { icon: Icon, label, color } = TYPE_CONFIG[question.type];
  const dragControls = useDragControls();

  const addOption = () => {
    if ((question.options?.length ?? 0) < 5) {
      onChange(question.id, { options: [...(question.options ?? []), ""] });
    }
  };

  const updateOption = (i: number, value: string) => {
    onChange(question.id, {
      options: question.options?.map((o, idx) => (idx === i ? value : o)),
    });
  };

  const removeOption = (i: number) => {
    if ((question.options?.length ?? 0) > 2) {
      onChange(question.id, {
        options: question.options?.filter((_, idx) => idx !== i),
      });
    }
  };

  return (
    <Reorder.Item
      value={question}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-amber-100 bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200">
        {/* Drag handle */}
        <button
          onPointerDown={(e) => dragControls.start(e)}
          className="touch-none cursor-grab active:cursor-grabbing p-0.5 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="드래그하여 순서 변경"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-mono text-stone-500 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className={cn("flex items-center gap-1 flex-1", color)}>
          <Icon className="w-3 h-3 flex-shrink-0" />
          <span className="text-[10px] uppercase tracking-widest font-medium">
            {label}
          </span>
        </div>

        <button
          onClick={() => onRemove(question.id)}
          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
          aria-label="질문 삭제"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Question title */}
      <div className="px-4 pt-3.5 pb-3">
        <input
          type="text"
          data-question-input
          value={question.title}
          onChange={(e) => onChange(question.id, { title: e.target.value })}
          placeholder="질문을 입력하세요"
          maxLength={80}
          className="w-full bg-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 outline-none leading-relaxed"
        />
      </div>

      {/* Balance game */}
      {question.type === "balance" && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          <input
            type="text"
            value={question.optionA ?? ""}
            onChange={(e) => onChange(question.id, { optionA: e.target.value })}
            placeholder="옵션 1"
            maxLength={30}
            className="py-2.5 px-3 rounded-xl border border-amber-100 bg-amber-50 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-300 transition-colors"
          />
          <input
            type="text"
            value={question.optionB ?? ""}
            onChange={(e) => onChange(question.id, { optionB: e.target.value })}
            placeholder="옵션 2"
            maxLength={30}
            className="py-2.5 px-3 rounded-xl border border-amber-100 bg-amber-50 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-300 transition-colors"
          />
        </div>
      )}

      {/* Multiple choice */}
      {question.type === "multiple" && (
        <div className="px-4 pb-4 space-y-1.5">
          {question.options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300 flex-shrink-0" />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`선택지 ${i + 1}`}
                maxLength={30}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-300 transition-colors"
              />
              {(question.options?.length ?? 0) > 2 && (
                <button
                  onClick={() => removeOption(i)}
                  className="text-stone-400 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {(question.options?.length ?? 0) < 5 && (
            <button
              onClick={addOption}
              className="text-[11px] text-stone-500 hover:text-stone-700 transition-colors pl-3.5 py-1"
            >
              + 선택지 추가
            </button>
          )}
        </div>
      )}

      {/* Subjective */}
      {question.type === "subjective" && (
        <div className="px-4 pb-3">
          <p className="text-xs text-stone-500">자유롭게 텍스트로 답변</p>
        </div>
      )}
    </Reorder.Item>
  );
}

/* ─── Page ───────────────────────────────────────── */

export default function CreateRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [questions.length]);

  const addQuestion = (type: QuestionType) => {
    const q: Question = {
      id: generateId(),
      type,
      title: "",
      ...(type === "balance" ? { optionA: "", optionB: "" } : {}),
      ...(type === "multiple" ? { options: ["", ""] } : {}),
    };
    setQuestions((prev) => [...prev, q]);
    // Focus on the new question's title input after it renders
    setTimeout(() => {
      const lastInput = document.querySelector(
        "[data-question-input]:last-of-type"
      ) as HTMLInputElement;
      lastInput?.focus();
    }, 0);
  };

  const addFromPopular = (pq: PopularQuestion) => {
    if (atMax) return;
    const q: Question = {
      id: generateId(),
      type: pq.type,
      title: pq.title,
      ...(pq.type === "balance" ? { optionA: pq.optionA ?? "", optionB: pq.optionB ?? "" } : {}),
      ...(pq.type === "multiple" ? { options: pq.options ?? ["", ""] } : {}),
    };
    setQuestions((prev) => [...prev, q]);
    setShowSheet(false);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const isValid =
    title.trim().length > 0 &&
    questions.length > 0 &&
    questions.every((q) => {
      if (!q.title.trim()) return false;
      if (q.type === "balance") return q.optionA?.trim() && q.optionB?.trim();
      if (q.type === "multiple")
        return q.options?.every((o) => o.trim()) && (q.options?.length ?? 0) >= 2;
      return true;
    });

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), questions }),
      });
      if (!res.ok) throw new Error();
      const room = await res.json();
      router.push(`/room/${room.id}`);
    } catch {
      setLoading(false);
    }
  };

  const atMax = questions.length >= MAX_QUESTIONS;

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 tracking-tight">
            <AntlerLogo className="w-3 h-[15px] text-amber-400" />
            Deerlink
          </span>
        </Link>

        {/* Desktop submit */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={cn(
            "hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            isValid && !loading
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 hover:-translate-y-0.5"
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              링크 만들기
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 pt-24 pb-40 md:pb-20">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-stone-600 mb-1">질문 만들고 링크 공유하면 끝</p>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={50}
            className="w-full text-2xl font-bold bg-transparent text-stone-900 placeholder:text-stone-400 outline-none border-b border-amber-100 focus:border-amber-300 pb-3 transition-colors"
          />
        </div>

        {/* Question list */}
        <div className="space-y-3">
          <AnimatePresence>
            <Reorder.Group
              axis="y"
              values={questions}
              onReorder={setQuestions}
              className="space-y-3"
            >
              {questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  onChange={updateQuestion}
                  onRemove={removeQuestion}
                />
              ))}
            </Reorder.Group>
          </AnimatePresence>

          {/* Add question buttons — only show after title is entered */}
          <AnimatePresence>
            {!atMax && title.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 gap-2"
              >
                {(["balance", "multiple", "subjective"] as QuestionType[]).map((type) => {
                  const { icon: Icon, label } = TYPE_CONFIG[type];
                  return (
                    <motion.button
                      key={type}
                      onClick={() => addQuestion(type)}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-600 text-xs transition-all duration-150"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popular questions button */}
          <AnimatePresence>
            {!atMax && title.trim().length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSheet(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-stone-500 hover:text-amber-600 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                인기 질문에서 가져오기
              </motion.button>
            )}
          </AnimatePresence>

          {title.trim().length > 0 && questions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AntlerLogo className="w-10 h-12 text-stone-300" />
              </motion.div>
              <p className="text-center text-xs text-stone-400">
                질문 하나면 충분해요
              </p>
            </motion.div>
          )}


          <div ref={bottomRef} />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 inset-x-0 md:hidden z-40">
        <div className="bg-gradient-to-t from-[#fafaf8] via-[#fafaf8]/95 to-transparent pt-8 pb-8 px-4">
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={cn(
              "w-full py-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              isValid && !loading
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                : "bg-stone-100 text-stone-400"
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                링크 만들기
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {questions.length > 0 && !isValid && (
            <p className="text-center text-[11px] text-stone-500 mt-2">
              선택지까지 입력해주세요
            </p>
          )}
        </div>

        </div>

      <PopularQuestionsSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        onSelect={addFromPopular}
      />
    </div>
  );
}
