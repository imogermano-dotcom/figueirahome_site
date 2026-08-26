"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type State = "idle" | "sending" | "success" | "error";

function validEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function validPhone(v: string) { return v.replace(/[^0-9]/g, "").length >= 9; }

export function ServicosContactForm() {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("nome") || "").trim();
    const phone = String(form.get("telefone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const tipo = String(form.get("tipo") || "").trim();
    const mensagem = String(form.get("mensagem") || "").trim();
    const website = String(form.get("website") || "");

    const nextErrors = { nome: name.length < 2, telefone: !validPhone(phone), email: !validEmail(email) };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (website) { setState("success"); return; }

    let message = [tipo && `Tipo de imóvel: ${tipo}`, mensagem].filter(Boolean).join("\n\n");
    if (message.length < 8) message = "Pedido de contacto através da página de Serviços — quer saber quanto vale o seu imóvel.";

    setState("sending");
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      source: "form", name, email, phone, message, request_type: "servicos", privacy_consent: true
    }) });
    setState(response.ok ? "success" : "error");
  }

  if (state === "success") {
    return (
      <div className="form__ok is-visible" role="status" aria-live="polite">
        <CheckCircle2 size={44} style={{ color: "var(--gold)", margin: "0 auto 16px" }} />
        <h3>Pedido enviado</h3>
        <p>Obrigado pelo seu contacto. Um consultor da Figueira Home entrará em contacto consigo nas próximas 24 horas úteis.</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__row form__row--2">
        <div className={`field${errors.nome ? " has-error" : ""}`}>
          <label htmlFor="nome">Nome <span className="req">*</span></label>
          <input type="text" id="nome" name="nome" placeholder="O seu nome completo" autoComplete="name" required onChange={() => setErrors((e) => ({ ...e, nome: false }))} />
          <span className="field__err">Por favor, indique o seu nome.</span>
        </div>
        <div className={`field${errors.telefone ? " has-error" : ""}`}>
          <label htmlFor="telefone">Telefone <span className="req">*</span></label>
          <input type="tel" id="telefone" name="telefone" placeholder="+351 900 000 000" autoComplete="tel" required onChange={() => setErrors((e) => ({ ...e, telefone: false }))} />
          <span className="field__err">Indique um número de telefone válido.</span>
        </div>
      </div>

      <div className={`field${errors.email ? " has-error" : ""}`}>
        <label htmlFor="email">Email <span className="req">*</span></label>
        <input type="email" id="email" name="email" placeholder="o.seu@email.pt" autoComplete="email" required onChange={() => setErrors((e) => ({ ...e, email: false }))} />
        <span className="field__err">Indique um endereço de email válido.</span>
      </div>

      <div className="field">
        <label htmlFor="tipo">Tipo de Imóvel</label>
        <input type="text" id="tipo" name="tipo" placeholder="ex: T3 na Figueira da Foz" />
      </div>

      <div className="field">
        <label htmlFor="mensagem">Mensagem</label>
        <textarea id="mensagem" name="mensagem" placeholder="Fale-nos do seu imóvel: tipologia, localização e o prazo em que gostaria de vender." />
      </div>

      <label className="form__consent" htmlFor="rgpd">
        <input type="checkbox" id="rgpd" name="rgpd" required />
        <span>Autorizo o tratamento dos meus dados para efeitos de contacto pela Figueira Home, nos termos da <a href="/politica-privacidade" target="_blank" rel="noopener">Política de Privacidade</a>.</span>
      </label>

      <div className="form__hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn--gold btn--block" disabled={state === "sending"}>{state === "sending" ? "A enviar..." : "Quero saber mais"}</button>
      {state === "error" && (
        <p className="form__err is-visible" role="alert">Não foi possível enviar o pedido. Tente novamente ou fale connosco diretamente: <a href="tel:+351233408130">233 408 130</a> · <a href="https://wa.me/351928318953" target="_blank" rel="noopener">WhatsApp 928 318 953</a>.</p>
      )}
    </form>
  );
}
