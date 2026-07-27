"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { useState } from "react";

export function ContactForm({ source = "form", propertyId }: { source?: "form" | "property_detail"; propertyId?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setState("sending");
    const payload = {
      source,
      property_id: propertyId,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      request_type: String(data.get("request_type") || "contacto"),
      message: String(data.get("message") || ""),
      privacy_consent: data.get("privacy_consent") === "on"
    };
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setState(res.ok ? "success" : "error");
    if (res.ok) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-md border border-[var(--border)] bg-white p-6 shadow-sm">
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field"><span>Nome</span><input name="name" required minLength={2} /></label>
        <label className="field"><span>Email</span><input name="email" type="email" /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field"><span>Telefone</span><input name="phone" inputMode="tel" /></label>
        <label className="field">
          <span>Tipo de pedido</span>
          <select name="request_type" required>
            <option value="comprar">Comprar</option>
            <option value="vender">Vender</option>
            <option value="arrendar">Arrendar</option>
            <option value="avaliacao">Avaliação gratuita</option>
            <option value="visita">Pedido de visita</option>
          </select>
        </label>
      </div>
      <label className="field"><span>Mensagem</span><textarea name="message" rows={5} required minLength={8} /></label>
      <label className="privacy-check">
        <input name="privacy_consent" type="checkbox" required />
        <span>Li a <Link href="/politica-privacidade" target="_blank">Política de Privacidade</Link> e autorizo o tratamento dos meus dados para responder ao meu pedido.</span>
      </label>
      <button className="btn btn-primary w-fit" disabled={state === "sending"} type="submit"><Send size={18} /> Enviar pedido</button>
      {state === "success" && <p className="text-sm font-bold text-[var(--blue)]">Pedido recebido. A equipa entrará em contacto.</p>}
      {state === "error" && <p className="text-sm font-bold text-red-700">Não foi possível enviar. Tente novamente ou contacte por telefone.</p>}
    </form>
  );
}
