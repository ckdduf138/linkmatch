"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Scale,
  ListChecks,
  PenLine,
  Users,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

/* ─── Types ─────────────────────────────── */

interface Answer {
  id: string;
  questionId: string;
  value: string;
}

interface Participant {
  id: string;
  nickname: string;
  answers: Answer[];
}

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
  questions: Question[];
  participants: Participant[];
}

/* ─── Balance Result ─────────────────────── */

function BalanceResult({
  question,
  participants,
  index,
}: {
  question: Question;
  participants: Participant[];
  index: number;
}) {
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value != null);

  const countA = answers.filter((a) => a.value === "A").length;
  const countB = answers.filter((a) => a.value === "B").length;
  const total = countA + countB;
  const pctA = total ? Math.round((countA / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;

  const groupA = answers.filter((a) => a.value === "A");
  const groupB = answers.filter((a) => a.value === "B");

  return (
    <div>
      {/* Option labels */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="py-2.5 px-3.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
          <span className="text-[10px] text-amber-600 font-mono block mb-0.5">A</span>
          <span className="text-xs font-medium text-amber-900">{question.optionA}</span>
        </div>
        <div className="py-2.5 px-3.5 rounded-xl bg-teal-50 border border-teal-100 text-center">
          <span className="text-[10px] text-teal-600 font-mono block mb-0.5">B</span>
          <span className="text-xs font-medium text-teal-900">{question.optionB}</span>
        </div>
      </div>

      {/* Split bar */}
      {total > 0 && (
        <div className="mb-4">
          <div className="flex h-2 rounded-full overflow-hidden bg-stone-200 gap-0.5">
            {pctA > 0 && (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pctA}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.55, ease: "easeOut" }}
                className="h-full bg-amber-500 rounded-l-full"
              />
            )}
            {pctB > 0 && (
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pctB}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2, duration: 0.55, ease: "easeOut" }}
                className="h-full bg-teal-500 rounded-r-full"
              />
            )}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-stone-600 color-stone-600">
              {countA}명 · {pctA}%
            </span>
            <span className="text-[10px] text-stone-600 color-stone-600">
              {pctB}% · {countB}명
            </span>
          </div>
        </div>
      )}

      {/* Individual answers */}
      <div className="space-y-1.5">
        {answers.map((a, i) => {
          const isA = a.value === "A";
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 + 0.3, duration: 0.3 }}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold",
                    isA
                      ? "bg-amber-100 text-amber-700"
                      : "bg-teal-100 text-teal-700"
                  )}
                >
                  {a.nickname[0].toUpperCase()}
                </div>
                <span className="text-xs text-stone-700">{a.nickname}</span>
              </div>
              <span
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                  isA
                    ? "bg-amber-50 border-amber-100 text-amber-900"
                    : "bg-teal-50 border-teal-100 text-teal-900"
                )}
              >
                {isA ? question.optionA : question.optionB}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Majority note */}
      {total >= 2 && (countA !== countB) && (
        <p className="mt-3 text-[11px] text-stone-600 color-stone-600">
          {countA > countB
            ? `${countA}명이 "${question.optionA}"을 선택했어요`
            : `${countB}명이 "${question.optionB}"을 선택했어요`}
        </p>
      )}
      {total >= 2 && countA === countB && (
        <p className="mt-3 text-[11px] text-stone-600 color-stone-600">정확히 반반이에요</p>
      )}
    </div>
  );
}

/* ─── Multiple Choice Result ─────────────── */

function MultipleResult({
  question,
  participants,
  index,
}: {
  question: Question;
  participants: Participant[];
  index: number;
}) {
  const options: string[] = question.options ? JSON.parse(question.options) : [];
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value != null);
  const total = answers.length;

  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const voters = answers.filter((a) => a.value === String(i));
        const count = voters.length;
        const pct = total ? Math.round((count / total) * 100) : 0;
        const isTop =
          count > 0 &&
          count === Math.max(...options.map((_, j) => answers.filter((a) => a.value === String(j)).length));

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn("text-xs", isTop ? "text-stone-900 font-medium" : "text-stone-600")}>
                {opt}
              </span>
              <span className="text-[11px] text-stone-600 font-mono tabular-nums color-stone-600">
                {count}명 · {pct}%
              </span>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden mb-1.5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + i * 0.08 + 0.2, duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  isTop ? "bg-amber-500" : "bg-white/20"
                )}
              />
            </div>
            {voters.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {voters.map((v) => (
                  <motion.span
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-stone-700 border border-amber-100"
                  >
                    {v.nickname}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Subjective Result ──────────────────── */

function SubjectiveResult({
  question,
  participants,
}: {
  question: Question;
  participants: Participant[];
}) {
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value);

  if (answers.length === 0) {
    return <p className="text-xs text-stone-600">아직 답변이 없습니다</p>;
  }

  return (
    <div className="space-y-2">
      {answers.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          className="rounded-xl border border-amber-100 bg-amber-50 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center text-[9px] font-bold text-amber-700">
              {a.nickname![0].toUpperCase()}
            </div>
            <span className="text-[11px] text-stone-700">{a.nickname}</span>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">{a.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────── */

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

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/rooms/${id}`)
      .then(async (r) => {
        if (r.status === 410) { setExpired(true); return; }
        const data = await r.json();
        setRoom(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const copyInviteLink = async () => {
    const url = window.location.href.replace("/results", "");
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (expired) {
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
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href={`/room/${id}`}
          className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">돌아가기</span>
        </Link>

        <button
          onClick={copyInviteLink}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            copied ? "text-amber-600" : "text-stone-600 hover:text-stone-900"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              링크 복사됨
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              초대 링크 복사
            </>
          )}
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-3">
            결과 비교
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2 leading-snug">
            {room.title}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-stone-600 color-stone-600">
            <Users className="w-3 h-3" />
            {room.participants.length}명 참여
          </div>
        </motion.div>

        {/* Empty state */}
        {room.participants.length === 0 && (
          <div className="py-20 text-center">
            <div className="flex justify-center mb-6">
              <AntlerLogo className="w-10 h-12 text-stone-300" />
            </div>
            <p className="text-stone-600 text-sm">아직 참여자가 없습니다</p>
            <p className="text-stone-500 text-xs mt-1">
              링크를 공유해서 친구들을 초대하세요
            </p>
            <button
              onClick={copyInviteLink}
              className="mt-6 flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-100 bg-amber-50 text-xs text-stone-700 hover:text-stone-900 transition-colors mx-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              초대 링크 복사
            </button>
          </div>
        )}

        {/* Questions */}
        {room.participants.length > 0 && (
          <div className="space-y-4">
            {room.questions.map((q, idx) => {
              const Icon = TYPE_ICON[q.type];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="rounded-2xl border border-amber-100 bg-white overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500 tabular-nums w-5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon className="w-3 h-3 text-stone-500" />
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">
                      {TYPE_LABEL[q.type]}
                    </span>
                  </div>

                  {/* Question + result */}
                  <div className="px-5 py-5">
                    <h3 className="text-sm font-semibold text-stone-900 mb-5 leading-snug">
                      {q.title}
                    </h3>

                    {q.type === "balance" && (
                      <BalanceResult
                        question={q}
                        participants={room.participants}
                        index={idx}
                      />
                    )}
                    {q.type === "multiple" && (
                      <MultipleResult
                        question={q}
                        participants={room.participants}
                        index={idx}
                      />
                    )}
                    {q.type === "subjective" && (
                      <SubjectiveResult
                        question={q}
                        participants={room.participants}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Participant summary */}
        {room.participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 rounded-2xl border border-amber-100 bg-white px-5 py-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] uppercase tracking-widest text-stone-500">
                참여자
              </div>
              <span className="text-xs text-stone-600 font-mono tabular-nums color-stone-600">
                {room.participants.length}명
              </span>
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
