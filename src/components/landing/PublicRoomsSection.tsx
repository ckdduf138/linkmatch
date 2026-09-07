"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicRoomsFeed } from "@/components/discover/public-rooms-feed";
import type { DiscoverRoom } from "@/lib/types";

export function PublicRoomsSection({
  rooms,
  total,
  hasMore,
  error,
}: {
  rooms: DiscoverRoom[];
  total: number;
  hasMore: boolean;
  error: string | null;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="public-rooms-title"
      className="border-y border-amber-100 bg-amber-50 px-6 py-20 md:py-24"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl"
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-amber-200 pb-8">
          <h2
            id="public-rooms-title"
            className="text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl"
          >
            한 번 답해보세요
          </h2>
          <Link
            href="/discover"
            className="group inline-flex min-h-11 items-center gap-2 text-base font-semibold text-amber-800 transition-colors hover:text-amber-600"
          >
            전체 보기
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="pt-8">
          <PublicRoomsFeed
            initialRooms={rooms}
            initialTotal={total}
            initialHasMore={hasMore}
            initialSort="popular"
            initialError={error}
            mode="landing"
          />
        </div>
      </motion.div>
    </section>
  );
}
