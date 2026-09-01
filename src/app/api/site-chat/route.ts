import { NextResponse } from "next/server";
import { z } from "zod";

const BACKEND_URL = process.env.WIDGET_CHAT_BACKEND_URL || "https://figueirahome-agentos.fly.dev/api/site/chat";

const ChatSchema = z.object({
  participante: z.string().min(1).max(200),
  mensagem: z.string().min(1).max(2000)
});

export async function POST(req: Request) {
  const parsed = ChatSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const secret = process.env.WIDGET_CHAT_SECRET;
  const upstream = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Widget-Key": secret } : {})
    },
    body: JSON.stringify(parsed.data)
  }).catch(() => null);

  if (!upstream) {
    return NextResponse.json({ error: "Não consegui responder agora. Tenta novamente." }, { status: 502 });
  }

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" }
  });
}
