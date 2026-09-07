"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { CreateEditor } from "@/components/create/create-editor";
import { PackPicker } from "@/components/create/pack-picker";
import {
  CREATE_DRAFT_KEY,
  draftSnapshot,
  parseDraft,
  subscribeDrafts,
  type CreateDraft,
} from "@/lib/draft-storage";
import { packQuestions, QUESTION_PACKS, type QuestionPack } from "@/data/question-packs";
import { POPULAR_QUESTIONS } from "@/data/popular-questions";

export function CreatePageClient({
  initialQuestionId,
  initialPackId,
}: {
  initialQuestionId: string | null;
  initialPackId: string | null;
}) {
  // /popular/[topic] 의 "이 테마로 방 만들기"가 여기로 들어온다. URL로 지정된 테마는
  // 사용자가 방금 고른 것과 똑같이 취급한다 — 저장된 초안보다 우선한다.
  const [pack, setPack] = useState<QuestionPack | null>(
    () => QUESTION_PACKS.find((candidate) => candidate.id === initialPackId) ?? null
  );
  const [skipped, setSkipped] = useState(false);
  const [useInitialQuestion, setUseInitialQuestion] = useState(Boolean(initialQuestionId));
  const [, forceReset] = useState(0);
  const raw = useSyncExternalStore(
    subscribeDrafts,
    () => draftSnapshot(CREATE_DRAFT_KEY),
    () => null
  );
  const saved = useMemo(() => parseDraft<CreateDraft>(raw), [raw]);
  const hasContent = Boolean(saved?.title || saved?.questions?.length);
  const initialQuestion = useMemo(
    () => POPULAR_QUESTIONS.find((question) => question.id === initialQuestionId) ?? null,
    [initialQuestionId]
  );

  const resetToPicker = () => {
    setPack(null);
    setSkipped(false);
    setUseInitialQuestion(false);
    forceReset((n) => n + 1);
  };

  if (useInitialQuestion && initialQuestion) {
    const draft: CreateDraft = {
      title: initialQuestion.title.slice(0, 50),
      questions: [
        {
          id: initialQuestion.id,
          type: initialQuestion.type,
          title: initialQuestion.title,
          optionA: initialQuestion.optionA,
          optionB: initialQuestion.optionB,
          options: initialQuestion.options,
        },
      ],
    };
    return <CreateEditor initialDraft={draft} initialSource="question" onStartOver={resetToPicker} />;
  }

  if (!hasContent && !pack && !skipped) {
    return <PackPicker onPick={setPack} onSkip={() => setSkipped(true)} />;
  }

  if (pack) {
    const draft: CreateDraft = {
      title: pack.roomTitle,
      questions: packQuestions(pack).map((question) => ({
        id: question.id,
        type: question.type,
        title: question.title,
        optionA: question.optionA,
        optionB: question.optionB,
        options: question.options,
      })),
    };
    return <CreateEditor initialDraft={draft} initialSource="pack" onStartOver={resetToPicker} />;
  }

  return <CreateEditor initialDraft={hasContent ? saved : null} onStartOver={resetToPicker} />;
}
