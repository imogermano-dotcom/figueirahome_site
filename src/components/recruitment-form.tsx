"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft, Mail, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { recruitmentQuestions, scoreRecruitmentAnswers } from "@/lib/recruitment";

type QuizState = "questions" | "result";
type FormState = "idle" | "sending" | "success" | "error";

const TIME_OPTIONS = ["Manhã (9h-13h)", "Tarde (14h-18h)", "Fim de dia (após 18h)", "Qualquer horário"];

const TIERS = [
  { min: 24, max: 30, title: "Tens um perfil muito alinhado com esta oportunidade", body: "Pelas tuas respostas, demonstras várias características que costumam estar presentes em pessoas com forte potencial para construir uma carreira no imobiliário: ambição, vontade de aprender, orientação para resultados e crença no próprio crescimento.", cta: "Quero falar convosco" },
  { min: 18, max: 23, title: "Tens bom potencial para esta área", body: "As tuas respostas mostram que tens uma base interessante para considerar esta oportunidade. Com a orientação certa, faz sentido aprofundar e perceber se este é o contexto certo para ti.", cta: "Quero perceber melhor a oportunidade" },
  { min: 12, max: 17, title: "Podes ter potencial, mas este passo merece reflexão", body: "Tens alguns traços positivos, mas também existem dúvidas ou fatores que importa esclarecer melhor. Uma conversa pode ajudar-te a perceber se esta carreira faz realmente sentido para ti nesta fase.", cta: "Quero esclarecer as minhas dúvidas" },
  { min: 0, max: 11, title: "Neste momento, o teu perfil parece menos alinhado", body: "Pelas tuas respostas, talvez ainda não estejas à procura do tipo de autonomia, exigência ou compromisso que esta carreira normalmente exige. Ainda assim, se tens curiosidade genuína, uma conversa pode ajudar-te a perceber melhor a realidade da função.", cta: "Quero saber mais antes de decidir" }
];

export function RecruitmentQuiz() {
  const [quizState, setQuizState] = useState<QuizState>("questions");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(recruitmentQuestions.length).fill(-1));
  const [reportState, setReportState] = useState<FormState>("idle");
  const question = recruitmentQuestions[current];
  const progressPct = Math.round(((current + (answers[current] >= 0 ? 1 : 0)) / recruitmentQuestions.length) * 100);

  function choose(optionIndex: number) {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
    window.setTimeout(() => {
      if (current < recruitmentQuestions.length - 1) setCurrent(current + 1);
      else {
        const { score, level } = scoreRecruitmentAnswers(next);
        try { localStorage.setItem("quiz_perfil", JSON.stringify({ answers: next, score, level, ts: Date.now() })); } catch { /* localStorage indisponível — quiz continua a funcionar sem persistência */ }
        setQuizState("result");
      }
    }, 220);
  }

  function restart() {
    setAnswers(Array(recruitmentQuestions.length).fill(-1));
    setCurrent(0);
    setQuizState("questions");
    setReportState("idle");
  }

  function goToForm() {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  }

  async function sendReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!finalAnswers) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("report_name") || "").trim() || "Visitante";
    const email = String(form.get("report_email") || "").trim();
    setReportState("sending");
    const breakdown = finalAnswers.map((answerIndex, index) => {
      const q = recruitmentQuestions[index];
      const option = q.options[answerIndex];
      return { pergunta: q.text, dimensao: q.measures, resposta: option.label, pontos: option.points };
    });
    const response = await fetch("/api/quiz-report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name, email, score, level, breakdown
    }) });
    setReportState(response.ok ? "success" : "error");
  }

  const finalAnswers = answers.every((a) => a >= 0) ? answers : null;
  const { score, level } = finalAnswers ? scoreRecruitmentAnswers(finalAnswers) : { score: 0, level: "menos_alinhado" as const };
  const tier = TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[TIERS.length - 1];

  return (
    <section id="quiz" className="bg-[var(--r-bg)] py-20 lg:py-28">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Questionário de perfil</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl lg:text-5xl">Tens perfil para construir uma carreira no imobiliário?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--r-muted-fg)]">Responde a 10 perguntas rápidas e descobre o teu nível de alinhamento com esta oportunidade.</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Leva menos de 2 minutos</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-[var(--r-card)] shadow-[var(--r-shadow-elegant)]">
          {quizState === "questions" ? (
            <>
              <div className="flex items-center justify-between gap-4 px-8 pt-7 text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">
                <span>Pergunta {current + 1} de {recruitmentQuestions.length}</span>
                <span>{progressPct}%</span>
              </div>
              <div className="mx-8 mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--r-border)]"><div className="h-full rounded-full bg-[var(--r-gradient-gold)] transition-all duration-300" style={{ background: "var(--r-gradient-gold)", width: `${progressPct}%` }} /></div>
              <div className="px-8 py-9">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">{question.measures}</p>
                <h3 className="mt-3 text-xl font-extrabold leading-snug text-[var(--r-primary)] sm:text-2xl">{question.text}</h3>
                <div className="mt-7 grid gap-3">
                  {question.options.map((option, index) => (
                    <button key={option.label} type="button" onClick={() => choose(index)} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--r-border)] bg-white px-5 py-4 text-left text-sm font-semibold text-[var(--r-fg)] transition hover:border-[var(--r-accent)] hover:bg-[var(--r-accent)]/10">
                      {option.label}
                      <ArrowRight size={17} className="shrink-0 text-[var(--r-accent-fg)]" />
                    </button>
                  ))}
                </div>
                {current > 0 && <button type="button" onClick={() => setCurrent(current - 1)} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--r-primary)]"><ChevronLeft size={16} /> Anterior</button>}
              </div>
            </>
          ) : (
            <div className="px-8 py-10 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]"><Sparkles size={14} /> O teu resultado</span>
              <h3 className="mt-5 text-2xl font-extrabold text-[var(--r-primary)] sm:text-3xl">{tier.title}</h3>
              <div className="mt-6 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-extrabold text-[var(--r-accent-fg)]">{score}</span>
                <span className="text-sm font-semibold text-[var(--r-muted-fg)]">/ 30 pontos</span>
              </div>
              <div className="mx-auto mt-4 h-2 max-w-sm overflow-hidden rounded-full bg-[var(--r-border)]"><div className="h-full rounded-full" style={{ background: "var(--r-gradient-gold)", width: `${Math.round((score / 30) * 100)}%` }} /></div>
              <p className="mx-auto mt-6 max-w-xl text-[var(--r-muted-fg)]">{tier.body}</p>

              <div className="mx-auto mt-8 max-w-md rounded-xl border border-[var(--r-accent)]/40 bg-[var(--r-accent)]/10 p-6 text-left">
                {reportState === "success" ? (
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-[var(--r-primary)]"><CheckCircle2 size={18} className="text-[var(--r-accent-fg)]" /> Relatório enviado. Verifica o teu email.</p>
                    <p className="mt-2 text-xs text-[var(--r-muted-fg)]">Não encontras o email? Verifica a pasta de spam ou lixo.</p>
                  </div>
                ) : (
                  <form onSubmit={sendReport} className="grid gap-3">
                    <p className="flex items-center gap-2 text-sm font-bold text-[var(--r-primary)]"><Mail size={16} className="text-[var(--r-accent-fg)]" /> Recebe o teu relatório de perfil por email</p>
                    <p className="text-xs text-[var(--r-muted-fg)]">Enviamos um relatório personalizado com a análise das tuas respostas e os próximos passos recomendados.</p>
                    <label className="grid gap-1 text-xs font-bold text-[var(--r-primary)]">Nome<input name="report_name" placeholder="O teu nome" className="rounded-lg border border-[var(--r-border)] bg-white px-4 py-2.5 text-sm font-normal text-[var(--r-fg)]" /></label>
                    <label className="grid gap-1 text-xs font-bold text-[var(--r-primary)]">Email *<input name="report_email" type="email" required placeholder="o.teu@email.com" className="rounded-lg border border-[var(--r-border)] bg-white px-4 py-2.5 text-sm font-normal text-[var(--r-fg)]" /></label>
                    {reportState === "error" && <p className="text-xs font-bold text-red-700">Não foi possível enviar o relatório. Tenta novamente.</p>}
                    <button type="submit" disabled={reportState === "sending"} className="mt-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90 disabled:opacity-60" style={{ background: "var(--r-gradient-gold)" }}><Send size={15} /> {reportState === "sending" ? "A enviar..." : "Receber o meu relatório"}</button>
                  </form>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={goToForm} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>{tier.cta} <ArrowRight size={16} /></button>
                <button type="button" onClick={restart} className="rounded-full border border-[var(--r-border)] bg-white px-6 py-3 text-sm font-bold text-[var(--r-primary)] transition hover:border-[var(--r-accent)] hover:bg-[var(--r-accent)]">Refazer questionário</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function RecruitmentLeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending"); setError("");
    let quizAnswers = Array(recruitmentQuestions.length).fill(0);
    try {
      const saved = localStorage.getItem("quiz_perfil");
      if (saved) quizAnswers = JSON.parse(saved).answers ?? quizAnswers;
    } catch { /* localStorage indisponível ou dados corrompidos — segue com respostas por omissão */ }
    const response = await fetch("/api/recrutamento", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: String(form.get("name") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || ""),
      location: String(form.get("location") || ""), professional_situation: String(form.get("professional_situation") || ""),
      motivation: String(form.get("motivation") || ""), contact_preference: String(form.get("contact_preference") || TIME_OPTIONS[3]),
      whatsapp_consent: form.get("whatsapp_consent") === "on", privacy_consent: form.get("privacy_consent") === "on", website: String(form.get("website") || ""), answers: quizAnswers
    }) });
    if (response.ok) setState("success"); else { setState("idle"); setError("Não foi possível enviar a candidatura. Confirme os dados e tente novamente."); }
  }

  return (
    <section id="formulario" className="bg-[var(--r-secondary)] py-20 lg:py-28">
      <div className="container mx-auto max-w-2xl px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Vamos conversar</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Se procuras uma nova carreira e sentes que tens o perfil certo, vamos conversar.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--r-muted-fg)]">Se estás cansado de continuar no mesmo ponto, se queres mais autonomia, mais crescimento e uma oportunidade séria para começar no imobiliário, este pode ser o momento certo para dares o primeiro passo.</p>
          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-left text-sm font-semibold text-[var(--r-muted-fg)]">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--r-accent-fg)]" /> Conversa inicial sem compromisso</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--r-accent-fg)]" /> Resposta personalizada em 48h úteis</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[var(--r-accent-fg)]" /> Acompanhamento real desde o primeiro dia</li>
          </ul>
        </div>

        {state === "success" ? (
          <div className="mt-10 grid justify-items-center gap-4 rounded-2xl bg-[var(--r-card)] p-12 text-center shadow-[var(--r-shadow-elegant)]">
            <CheckCircle2 size={40} className="text-[var(--r-accent-fg)]" />
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Candidatura recebida</p>
            <h3 className="text-2xl font-extrabold text-[var(--r-primary)]">Obrigado por dares este passo.</h3>
            <p className="max-w-md text-[var(--r-muted-fg)]">A nossa equipa vai analisar a candidatura e entrar em contacto através do canal que indicaste.</p>
            <Link href="/" className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--r-primary)] px-6 py-3 text-sm font-bold text-[var(--r-primary-fg)]">Voltar ao início <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-4 rounded-2xl bg-[var(--r-card)] p-8 shadow-[var(--r-shadow-elegant)]">
            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Nome *<input name="name" required minLength={2} className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
              <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Telefone *<input name="phone" inputMode="tel" required minLength={6} className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
              <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Email *<input name="email" type="email" required className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
              <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Localidade *<input name="location" required className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
            </div>
            <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Situação profissional atual<input name="professional_situation" placeholder="Ex.: empregado por conta de outrem" className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
            <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Porque estás a considerar mudar de carreira?<textarea name="motivation" rows={4} required minLength={12} className="resize-none rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]" /></label>
            <label className="grid gap-1.5 text-sm font-bold text-[var(--r-primary)]">Melhor horário para falar
              <select name="contact_preference" defaultValue={TIME_OPTIONS[3]} className="rounded-lg border border-[var(--r-border)] px-4 py-2.5 font-normal text-[var(--r-fg)]">
                {TIME_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-[var(--r-muted-fg)]"><input name="whatsapp_consent" type="checkbox" className="mt-1 accent-[var(--r-accent)]" /> Autorizo o contacto por WhatsApp para agendamento da conversa inicial.</label>
            <label className="flex items-start gap-2.5 text-sm text-[var(--r-muted-fg)]"><input name="privacy_consent" type="checkbox" required className="mt-1 accent-[var(--r-accent)]" /> Autorizo o tratamento dos meus dados pessoais para fins de recrutamento, de acordo com a <Link href="/politica-privacidade" target="_blank" className="font-bold text-[var(--r-primary)] underline">Política de Privacidade</Link>. *</label>
            {error && <p className="text-sm font-bold text-red-700">{error}</p>}
            <button type="submit" disabled={state === "sending"} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90 disabled:opacity-60" style={{ background: "var(--r-gradient-gold)" }}>
              <Send size={16} /> {state === "sending" ? "A enviar..." : "Quero ser contactado"}
            </button>
            <p className="text-xs text-[var(--r-muted-fg)]">Ao submeteres este formulário, estás apenas a demonstrar interesse em perceber melhor a oportunidade. Entraremos em contacto contigo para uma conversa inicial.</p>
          </form>
        )}
      </div>
    </section>
  );
}
