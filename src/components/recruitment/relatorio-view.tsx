"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";

type ReportJson = {
  saudacao: string;
  sumario: string;
  pontos_fortes: string[];
  areas_desenvolver: string[];
  analise_dimensoes: { dimensao: string; comentario: string }[];
  proximos_passos: string;
  nota_final: string;
};

type Report = { nome: string | null; pontuacao: number | null; nivel: string | null; report_json: ReportJson };

type State = "loading" | "not_found" | "error" | "ready";

export function RelatorioView({ token }: { token: string | null }) {
  const [state, setState] = useState<State>("loading");
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      if (!token || !hasSupabaseEnv()) { setState("not_found"); return; }
      const supabase = getSupabaseBrowserClient();
      if (!supabase) { setState("error"); return; }
      try {
        const { data, error } = await supabase.from("quiz_reports").select("nome,pontuacao,nivel,report_json").eq("token", token).maybeSingle();
        if (error) { setState("error"); return; }
        if (!data) { setState("not_found"); return; }
        setReport(data as Report);
        setState("ready");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  if (state === "loading") {
    return <div className="grid min-h-[50vh] place-items-center text-[var(--r-muted-fg)]">A carregar o teu relatório...</div>;
  }

  if (state === "not_found") {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <AlertCircle size={40} className="mx-auto text-[var(--r-accent-fg)]" />
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--r-primary)]">Relatório não encontrado</h1>
          <p className="mt-2 max-w-md text-[var(--r-muted-fg)]">Este link pode estar incompleto ou já não é válido. Refaz o questionário para gerares um novo relatório.</p>
          <Link href="/recrutamento#quiz" className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[var(--r-accent-fg)]" style={{ background: "var(--r-gradient-gold)" }}>Refazer questionário <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-center">
        <div>
          <AlertCircle size={40} className="mx-auto text-[var(--r-accent-fg)]" />
          <h1 className="mt-4 text-2xl font-extrabold text-[var(--r-primary)]">Não foi possível carregar o relatório</h1>
          <p className="mt-2 max-w-md text-[var(--r-muted-fg)]">Verifica a tua ligação e tenta novamente.</p>
        </div>
      </div>
    );
  }

  const { report_json: r, nome, pontuacao } = report!;

  return (
    <div className="container mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]"><Sparkles size={14} /> Relatório de perfil{nome ? ` de ${nome}` : ""}</span>
        <h1 className="mt-5 text-2xl font-extrabold text-[var(--r-primary)] sm:text-3xl">{r.saudacao}</h1>
        {pontuacao !== null && (
          <div className="mt-5 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-extrabold text-[var(--r-accent-fg)]">{pontuacao}</span>
            <span className="text-sm font-semibold text-[var(--r-muted-fg)]">/ 30 pontos</span>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-xl text-[var(--r-muted-fg)]">{r.sumario}</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
          <p className="flex items-center gap-2 font-extrabold text-[var(--r-primary)]"><CheckCircle2 size={18} className="text-[var(--r-accent-fg)]" /> Pontos fortes</p>
          <ul className="mt-3 grid gap-2 text-sm text-[var(--r-muted-fg)]">
            {r.pontos_fortes.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
          <p className="flex items-center gap-2 font-extrabold text-[var(--r-primary)]"><TrendingUp size={18} className="text-[var(--r-accent-fg)]" /> Áreas a desenvolver</p>
          <ul className="mt-3 grid gap-2 text-sm text-[var(--r-muted-fg)]">
            {r.areas_desenvolver.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
        <p className="font-extrabold text-[var(--r-primary)]">Análise por dimensão</p>
        <div className="mt-4 grid gap-4">
          {r.analise_dimensoes.map((item) => (
            <div key={item.dimensao} className="border-t border-[var(--r-border)] pt-4 first:border-t-0 first:pt-0">
              <p className="text-sm font-extrabold text-[var(--r-accent-fg)]">{item.dimensao}</p>
              <p className="mt-1 text-sm text-[var(--r-muted-fg)]">{item.comentario}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl p-8 text-center text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)]" style={{ background: "var(--r-gradient-gold)" }}>
        <p className="font-extrabold">Próximos passos</p>
        <p className="mx-auto mt-2 max-w-xl">{r.proximos_passos}</p>
        <p className="mx-auto mt-4 max-w-xl font-bold">{r.nota_final}</p>
        <Link href="/recrutamento#formulario" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--r-primary)] px-6 py-3 text-sm font-bold text-white">Candidatar-me <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
