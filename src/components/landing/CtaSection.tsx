"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AntlerLogo } from "./AntlerLogo";
import { FeedbackModal } from "@/components/FeedbackModal";

export function CtaSection() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <section className="py-28 md:py-40 px-6 bg-amber-50">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <AntlerLogo className="w-12 h-14 text-amber-500" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-5">
            지금 바로 시작하세요
          </h2>
          <p className="text-stone-600 text-base mb-10">
            회원가입 없이 무료로. 링크 하나면 됩니다.
          </p>

          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-amber-900/40 hover:shadow-amber-800/50 hover:-translate-y-0.5"
          >
            방 만들기
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="mt-24 pt-8 border-t border-amber-100">
          <div className="flex items-center justify-center gap-3">
            <p className="text-xs text-stone-500">&copy; 2026 Deerlink</p>
            <span className="text-stone-300 text-xs">·</span>
            <span className="text-xs text-stone-400">v0.1.0</span>
            <span className="text-stone-300 text-xs">·</span>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              피드백
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </section>
  );
}
