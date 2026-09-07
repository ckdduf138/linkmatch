"use client";

import { useState } from "react";
import { ArrowRight, Clock3, Globe, ListChecks, Lock, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatEstimatedDuration, formatRemaining } from "@/lib/format";
import { PUBLIC_ROOM_EXTENSION_LABEL } from "@/lib/room-lifetime";
import type { LobbyRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

const NICKNAME_MAX = 20;

export function Lobby({
  room,
  initialNickname,
  onStart,
}: {
  room: LobbyRoom;
  initialNickname: string;
  onStart: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const reduceMotion = useReducedMotion();
  const trimmed = nickname.trim();
  const isDuplicate = !room.isPublic && room.participants.some((p) => p.nickname === trimmed);
  const canStart = room.isPublic || (trimmed.length > 0 && !isDuplicate);

  const handleStart = () => {
    if (canStart) onStart(room.isPublic ? "" : trimmed);
  };

  return (
    <main className="mx-auto max-w-md px-4 pb-12 pt-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold tracking-tight text-stone-700">Deerlink</span>
            <span
              className={cn(
                "inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
                room.isPublic ? "bg-amber-50 text-amber-900" : "bg-stone-100 text-stone-700"
              )}
            >
              {room.isPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {room.isPublic ? "공개방" : "비공개방"}
            </span>
          </div>

          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-stone-900">
            {room.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              질문 {room.questions.length}개
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              {formatEstimatedDuration(room.questions.length)}
            </span>
            <span>{formatRemaining(room.expiresAt)}</span>
          </div>
        </div>

        <div className="mb-8 border-y border-amber-100 py-5">
          <p className="text-base font-semibold text-stone-900">
            {room.isPublic ? "답변을 마치면 전체 집계로 이어져요." : "모든 질문에 답하면 결과가 열려요."}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {room.isPublic
              ? "닉네임 없이 참여하며, 결과에는 개인 신원이 표시되지 않아요."
              : "내 답을 끝내기 전에는 다른 사람의 선택을 볼 수 없어요."}
          </p>
          {room.isPublic && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              지금 답하면 이 방이 {PUBLIC_ROOM_EXTENSION_LABEL} 더 열려요
            </p>
          )}
        </div>

        {room.participants.length > 0 && (
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-1.5 text-sm text-stone-600">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>{room.participants.length}명이 먼저 참여했어요.</span>
            </div>
            {!room.isPublic && (
              <div className="flex flex-wrap gap-1.5" aria-label="참여자">
                {room.participants.map((participant) => (
                  <span
                    key={participant.id}
                    className="max-w-full truncate rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs text-amber-900"
                  >
                    {participant.nickname}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {!room.isPublic && (
          <div className="mb-5">
            <label htmlFor="nickname" className="mb-2 block text-sm font-semibold text-stone-900">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleStart();
              }}
              maxLength={NICKNAME_MAX}
              autoComplete="nickname"
              placeholder="친구들이 알아볼 이름"
              aria-invalid={isDuplicate}
              aria-describedby={isDuplicate ? "nickname-error" : "nickname-count"}
              className={cn(
                "min-h-12 w-full rounded-xl border bg-white px-4 text-stone-900 placeholder:text-stone-500 transition-colors",
                isDuplicate ? "border-red-400" : "border-amber-100 focus:border-amber-400"
              )}
            />
            <div className="mt-2 flex items-start justify-between gap-3">
              {isDuplicate ? (
                <p id="nickname-error" className="text-xs leading-relaxed text-red-700" role="alert">
                  이미 사용 중인 닉네임이에요. 다른 이름을 입력해 주세요.
                </p>
              ) : (
                <span />
              )}
              <span id="nickname-count" className="flex-shrink-0 font-mono text-xs tabular-nums text-stone-500">
                {nickname.length}/{NICKNAME_MAX}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className={cn(
            "flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors",
            canStart
              ? "bg-amber-600 text-white shadow-lg shadow-amber-900/25 hover:bg-amber-500"
              : "cursor-not-allowed bg-stone-200 text-stone-500"
          )}
        >
          {room.isPublic ? "바로 답하기" : "참여하기"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </motion.div>
    </main>
  );
}
