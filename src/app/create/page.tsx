import { CreatePageClient } from "@/components/create/create-page-client";

export default async function CreateRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string; pack?: string }>;
}) {
  const { question, pack } = await searchParams;
  return (
    <CreatePageClient
      initialQuestionId={typeof question === "string" ? question : null}
      initialPackId={typeof pack === "string" ? pack : null}
    />
  );
}
