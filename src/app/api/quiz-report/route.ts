import { NextResponse } from "next/server";
import { z } from "zod";
import { recruitmentLevels, recruitmentLevelLabels, mailerliteGroupEnvByLevel } from "@/lib/recruitment";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { upsertMailerLiteSubscriber } from "@/lib/mailerlite";

const QuizReportSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  score: z.number().int().min(0).max(30),
  level: z.enum(recruitmentLevels),
  breakdown: z.array(z.object({
    pergunta: z.string(),
    dimensao: z.string(),
    resposta: z.string(),
    pontos: z.number().int().min(0).max(3)
  })).length(10),
  privacy_consent: z.literal(true)
});

const AVOID_TERMS = "engajado (usar \"motivado\"), alavancar (usar \"potenciar\"), expertise (usar \"experiência\"), deletar (usar \"eliminar\"), você, gerúndio excessivo";

function buildPrompt(input: z.infer<typeof QuizReportSchema>) {
  const breakdownText = input.breakdown
    .map((item, index) => `${index + 1}. [${item.dimensao}] Pergunta: "${item.pergunta}" → Resposta: "${item.resposta}" (${item.pontos}/3 pontos)`)
    .join("\n");
  const levelTitle = recruitmentLevelLabels[input.level];

  return `És um consultor de recrutamento da Figueira Home, uma agência imobiliária em Buarcos, Figueira da Foz.

Escreve sempre em português europeu (PT-PT), nunca português do Brasil. Evita estes termos: ${AVOID_TERMS}.

Candidato: ${input.name}
Pontuação: ${input.score}/30 — ${levelTitle}

Respostas ao questionário:
${breakdownText}

Escreve um relatório de perfil personalizado, comentando as respostas concretas do candidato (não generalidades). Tom direto e próximo, tratando sempre por "tu". Sem clichés nem frases feitas. Honesto para todos os scores, nunca condescendente.

Responde APENAS com um objeto JSON, sem texto antes nem depois, sem markdown, com exatamente esta estrutura:
{
  "saudacao": "frase de abertura curta e directa, personalizada com o nome (1 frase)",
  "sumario": "síntese honesta do perfil em 2-3 frases, referenciando o score",
  "pontos_fortes": ["frase curta de 5 a 10 palavras", "..."],
  "areas_desenvolver": ["frase curta de 5 a 10 palavras", "..."],
  "analise_dimensoes": [
    { "dimensao": "nome exacto da dimensão", "comentario": "comentário à resposta dada, 1-2 frases" }
  ],
  "proximos_passos": "recomendação clara do que fazer a seguir, 2-3 frases",
  "nota_final": "frase de fecho curta, honesta e motivadora"
}
"analise_dimensoes" tem de ter exactamente 10 itens, um por dimensão, pela ordem das respostas acima.`;
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const parsed = QuizReportSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Serviço de relatório indisponível" }, { status: 503 });

  const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.RECRUITMENT_AI_MODEL || "claude-sonnet-5",
      max_tokens: 2500,
      messages: [{ role: "user", content: buildPrompt(parsed.data) }]
    })
  }).catch(() => null);

  if (!aiResponse || !aiResponse.ok) {
    console.error("Anthropic request failed", aiResponse?.status);
    return NextResponse.json({ error: "Não foi possível gerar o relatório" }, { status: 502 });
  }

  const aiBody = (await aiResponse.json()) as { content: { type: string; text?: string }[] };
  const text = aiBody.content?.find((block) => block.type === "text")?.text || "";
  const reportJson = extractJson(text);
  if (!reportJson) {
    console.error("Anthropic response was not valid JSON", text.slice(0, 500));
    return NextResponse.json({ error: "Não foi possível gerar o relatório" }, { status: 502 });
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 });

  const { data: report, error: insertError } = await supabase
    .from("quiz_reports")
    .insert({ email: parsed.data.email, nome: parsed.data.name, pontuacao: parsed.data.score, nivel: parsed.data.level, report_json: reportJson })
    .select("token")
    .single();

  if (insertError || !report) {
    console.error(insertError);
    return NextResponse.json({ error: "Não foi possível guardar o relatório" }, { status: 500 });
  }

  const reportUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://figueirahome.pt"}/recrutamento/relatorio?t=${report.token}`;

  await upsertMailerLiteSubscriber({
    email: parsed.data.email,
    groupId: process.env[mailerliteGroupEnvByLevel[parsed.data.level]],
    fields: { name: parsed.data.name, quiz_score: String(parsed.data.score), quiz_tier: parsed.data.level, report_url: reportUrl, origem: "quiz-recrutamento" }
  });

  return NextResponse.json({ ok: true, report_url: reportUrl });
}
