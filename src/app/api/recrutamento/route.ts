import { NextResponse } from "next/server";
import { z } from "zod";
import { recruitmentQuestions, scoreRecruitmentAnswers, mailerliteGroupEnvByLevel } from "@/lib/recruitment";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { upsertMailerLiteSubscriber } from "@/lib/mailerlite";

const RecruitmentSchema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email(), phone: z.string().trim().min(6).max(40),
  location: z.string().trim().min(2).max(120), professional_situation: z.string().trim().max(160),
  motivation: z.string().trim().min(12).max(2000), contact_preference: z.enum(["Manhã (9h-13h)", "Tarde (14h-18h)", "Fim de dia (após 18h)", "Qualquer horário"]),
  whatsapp_consent: z.boolean(), privacy_consent: z.literal(true),
  answers: z.array(z.number().int().min(0).max(3)).length(recruitmentQuestions.length).nullable(), website: z.string().max(0).optional()
});

async function syncMailerLite(input: z.infer<typeof RecruitmentSchema>, level: keyof typeof mailerliteGroupEnvByLevel | null) {
  return upsertMailerLiteSubscriber({
    email: input.email,
    groupId: level ? process.env[mailerliteGroupEnvByLevel[level]] : undefined,
    fields: { name: input.name, phone: input.phone, localidade: input.location, nivel_recrutamento: level ?? "sem_questionario" }
  });
}

export async function POST(request: Request) {
  const parsed = RecruitmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados de candidatura inv\u00e1lidos", details: parsed.error.flatten() }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  const scored = parsed.data.answers ? scoreRecruitmentAnswers(parsed.data.answers) : null;
  const answerDetails = parsed.data.answers?.map((answer, index) => ({ pergunta: recruitmentQuestions[index].text, resposta: recruitmentQuestions[index].options[answer].label, pontos: recruitmentQuestions[index].options[answer].points })) ?? null;
  const supabase = getSupabaseServiceClient();
  if (!supabase) { console.info("Recruitment fallback", { ...parsed.data, answers: answerDetails, ...scored }); return NextResponse.json({ ok: true, id: "local-fallback" }); }
  const now = new Date().toISOString();
  const { data: application, error: recruitmentError } = await supabase.from("recrutamento").insert({ nome: parsed.data.name, email: parsed.data.email, telemovel: parsed.data.phone, localidade: parsed.data.location, situacao_profissional: parsed.data.professional_situation, motivacao: parsed.data.motivation, preferencia_contacto: parsed.data.contact_preference, aceita_whatsapp: parsed.data.whatsapp_consent, quiz_respostas: answerDetails, pontuacao: scored?.score ?? null, nivel: scored?.level ?? null, consentimento_privacidade_em: now, mailerlite_estado: "pendente" }).select("id").single();
  if (recruitmentError) { console.error(recruitmentError); return NextResponse.json({ error: "N\u00e3o foi poss\u00edvel guardar a candidatura" }, { status: 500 }); }
  const { error: contactError } = await supabase.from("contactos").insert({ nome: parsed.data.name, email: parsed.data.email, telemovel: parsed.data.phone, tipos: ["recrutamento", "candidatura", scored?.level ?? "sem_questionario"], criado_em: now.slice(0, 10) });
  if (contactError) console.error("Contact record failed", contactError);
  const mailerLite = await syncMailerLite(parsed.data, scored?.level ?? null);
  const { error: updateError } = await supabase.from("recrutamento").update({ mailerlite_estado: mailerLite.status, mailerlite_erro: mailerLite.error, mailerlite_sincronizado_em: mailerLite.status === "sincronizado" ? now : null }).eq("id", application.id);
  if (updateError) console.error("MailerLite status update failed", updateError);
  return NextResponse.json({ ok: true, id: application.id });
}
