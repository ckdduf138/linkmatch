"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QUESTION_META } from "@/lib/question-meta";
import { parseOptions, type LobbyRoom } from "@/lib/types";
import { DeerHoofMark } from "@/components/DeerHoofMark";

const SUBJECTIVE_MAX = 500;

/**
 * 고르면 잠깐 뒤 다음 질문으로 넘어간다.
 *
 * 예전엔 문항마다 "선택 -> 다음" 두 번을 눌러야 해서 20문항이면 40번이었다.
 * 선택이 화면에 반영되는 걸 보고 넘어가야 하니 즉시가 아니라 짧은 지연을 둔다.
 */
const AUTO_ADVANCE_MS = 380;

export interface SubmitResult {
  ok: boolean;
  message?: string;
}

export function AnswerMode({
  room,
  nickname,
  initialAnswers,
  initialQuestion,
  onAnswersChange,
  onComplete,
}: {
  room: LobbyRoom;
  nickname: string;
  initialAnswers: Record<string, string>;
  initialQuestion: number;
  onAnswersChange: (answers: Record<string, string>, currentQuestion: number) => void;
  onComplete: (answers: Record<string, string>) => Promise<SubmitResult>;
}) {
  const [currentQ, setCurrentQ] = useState(() =>
    Math.min(Math.max(initialQuestion, 0), Math.max(room.questions.length - 1, 0))
  );
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const cancelAdvance = useCallback(() => {
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  useEffect(() => cancelAdvance, [cancelAdvance]);

  useEffect(() => {
    onAnswersChange(answers, currentQ);
  }, [answers, currentQ, onAnswersChange]);

  useEffect(() => {
    const current = progressRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [currentQ, reduceMotion]);

  const question = room.questions[currentQ];
  const parsedOptions = parseOptions(question?.options ?? null);
  const currentAnswer = answers[question?.id ?? ""];
  const answered = !!currentAnswer?.trim();
  const allAnswered = room.questions.every((q) => !!answers[q.id]?.trim());
  const progress = ((currentQ + 1) / room.questions.length) * 100;
  const meta = QUESTION_META[question?.type ?? "balance"];
  const IconComponent = meta.icon;

  const selectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (error) setError(null);
  };

  const isLastQuestion = currentQ >= room.questions.length - 1;

  /**
   * 객관식·밸런스처럼 한 번 누르면 끝나는 유형만 자동으로 넘어간다.
   * 마지막 문항에서는 넘어갈 곳이 없고(제출 버튼이 있다), 모션을 줄여달라고 한
   * 사용자에게는 예고 없는 화면 전환을 만들지 않는다.
   */
  const selectAndAdvance = (value: string) => {
    selectAnswer(value);
    cancelAdvance();
    if (reduceMotion || isLastQuestion) return;

    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      setDirection(1);
      setCurrentQ((current) => Math.min(current + 1, room.questions.length - 1));
    }, AUTO_ADVANCE_MS);
  };

  const goTo = (index: number) => {
    // 자동 진행 대기 중에 직접 이동하면 예약된 이동은 버린다.
    cancelAdvance();
    setDirection(index > currentQ ? 1 : -1);
    setCurrentQ(index);
  };

  const handleSubmit = async () => {
    cancelAdvance();
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await onComplete(answers);
    // 실패해도 입력은 그대로 두고 다시 시도할 수 있어야 한다
    if (!result.ok) {
      setSubmitting(false);
      setError(result.message ?? "제출에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-600 font-mono tabular-nums">
            {currentQ + 1} / {room.questions.length}
          </span>
          {nickname && <span className="text-xs text-stone-600">{nickname}</span>}
        </div>
        <div
          className="h-0.5 bg-stone-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentQ + 1}
          aria-valuemin={1}
          aria-valuemax={room.questions.length}
        >
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div
          ref={progressRef}
          className="-mx-4 mt-1 flex snap-x items-center overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="navigation"
          aria-label="질문 이동"
        >
          {room.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => goTo(i)}
              className="group flex h-11 w-11 flex-shrink-0 snap-center items-center justify-center"
              aria-label={`질문 ${i + 1}${answers[q.id] ? " (답변함)" : " (아직 답변 안 함)"}`}
              aria-current={i === currentQ ? "step" : undefined}
            >
              <DeerHoofMark
                className={cn(
                  "transition-all duration-200",
                  i % 2 === 0 ? "-rotate-[9deg]" : "rotate-[9deg]",
                  i === currentQ
                    ? "h-4 w-3 text-amber-600"
                    : answers[q.id]
                    ? "h-3.5 w-2.5 text-amber-600 group-hover:text-amber-700"
                    : "h-3 w-2 text-stone-500 group-hover:text-stone-700"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQ}
          custom={direction}
          initial={reduceMotion ? false : { opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mb-6">
            <div className={cn("flex items-center gap-2 mb-3", meta.accent)}>
              <IconComponent className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {meta.longLabel}
              </span>
            </div>
            <h1 className="text-xl font-bold text-stone-900 leading-snug">
              {question?.title}
            </h1>
          </div>

          {question?.type === "balance" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: question.optionA ?? "", value: "A" },
                  { label: question.optionB ?? "", value: "B" },
                ].map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => selectAndAdvance(opt.value)}
                      animate={reduceMotion ? undefined : { scale: isSelected ? 1.03 : 1 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      aria-pressed={isSelected}
                      className={cn(
                        "py-7 px-4 rounded-2xl border text-center text-sm font-medium transition-colors duration-200",
                        isSelected
                          ? "border-amber-500 bg-amber-50 text-amber-900 shadow-lg shadow-amber-900/20"
                          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                      )}
                    >
                      <span
                        className={cn(
                          "mb-2 block text-xs font-mono",
                          isSelected ? "text-amber-700" : "text-stone-500"
                        )}
                      >
                        {opt.value}
                      </span>
                      <span className="leading-snug">{opt.label}</span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mx-auto mt-3 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <Check className="h-4 w-4 text-amber-700" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {question?.type === "multiple" && (
            <div className="space-y-2">
              {parsedOptions.map((opt, i) => {
                const isSelected = currentAnswer === String(i);
                return (
                  <motion.button
                    key={i}
                    onClick={() => selectAndAdvance(String(i))}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    aria-pressed={isSelected}
                    className={cn(
                      "w-full min-h-11 py-3.5 px-4 rounded-xl border text-left text-sm flex items-center gap-3 transition-colors duration-150",
                      isSelected
                        ? "border-amber-500 bg-amber-50 text-amber-900"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected ? "border-amber-600 bg-amber-600" : "border-stone-300"
                      )}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          )}

          {question?.type === "subjective" && (
            <div>
              <textarea
                value={currentAnswer ?? ""}
                onChange={(e) => selectAnswer(e.target.value)}
                placeholder="자유롭게 답변하세요"
                rows={5}
                maxLength={SUBJECTIVE_MAX}
                aria-label={question.title}
                className="w-full py-3.5 px-4 rounded-xl border border-amber-100 bg-amber-50 text-sm text-stone-900 placeholder:text-stone-500 focus:border-amber-300 transition-colors resize-none leading-relaxed"
              />
              <p className="mt-2 text-right text-xs text-stone-500 font-mono tabular-nums">
                {(currentAnswer ?? "").length}/{SUBJECTIVE_MAX}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 leading-relaxed">
            <p>{error}</p>
            <p className="text-red-600 mt-1">
              적어둔 답변은 그대로 있어요. 다시 제출을 눌러주세요.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => goTo(Math.max(currentQ - 1, 0))}
          disabled={currentQ === 0}
          className="flex items-center gap-1.5 px-4 min-h-11 rounded-xl text-sm text-stone-600 hover:text-stone-900 disabled:text-stone-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          이전
        </button>

        {currentQ < room.questions.length - 1 ? (
          <button
            onClick={() => goTo(currentQ + 1)}
            disabled={!answered}
            className={cn(
              "flex items-center gap-1.5 px-5 min-h-11 rounded-xl text-sm font-medium transition-colors duration-200",
              answered
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-stone-200 text-stone-500"
            )}
          >
            다음
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className={cn(
              "flex items-center gap-1.5 px-5 min-h-11 rounded-xl text-sm font-medium transition-colors duration-200",
              allAnswered && !submitting
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                : "bg-stone-200 text-stone-500"
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                제출 중
              </>
            ) : (
              <>
                {error ? "다시 제출" : "제출하기"}
                <Check className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {!allAnswered && currentQ === room.questions.length - 1 && (
        <p className="mt-3 text-center text-xs text-stone-500">
          아직 답하지 않은 질문이 있어요. 위 발굽을 눌러 이동할 수 있어요.
        </p>
      )}
    </div>
  );
}
