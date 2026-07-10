"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, Send, X } from "lucide-react";
import { useState } from "react";
import { Message } from "@/components/ai-elements/message";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="chat-widget fixed bottom-5 right-5 z-[70]">
      {open && (
        <section className="chat-panel mb-3 flex h-[560px] max-h-[calc(100vh-120px)] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-md border border-[var(--border)] bg-[var(--offwhite)] shadow-2xl">
          <header className="flex items-center gap-3 bg-[var(--navy)] px-4 py-3 text-white">
            <Bot size={22} />
            <div className="mr-auto">
              <div className="display-font font-extrabold">Figueira Home</div>
              <div className="text-xs text-white/70">Assistente imobiliário</div>
            </div>
            <button aria-label="Fechar chat" onClick={() => setOpen(false)}><X size={21} /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-md bg-white p-3 text-sm text-[var(--muted)] shadow-sm">
                Pergunte por imóveis publicados, avaliação gratuita ou contacto com a equipa.
              </div>
            )}
            {messages.map((message) => <Message key={message.id} message={message} />)}
            {busy && <div className="text-xs font-bold text-[var(--muted)]">A responder...</div>}
            {error && <div className="text-xs font-bold text-red-700">Não foi possível obter resposta.</div>}
          </div>
          <form
            className="flex gap-2 border-t border-[var(--border)] bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!input.trim()) return;
              sendMessage({ text: input });
              setInput("");
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded border border-[var(--border)] px-3 py-2 text-sm"
              placeholder="Escreva a sua pergunta"
              disabled={busy}
            />
            <button className="btn btn-primary min-h-0 px-3 py-2" aria-label="Enviar mensagem" disabled={busy || !input.trim()} type="submit">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
      <button className="chat-toggle btn btn-gold h-14 w-14 rounded-full p-0 shadow-xl" aria-label="Abrir chat" onClick={() => setOpen((value) => !value)}>
        <Bot size={25} />
      </button>
    </div>
  );
}
