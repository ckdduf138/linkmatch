"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Share2,
  Loader2,
  Scale,
  ListChecks,
  PenLine,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

/* ─── Types ─────────────────────────────── */

interface Question {
  id: string;
  type: "balance" | "multiple" | "subjective";
  title: string;
  optionA: string | null;
  optionB: string | null;
  options: string | null;
  order: number;
}

interface Room {
  id: string;
  title: string;
  expiresAt: string;
  questions: Question[];
  participants: { id: string; nickname: string }[];
}

/* ─── Lobby ──────────────────────────────── */

function Lobby({
  room,
  onStart,
}: {
  room: Room;
  onStart: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState("");
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      await navigator.share({ title: room.title, url });
    } else {
      copyLink();
    }
  };

  const handleStart = () => {
    if (nickname.trim()) onStart(nickname.trim());
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-10">
      {/* Room info */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">
          Deerlink
        </div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2 leading-snug">
          {room.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-stone-600">
          <span className="flex items-center gap-1">
            <ListChecks className="w-3 h-3" />
            {room.questions.length}개 질문
          </span>
          <span className="w-px h-3 bg-stone-300" />
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {room.participants.length}명 참여 중
          </span>
        </div>
      </div>

      {/* Share card */}
      <div className="mb-6 rounded-2xl border border-amber-100 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-100">
          <span className="text-[10px] uppercase tracking-widest text-stone-500">
            초대 링크
          </span>
        </div>
        {/* QR code */}
        <div className="flex justify-center py-5 border-b border-stone-100">
          <QRCodeSVG
            value={url}
            size={128}
            fgColor="#1c1917"
            bgColor="transparent"
            imageSettings={{
              src: "/icon.svg",
              width: 24,
              height: 24,
              excavate: true,
            }}
          />
        </div>
        {/* URL */}
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-xs text-stone-500 truncate">{url}</p>
        </div>
        {/* Buttons */}
        <div className="flex">
          <button
            onClick={copyLink}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs border-r border-stone-100 transition-colors",
              copied ? "text-amber-600" : "text-stone-600 hover:text-stone-900"
            )}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                링크 복사
              </>
            )}
          </button>
          <button
            onClick={shareLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Share2 className="w-3 h-3" />
            공유하기
          </button>
        </div>
      </div>

      {/* Participants */}
      {room.participants.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">
            이미 참여한 사람
          </div>
          <div className="flex flex-wrap gap-1.5">
            {room.participants.map((p) => (
              <span
                key={p.id}
                className="px-2.5 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-stone-700"
              >
                {p.nickname}
              </span>
            ))}
          </div>
        </div>
      )}

      {room.participants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 mb-6">
          <AntlerLogo className="w-8 h-10 text-stone-300 mb-4" />
          <p className="text-center text-xs text-stone-500">
            친구들을 초대해보세요! 링크를 공유하면 모두가 함께할 수 있어요.
          </p>
        </div>
      )}

      {/* Nickname + CTA */}
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-3">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="나를 뭐라고 부를까요?"
            maxLength={20}
            autoFocus
            className="w-full py-3.5 px-4 rounded-xl border border-amber-100 bg-amber-50 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-300 transition-colors"
          />
        </div>
        <button
          onClick={handleStart}
          disabled={!nickname.trim()}
          className={cn(
            "w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
            nickname.trim()
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
              : "bg-stone-100 text-stone-400"
          )}
        >
          참여하기
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {room.participants.length > 0 && (
        <div className="text-center mt-8">
          <Link
            href={`/room/${room.id}/results`}
            className="text-xs text-stone-600 hover:text-stone-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <BarChart3 className="w-3 h-3" />
            결과 보기 ({room.participants.length}명 참여)
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─── Answer Mode ────────────────────────── */

const TYPE_LABEL = {
  balance: "밸런스 게임",
  multiple: "객관식",
  subjective: "주관식",
};

const TYPE_ICON = {
  balance: Scale,
  multiple: ListChecks,
  subjective: PenLine,
};

function AnswerMode({
  room,
  nickname,
  onComplete,
}: {
  room: Room;
  nickname: string;
  onComplete: (answers: Record<string, string>) => Promise<void>;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const question = room.questions[currentQ];
  const parsedOptions: string[] = question?.options
    ? JSON.parse(question.options)
    : [];
  const currentAnswer = answers[question?.id ?? ""];
  const answered = !!currentAnswer;
  const allAnswered = room.questions.every((q) => !!answers[q.id]);
  const progress = ((currentQ + 1) / room.questions.length) * 100;

  const selectAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const goNext = () => {
    if (currentQ < room.questions.length - 1) {
      setDirection(1);
      setCurrentQ((q) => q + 1);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    await onComplete(answers);
  };

  const IconComponent = TYPE_ICON[question?.type ?? "balance"];

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-8">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-600 font-mono tabular-nums">
            {currentQ + 1} / {room.questions.length}
          </span>
          <span className="text-xs text-stone-600">{nickname}</span>
        </div>
        <div className="h-0.5 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          {room.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => {
                setDirection(i > currentQ ? 1 : -1);
                setCurrentQ(i);
              }}
              className={cn(
                "rounded-full transition-all duration-200",
                i === currentQ
                  ? "w-4 h-1.5 bg-amber-500"
                  : answers[q.id]
                  ? "w-1.5 h-1.5 bg-amber-500/40"
                  : "w-1.5 h-1.5 bg-stone-300"
              )}
              aria-label={`질문 ${i + 1}로 이동`}
            />
          ))}
        </div>
      </div>

      {/* Question + Answer */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQ}
          custom={direction}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <IconComponent className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[10px] uppercase tracking-widest text-stone-500">
                {TYPE_LABEL[question?.type ?? "balance"]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              {question?.title}
            </h2>
          </div>

          {question?.type === "balance" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: question.optionA!, value: "A" },
                { label: question.optionB!, value: "B" },
              ].map((opt) => {
                const isSelected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectAnswer(opt.value)}
                    className={cn(
                      "py-7 px-4 rounded-2xl border text-center transition-all duration-200 text-sm font-medium",
                      isSelected
                        ? "border-amber-500/40 bg-amber-50 text-amber-900 shadow-lg shadow-amber-900/20"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                    )}
                  >
                    <span className="block text-[10px] font-mono text-stone-500 mb-2">
                      {opt.value}
                    </span>
                    <span className="leading-snug">{opt.label}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3 mx-auto w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-amber-600" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {question?.type === "multiple" && (
            <div className="space-y-2">
              {parsedOptions.map((opt, i) => {
                const isSelected = currentAnswer === String(i);
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(String(i))}
                    className={cn(
                      "w-full py-3.5 px-4 rounded-xl border text-left transition-all duration-200 text-sm flex items-center gap-3",
                      isSelected
                        ? "border-amber-500/40 bg-amber-50 text-amber-900"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected ? "border-amber-500 bg-amber-500" : "border-stone-300"
                      )}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {question?.type === "subjective" && (
            <textarea
              value={currentAnswer ?? ""}
              onChange={(e) => selectAnswer(e.target.value)}
              placeholder="자유롭게 답변하세요"
              rows={5}
              className="w-full py-3.5 px-4 rounded-xl border border-amber-100 bg-amber-50 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-300 transition-colors resize-none leading-relaxed"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={goPrev}
          disabled={currentQ === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-stone-600 hover:text-stone-900 disabled:opacity-20 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          이전
        </button>

        {currentQ < room.questions.length - 1 ? (
          <button
            onClick={goNext}
            disabled={!answered}
            className={cn(
              "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              answered
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-stone-100 text-stone-400"
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
              "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              allAnswered && !submitting
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                : "bg-stone-100 text-stone-400"
            )}
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                제출하기
                <Check className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Expired ────────────────────────────── */

function Expired() {
  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-6 px-4">
      <AntlerLogo className="w-10 h-12 text-stone-300" />
      <div className="text-center">
        <h1 className="text-xl font-bold text-stone-800 mb-2">방이 만료됐어요</h1>
        <p className="text-sm text-stone-500">24시간이 지나 더 이상 접근할 수 없어요</p>
      </div>
      <Link
        href="/create"
        className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
      >
        새 방 만들기
      </Link>
    </div>
  );
}

/* ─── Page ───────────────────────────────── */

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [mode, setMode] = useState<"lobby" | "answer">("lobby");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then(async (r) => {
        if (r.status === 410) {
          setExpired(true);
          return;
        }
        const data = await r.json();
        setRoom(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = (name: string) => {
    setNickname(name);
    setMode("answer");
  };

  const handleComplete = async (answers: Record<string, string>) => {
    try {
      await fetch(`/api/rooms/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          answers: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      });
      router.push(`/room/${id}/results`);
    } catch {
      // stay on page on error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (expired) return <Expired />;

  if (!room) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600 text-sm">방을 찾을 수 없습니다</p>
        <Link
          href="/"
          className="text-xs text-stone-600 hover:text-stone-700 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Deerlink</span>
        </Link>
        {mode === "answer" && (
          <button
            onClick={() => setMode("lobby")}
            className="text-xs text-stone-600 hover:text-stone-700 transition-colors"
          >
            돌아가기
          </button>
        )}
      </nav>

      <AnimatePresence mode="wait">
        {mode === "lobby" ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Lobby room={room} onStart={handleStart} />
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AnswerMode
              room={room}
              nickname={nickname}
              onComplete={handleComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
