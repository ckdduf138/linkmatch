"use client";

import { useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  ListChecks,
  PenLine,
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AntlerLogo } from "@/components/landing/AntlerLogo";
import { formatRemaining } from "@/lib/format";
import { objectParticle } from "@/lib/korean";
import { PUBLIC_ROOM_EXTENSION_LABEL } from "@/lib/room-lifetime";
import { parseOptions, type ResultsRoom, type Participant, type Question } from "@/lib/types";
import { BalanceRatioBar } from "@/components/ResultBar";
import { GroupReport } from "@/components/room/group-report";
import { participantUrl } from "@/lib/room-url";
import { ResultImageActions } from "@/components/results/result-image-actions";
import { FirstAnswerInsight, PrimaryInsight } from "@/components/results/primary-insight";
import { ResultsOutro } from "@/components/results/results-outro";
import { KakaoShareButton } from "@/components/share/kakao-share-button";
import { roomShareDescription } from "@/lib/room-share-text";
import { computeUnanimousAggregates, primaryResultInsight } from "@/lib/group-stats";


/* ─── Balance Result ─────────────────────── */

function BalanceResult({
  question,
  participants,
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
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

  return (
    <div>
      <BalanceRatioBar
        className="mb-6"
        a={{ label: question.optionA ?? "A", count: countA }}
        b={{ label: question.optionB ?? "B", count: countB }}
      />

      {!anonymous && answers.length > 0 && (
        <details className="group mt-4 border-t border-stone-100">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-medium text-stone-600 marker:hidden">
            참여자별 선택 보기
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-1.5 pb-1">
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
                <span className="text-sm text-stone-700">{a.nickname}</span>
                <span
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-xs font-medium",
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
        </details>
      )}

      {/* Majority note */}
      {total >= 2 && countA !== countB && (() => {
        const winner = (countA > countB ? question.optionA : question.optionB) ?? "";
        return (
          <p className="mt-3 text-xs text-stone-600">
            <span className="font-medium text-stone-700">
              {countA > countB ? countA : countB}명
            </span>
            이{" "}
            <span className="font-medium text-stone-700">
              &ldquo;{winner}&rdquo;
            </span>
            {objectParticle(winner)} 선택했어요
          </p>
        );
      })()}
      {total >= 2 && countA === countB && (
        <p className="mt-3 text-xs text-stone-600">정확히 <span className="font-medium text-stone-700">반반</span>이에요</p>
      )}
    </div>
  );
}

/* ─── Multiple Choice Result ─────────────── */

function MultipleResult({
  question,
  participants,
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
}) {
  const options = parseOptions(question.options);
  const answers = participants
    .map((p) => ({
      id: p.id,
      nickname: p.nickname,
      value: p.answers.find((a) => a.questionId === question.id)?.value,
    }))
    .filter((a) => a.value != null);
  const total = answers.length;

  const optionCounts = options.map((_, i) => answers.filter((a) => a.value === String(i)).length);
  const maxCount = Math.max(...optionCounts, 0);

  return (
    <div className="space-y-3">
      {options.map((opt, i) => {
        const count = optionCounts[i];
        const pct = total ? Math.round((count / total) * 100) : 0;
        const isTop = count > 0 && count === maxCount;

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={cn("text-sm", isTop ? "text-stone-900 font-semibold" : "text-stone-600")}>
                {opt}
              </span>
              <span className="text-xs text-stone-600 font-mono tabular-nums">
                {count}명, {pct}%
              </span>
            </div>
            <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
              <div
                className={cn("h-full rounded-full", isTop ? "bg-amber-500" : "bg-stone-300")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      {!anonymous && answers.length > 0 && (
        <details className="group border-t border-stone-100">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-medium text-stone-600 marker:hidden">
            참여자별 선택 보기
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="space-y-2 pb-1">
            {answers.map((answer) => (
              <div key={answer.id} className="flex items-start justify-between gap-4 text-sm">
                <span className="min-w-0 break-words text-stone-700">{answer.nickname}</span>
                <span className="max-w-[55%] break-words text-right font-medium text-stone-900">
                  {options[Number(answer.value)] ?? "선택 확인 불가"}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/* ─── Subjective Result ──────────────────── */

function SubjectiveResult({
  question,
  participants,
  anonymous,
}: {
  question: Question;
  participants: Participant[];
  anonymous: boolean;
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
    <details className="group border-t border-stone-100">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-xs font-medium text-stone-600 marker:hidden">
        답변 {answers.length}개 보기
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="space-y-2 pb-1">
        {answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.25 }}
            className="rounded-xl border border-amber-100 bg-amber-50 p-4"
          >
            {!anonymous && (
              <span className="mb-2 block break-words text-xs font-medium text-amber-900">
                {answer.nickname}
              </span>
            )}
            <p className="break-words text-sm leading-relaxed text-stone-700">{answer.value}</p>
          </motion.div>
        ))}
      </div>
    </details>
  );
}

/* ─── Main ───────────────────────────────── */

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

function isShareCanceled(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

const neverChanges = () => () => {};
const noUrl = () => "";

export function ResultsClient({
  room,
  archived = false,
}: {
  room: ResultsRoom;
  archived?: boolean;
}) {
  const inviteUrl = useSyncExternalStore(
    neverChanges,
    () => participantUrl(window.location.origin, room.id),
    noUrl
  );
  const shareDescription = roomShareDescription({
    expired: false,
    isPublic: room.isPublic,
    questionCount: room.questions.length,
    participantCount: room.participants.length,
  });
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const unanimousQuestionIds = new Set(
    computeUnanimousAggregates(room).map((aggregate) => aggregate.question.id)
  );
  const unanimousCount = unanimousQuestionIds.size;
  const primaryInsight = primaryResultInsight(room);

  const copyInviteLink = async () => {
    try {
      const url = participantUrl(window.location.origin, room.id);
      await navigator.clipboard.writeText(url);
      setInviteError(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setInviteError("링크를 복사하지 못했어요. 브라우저의 클립보드 권한을 확인해 주세요.");
    }
  };

  const shareInviteLink = async () => {
    const url = participantUrl(window.location.origin, room.id);
    const text = `${room.title} - Deerlink에서 같이 답해봐요`;
    setInviteError(null);
    try {
      if (navigator.share) {
        await navigator.share({ title: room.title, text, url });
      } else {
        await copyInviteLink();
      }
    } catch (error) {
      if (!isShareCanceled(error)) {
        setInviteError("공유 창을 열지 못했어요. 링크 복사를 이용해 주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-4 border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex min-h-11 min-w-11 items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Deerlink</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <AntlerLogo
              animated
              className="w-4 h-5 text-amber-500"
            />
            <div className="text-xs text-stone-600">
              결과 비교
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 leading-[1.15] tracking-tight">
            {room.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {room.participants.length}명 참여
            </span>
            <span className="w-px h-3 bg-stone-300" />
            <span className="font-mono">
              {archived ? "종료된 방" : formatRemaining(room.expiresAt)}
            </span>
            {unanimousCount > 0 && (
              <>
                <span className="w-px h-3 bg-stone-300" />
                <span className="flex items-center gap-1 text-amber-700">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">
                    같은 답 {unanimousCount}개
                  </span>
                </span>
              </>
            )}
          </div>
        </motion.div>

        {room.participants.length === 0 && !archived && (
          <section className="border-y border-amber-200 py-10 text-center" aria-labelledby="empty-results-heading">
            <Users className="mx-auto mb-5 h-9 w-9 text-amber-700" aria-hidden="true" />
            <h2 id="empty-results-heading" className="text-2xl font-bold text-stone-900">
              친구를 초대하세요
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              첫 답변이 도착하면 비교가 시작돼요.
              {room.isPublic &&
                ` 한 명 답할 때마다 이 방이 ${PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요.`}
            </p>
            <KakaoShareButton
              className="mx-auto mt-6 max-w-sm"
              roomId={room.id}
              roomTitle={room.title}
              description={shareDescription}
              roomUrl={inviteUrl}
            />
            <div className="mx-auto mt-2 grid max-w-sm grid-cols-2 gap-2">
              <button
                onClick={copyInviteLink}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white shadow-lg shadow-amber-900/25 transition-colors hover:bg-amber-500"
              >
                <Copy className="h-4 w-4" />
                링크 복사
              </button>
              <button
                onClick={shareInviteLink}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-white px-4 text-sm font-semibold text-stone-800 transition-colors hover:border-amber-300"
              >
                <Share2 className="h-4 w-4" />
                공유하기
              </button>
            </div>
            {inviteError && (
              <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-red-600" role="alert">
                {inviteError}
              </p>
            )}
          </section>
        )}

        {room.participants.length === 1 && <FirstAnswerInsight />}
        {room.participants.length >= 2 && <PrimaryInsight room={room} />}
        {!room.isPublic && room.participants.length >= 2 && (
          <GroupReport room={room} primaryKind={primaryInsight?.kind ?? null} />
        )}

        {room.participants.length > 0 && !archived && (
          <div className="mx-auto mt-10 max-w-lg">
            <ResultImageActions room={room} />
          </div>
        )}

        {room.participants.length > 0 && (
          <section className="mt-14" aria-labelledby="question-results-heading">
            <h2 id="question-results-heading" className="mb-3 text-xl font-bold tracking-tight text-stone-900">
              질문별 결과
            </h2>
            <div className="divide-y divide-amber-100 border-y border-amber-100">
              {room.questions.map((q, idx) => {
                const Icon = TYPE_ICON[q.type];
                return (
                  <motion.article
                    key={q.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: Math.min(idx, 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="py-6"
                  >
                    <h3 className="mb-5 flex items-start gap-2 text-base font-semibold leading-snug tracking-tight text-stone-900 sm:text-lg">
                      <span className="mt-0.5 font-mono text-xs tabular-nums text-stone-500">
                        {idx + 1}
                      </span>
                      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-stone-500" aria-hidden="true" />
                      <span className="sr-only">{TYPE_LABEL[q.type]}</span>
                      <span className="min-w-0 flex-1 break-words">{q.title}</span>
                      {unanimousQuestionIds.has(q.id) && (
                        <span className="flex-shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
                          만장일치
                        </span>
                      )}
                    </h3>

                    {q.type === "balance" && (
                      <BalanceResult question={q} participants={room.participants} anonymous={room.isPublic} />
                    )}
                    {q.type === "multiple" && (
                      <MultipleResult question={q} participants={room.participants} anonymous={room.isPublic} />
                    )}
                    {q.type === "subjective" && (
                      <SubjectiveResult question={q} participants={room.participants} anonymous={room.isPublic} />
                    )}
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}

        {/* 마무리 블록 — 참여자 요약·결과 공유·초대를 하나의 흐름으로 묶는다.
            예전엔 이 셋이 거의 똑같이 생긴 흰 카드로 세 번 반복돼서 리포트 템플릿처럼 보였다. */}
        {room.participants.length > 0 && !archived && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 divide-y divide-stone-100 border-y border-amber-100"
          >
            {/* 참여자 — 공개방은 익명이라 닉네임 목록이 의미가 없다. 헤더의 참여자 수로 충분하다. */}
            {!room.isPublic && (
              <details className="group px-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium text-stone-700 marker:hidden">
                  참여자 {room.participants.length}명 보기
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="flex flex-wrap gap-1.5 pb-4">
                  {room.participants.map((p) => (
                    <motion.span
                      key={p.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="px-2.5 py-1 rounded-full text-xs border border-amber-100 bg-amber-50 text-amber-900 cursor-default"
                    >
                      {p.nickname}
                    </motion.span>
                  ))}
                </div>
              </details>
            )}

            {/* 초대 + 새 방 */}
            <div className="px-1 py-5">
              <p className="mb-3 text-xs text-stone-600">
                {room.isPublic
                  ? `한 명 답할 때마다 이 방이 ${PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요. 지금 ${formatRemaining(room.expiresAt)}.`
                  : "친구를 더 초대할까요?"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={copyInviteLink}
                  className={cn(
                    "flex-1 min-h-11 flex items-center justify-center gap-1.5 rounded-xl border text-xs transition-colors",
                    copied
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-amber-100 text-stone-700 hover:text-stone-900 hover:border-amber-200"
                  )}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "복사됨" : "방 링크 복사"}
                </button>
                <button
                  onClick={shareInviteLink}
                  className="flex-1 min-h-11 flex items-center justify-center gap-1.5 rounded-xl border border-amber-100 text-xs text-stone-700 hover:text-stone-900 hover:border-amber-200 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  방 공유하기
                </button>
              </div>
              {inviteError && (
                <p className="mt-3 text-xs leading-relaxed text-red-600" role="alert">
                  {inviteError}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <ResultsOutro isPublic={room.isPublic} />
      </div>

    </div>
  );
}
