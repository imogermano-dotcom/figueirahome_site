"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronLeft, Send } from "lucide-react";
import { useState } from "react";
import { recruitmentQuestions } from "@/lib/recruitment";

type State = "questions" | "details" | "sending" | "success" | "error";

export function RecruitmentForm() {
  const [state, setState] = useState<State>("questions");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(recruitmentQuestions.length).fill(-1));
  const [error, setError] = useState("");
  const question = recruitmentQuestions[current];

  function choose(answer: number) {
    const next = [...answers];
    next[current] = answer;
    setAnswers(next);
    window.setTimeout(() => current < recruitmentQuestions.length - 1 ? setCurrent(current + 1) : setState("details"), 180);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending"); setError("");
    const response = await fetch("/api/recrutamento", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: String(form.get("name") || ""), email: String(form.get("email") || ""), phone: String(form.get("phone") || ""),
      location: String(form.get("location") || ""), professional_situation: String(form.get("professional_situation") || ""),
      motivation: String(form.get("motivation") || ""), contact_preference: String(form.get("contact_preference") || ""),
      whatsapp_consent: form.get("whatsapp_consent") === "on", privacy_consent: form.get("privacy_consent") === "on", website: String(form.get("website") || ""), answers
    }) });
    if (response.ok) setState("success"); else { setState("details"); setError("N\u00e3o foi poss\u00edvel enviar a candidatura. Confirme os dados e tente novamente."); }
  }

  if (state === "success") return <section id="candidatura" className="recruitment-form-shell"><div className="recruitment-success"><CheckCircle2 size={38} /><p className="eyebrow">Candidatura recebida</p><h2 className="section-title">Obrigado por dar este passo.</h2><p>A nossa equipa vai analisar a candidatura e entrar em contacto através do canal que indicou.</p><Link href="/" className="btn btn-primary">Voltar ao início <ArrowRight size={17} /></Link></div></section>;

  if (state === "questions") return <section id="perfil" className="recruitment-form-shell"><div className="recruitment-progress"><span>Perfil profissional</span><span>{current + 1} / {recruitmentQuestions.length}</span><div><i style={{ width: `${((current + 1) / recruitmentQuestions.length) * 100}%` }} /></div></div><div className="recruitment-question"><p className="eyebrow">Primeiro, queremos conhecer a sua forma de trabalhar</p><h2>{question.question}</h2><div className="mt-8 grid gap-3">{question.options.map((option, index) => <button className="recruitment-option" type="button" key={option} onClick={() => choose(index)}>{option}<ArrowRight size={18} /></button>)}</div>{current > 0 && <button className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)]" type="button" onClick={() => setCurrent(current - 1)}><ChevronLeft size={17} /> Voltar</button>}</div></section>;

  return <section id="candidatura" className="recruitment-form-shell"><div className="recruitment-details-head"><p className="eyebrow">A sua candidatura</p><h2 className="section-title">Falta só conhecermos o seu contexto.</h2><p>Usamos esta informação apenas para avaliar a candidatura e marcar uma primeira conversa.</p></div><form onSubmit={submit} className="recruitment-details"><input className="hidden" name="website" tabIndex={-1} autoComplete="off" /><div className="grid gap-4 md:grid-cols-2"><label className="field"><span>Nome completo</span><input name="name" required minLength={2} /></label><label className="field"><span>Email</span><input name="email" type="email" required /></label><label className="field"><span>Telefone</span><input name="phone" inputMode="tel" required minLength={6} /></label><label className="field"><span>Localidade de residência</span><input name="location" required /></label><label className="field"><span>Situação profissional atual</span><input name="professional_situation" required placeholder="Ex.: empregado por conta de outrem" /></label><label className="field"><span>Preferência de contacto</span><select name="contact_preference" defaultValue="telefone"><option value="telefone">Telefone</option><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label></div><label className="field"><span>Porque procura uma mudança de carreira?</span><textarea name="motivation" rows={5} required minLength={12} /></label><label className="recruitment-check"><input name="whatsapp_consent" type="checkbox" /><span>Aceito ser contactado por WhatsApp.</span></label><label className="recruitment-check"><input name="privacy_consent" type="checkbox" required /><span>Li e aceito a <Link href="/politica-privacidade" target="_blank">Política de Privacidade</Link> para fins de recrutamento.</span></label>{error && <p className="text-sm font-bold text-red-700">{error}</p>}<div className="flex flex-wrap items-center gap-4"><button className="btn btn-primary" disabled={state === "sending"} type="submit"><Send size={17} /> {state === "sending" ? "A enviar..." : "Enviar candidatura"}</button><button className="text-sm font-bold text-[var(--blue)]" type="button" onClick={() => setState("questions")}>Rever perfil</button></div></form></section>;
}
