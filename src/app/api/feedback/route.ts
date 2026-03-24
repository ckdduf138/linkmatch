import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, contact } = body as { message: string; contact?: string };

  if (!message?.trim()) {
    return NextResponse.json({ error: "내용이 필요합니다" }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ ok: true });
  }

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "내용", value: message.trim() },
  ];
  if (contact?.trim()) {
    fields.push({ name: "연락처", value: contact.trim(), inline: true });
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "Deerlink 피드백",
          color: 0xe8a038,
          fields,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  return NextResponse.json({ ok: true });
}
