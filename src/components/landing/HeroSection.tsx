"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BalanceRatioBar } from "@/components/ResultBar";
import { AntlerLogo } from "@/components/landing/AntlerLogo";

/**
 * 히어로의 질문은 목업이 아니라 실제로 동작한다.
 * 그리고 이 인터랙션 하나가 Answer Lock을 설명 없이 가르친다.
 * 고르기 전에는 친구들 답이 가려져 있고, 고르는 순간 열린다.
 */

const DEMO = {
  question: "하나만 고른다면?",
  a: "월 500 야근",
  b: "월 300 칼퇴",
  friends: [
    { name: "지우", pick: "a" as const },
    { name: "서연", pick: "a" as const },
    { name: "도현", pick: "b" as const },
    { name: "민재", pick: "a" as const },
  ],
};

function Roster({ picked }: { picked: "a" | "b" | null }) {
  const rows = [...DEMO.friends, ...(picked ? [{ name: "나", pick: picked }] : [])];
  const reduce = useReducedMotion();

  return (
    <ul className="space-y-2.5">
      {rows.map((person, i) => {
        const isMe = person.name === "나";
        return (
          <motion.li
            key={person.name}
            layout
            initial={isMe && !reduce ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <span
              className={cn(
                "text-base",
                isMe ? "font-semibold text-stone-900" : "text-stone-600"
              )}
            >
              {person.name}
            </span>

            <AnimatePresence mode="wait" initial={false}>
              {picked === null ? (
                <motion.span
                  key="hidden"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex h-8 w-20 items-center justify-center rounded-full bg-stone-100"
                >
                  <Lock className="h-3.5 w-3.5 text-stone-500" />
                  <span className="sr-only">답하면 열려요</span>
                </motion.span>
              ) : (
                <motion.span
                  key="shown"
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: isMe ? 0.1 : i * 0.07 }}
                  className={cn(
                    "flex h-8 min-w-20 items-center justify-center rounded-full px-3 text-sm font-medium",
                    person.pick === "a"
                      ? "bg-amber-50 text-amber-900"
                      : "bg-teal-50 text-teal-900"
                  )}
                >
                  {person.pick === "a" ? DEMO.a : DEMO.b}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}

function FriendsAnswerDemo() {
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const reduce = useReducedMotion();

  const aCount = DEMO.friends.filter((f) => f.pick === "a").length + (picked === "a" ? 1 : 0);
  const bCount = DEMO.friends.filter((f) => f.pick === "b").length + (picked === "b" ? 1 : 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {(["a", "b"] as const).map((key) => {
          const label = key === "a" ? DEMO.a : DEMO.b;
          const active = picked === key;
          return (
            <button
              key={key}
              onClick={() => setPicked(key)}
              aria-pressed={active}
              className={cn(
                "min-h-16 rounded-2xl border-2 text-base font-semibold transition-colors duration-200",
                active
                  ? key === "a"
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-7 border-t border-stone-200 pt-6">
        <div className="mb-5 flex items-center gap-3">
          {picked && (
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="flex-shrink-0"
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
            </motion.div>
          )}
          <p className="text-base text-stone-600" aria-live="polite">
            {picked === null
              ? "친구 넷이 먼저 답했어요. 내가 고르면 열려요."
              : "이렇게 한 번에 열려요."}
          </p>
        </div>

        <Roster picked={picked} />

        <AnimatePresence>
          {picked && (
            <motion.div
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <BalanceRatioBar
                className="mt-7"
                a={{ label: DEMO.a, count: aCount }}
                b={{ label: DEMO.b, count: bCount }}
                mine={picked}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function LiveQuestion() {
  return (
    <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100/50 sm:p-8">
      <p className="text-lg font-bold leading-snug text-stone-900 sm:text-xl">
        {DEMO.question}
      </p>
      <div className="mt-6">
        <FriendsAnswerDemo />
      </div>
    </div>
  );
}

/**
 * 히어로 텍스트에는 등장 애니메이션을 걸지 않는다.
 *
 * h1이 이 페이지의 LCP 요소인데, 예전엔 framer의 initial opacity 0으로 시작해서
 * JS가 하이드레이션되고 rAF가 돌기 전까지 아무것도 안 보였다. 실제로 탭이 백그라운드
 * 상태로 로드되면 rAF가 멈춰서 제목이 opacity 0.4에 굳는 것까지 재현됐다.
 * 처음 오는 사람이 읽어야 할 문장을 JS 뒤에 숨길 이유가 없다. 모션은 데모 카드만 갖는다.
 */
export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100dvh] bg-[#fafaf8] px-6 pb-14 pt-24 md:pb-16 md:pt-28 lg:min-h-[720px]">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
        <div>
          <AntlerLogo
            animated
            className="mb-4 h-12 w-11 text-amber-500 sm:h-14 sm:w-12"
          />

          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            우리,
            <br />
            얼마나 비슷할까?
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-stone-600">
            질문을 만들고 링크를 보내면, 친구들이 답한 결과를 나란히 놓고 볼 수
            있어요.
          </p>

          <div className="mt-7">
            <Link
              href="/create"
              className="group inline-flex min-h-14 items-center gap-2 rounded-2xl bg-amber-700 px-8 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition-colors duration-200 hover:bg-amber-600"
            >
              방 만들기
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:pt-2"
        >
          <LiveQuestion />
        </motion.div>
      </div>
    </section>
  );
}
