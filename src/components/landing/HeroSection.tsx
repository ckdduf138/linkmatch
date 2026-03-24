"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const participants = [
  { name: "나", answer: "칼퇴", color: "violet" as const, delay: 0.6 },
  { name: "민지", answer: "야근", color: "sky" as const, delay: 0.75 },
  { name: "준혁", answer: "칼퇴", color: "violet" as const, delay: 0.9 },
  { name: "수아", answer: "칼퇴", color: "violet" as const, delay: 1.05 },
];

const colorMap = {
  violet: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  sky: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    dot: "bg-teal-400",
  },
};

function AntlerBackground() {
  const paths = [
    { d: "M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4",      delay: 0,    opacity: 0.18 },
    { d: "M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4", delay: 0.05, opacity: 0.18 },
    { d: "M7.5 14 C5 13 3.5 11 4 8",                   delay: 0.55, opacity: 0.12 },
    { d: "M16.5 14 C19 13 20.5 11 20 8",               delay: 0.60, opacity: 0.12 },
    { d: "M5.5 9 C3 7 1.5 5 2 2",                      delay: 0.85, opacity: 0.08 },
    { d: "M18.5 9 C21 7 22.5 5 22 2",                  delay: 0.90, opacity: 0.08 },
  ];

  return (
    <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 24 28"
        className="w-auto h-[85%]"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        {paths.map(({ d, delay, opacity }, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#e8a038"
            strokeWidth="0.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    </div>
  );
}

function ProductMockup() {
  const dogCount = participants.filter((p) => p.answer === "칼퇴").length;
  const catCount = participants.filter((p) => p.answer === "야근").length;
  const total = participants.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-8 bg-amber-200/30 rounded-3xl blur-2xl pointer-events-none" />

      {/* Card */}
      <div className="relative rounded-2xl border border-amber-100/80 bg-white overflow-hidden shadow-lg shadow-amber-100/60">
        {/* Window bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-200">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
          <span className="ml-auto text-[10px] text-stone-400 font-mono">
            room / MNX3
          </span>
        </div>

        {/* Question */}
        <div className="px-5 pt-5 pb-3">
          <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-2">
            Q1 · 밸런스 게임
          </div>
          <div className="text-sm font-semibold text-stone-900 leading-snug mb-4">
            월 500 야근 vs 월 300 칼퇴?
          </div>

          {/* Option buttons */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="py-3 px-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-medium text-amber-700">칼퇴</span>
              <Check className="w-3 h-3 text-amber-500" />
            </div>
            <div className="py-3 px-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center">
              <span className="text-xs font-medium text-stone-500">야근</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200 mx-5" />

        {/* Results */}
        <div className="px-5 py-4">
          <div className="text-[10px] text-stone-400 uppercase tracking-widest mb-3">
            결과 비교
          </div>

          <div className="space-y-2 mb-4">
            {participants.map((p) => {
              const c = colorMap[p.color];
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: p.delay }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", c.dot)} />
                    <span className="text-xs text-stone-400">{p.name}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] px-2 py-0.5 rounded-md border font-medium",
                      c.bg,
                      c.border,
                      c.text
                    )}
                  >
                    {p.answer}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Split bar */}
          <div className="space-y-1.5">
            <motion.div
              className="flex h-1 rounded-full overflow-hidden bg-stone-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(dogCount / total) * 100}%` }}
                transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                className="h-full bg-amber-500 rounded-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(catCount / total) * 100}%` }}
                transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                className="h-full bg-teal-500 rounded-full"
              />
            </motion.div>
            <div className="flex justify-between">
              <span className="text-[10px] text-stone-400">
                칼퇴 {dogCount}명
              </span>
              <span className="text-[10px] text-stone-400">
                야근 {catCount}명
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden bg-[#fafaf8] dot-grid">
      {/* Antler background */}
      <AntlerBackground />

      {/* Radial vignette over dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(232,160,56,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(250,250,248,0.8),transparent)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs text-stone-500 mb-8 tracking-wide uppercase"
        >
          <span className="w-4 h-px bg-stone-400" />
          그룹 생각 비교 플랫폼
          <span className="w-4 h-px bg-stone-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold text-stone-900 leading-[1.05] tracking-tight mb-6"
        >
          같이 답하고
          <br />
          <span className="text-stone-500">함께 비교해요</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-stone-500 max-w-md mx-auto mb-10 leading-relaxed"
        >
          방을 만들고 링크를 공유하면 — 모두가 같은 질문에 답하고,
          서로의 선택을 한눈에 비교합니다.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/40 hover:shadow-amber-800/50 hover:-translate-y-0.5"
          >
            방 만들기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Product mockup */}
        <ProductMockup />
      </div>
    </section>
  );
}
