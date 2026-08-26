"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, UsersRound } from "lucide-react";
import { calcAno1, calc3anos, estimatedHoursPerWeek, fmt, fmtE, HOURS_GREEN_MAX, HOURS_YELLOW_MAX, INCOME_DEFAULT, INCOME_MAX, INCOME_MIN, INCOME_STEP } from "@/lib/recruitment-sim";

export function IncomeSimulator() {
  const [income, setIncome] = useState(INCOME_DEFAULT);
  const result = useMemo(() => calcAno1(income), [income]);
  const projection = useMemo(() => calc3anos(income), [income]);
  const hours = estimatedHoursPerWeek(result);
  const hoursLevel = hours <= HOURS_GREEN_MAX ? "green" : hours <= HOURS_YELLOW_MAX ? "yellow" : "red";
  const hoursColor = hoursLevel === "green" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : hoursLevel === "yellow" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";
  const hoursNote = hoursLevel === "green" ? "Ritmo sustentável a longo prazo." : hoursLevel === "yellow" ? "Ritmo exigente, mas ainda gerível com boa organização." : "Este objetivo exige dedicação intensa. É exequível, mas requer foco total e boa gestão do tempo.";

  return (
    <section id="simulador" className="bg-[var(--r-bg)] py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Testemunho + simulador</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl lg:text-5xl">Vê o que é possível — e simula o teu próprio rendimento.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--r-muted-fg)]">Ouve quem já está no terreno e usa a calculadora baseada em dados reais da FigueiraHome para perceberes o esforço que precisas para chegar ao teu objetivo.</p>
        </div>

        <blockquote className="mx-auto mt-10 max-w-2xl rounded-2xl bg-[var(--r-primary)] p-8 text-center text-[var(--r-primary-fg)] shadow-[var(--r-shadow-elegant)]">
          <p className="text-lg italic leading-relaxed">&ldquo;Comecei sem experiência. Hoje tenho método, ferramentas e uma equipa que me empurra para crescer.&rdquo;</p>
          <cite className="mt-4 block text-sm font-bold not-italic text-[var(--r-accent)]">— Consultor(a) FigueiraHome</cite>
        </blockquote>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl bg-[var(--r-card)] p-8 shadow-[var(--r-shadow-elegant)] sm:p-10">
          <p className="text-center text-sm font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">Rendimento líquido desejado</p>
          <p className="mt-2 text-center text-3xl font-extrabold text-[var(--r-primary)]">{fmtE(income)}<span className="text-base font-semibold text-[var(--r-muted-fg)]">/ano</span></p>
          <p className="text-center text-sm text-[var(--r-muted-fg)]">≈ {fmtE(income / 12)}/mês</p>
          <input type="range" min={INCOME_MIN} max={INCOME_MAX} step={INCOME_STEP} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="mt-5 w-full" aria-label="Rendimento líquido desejado por ano" />
          <div className="flex justify-between text-xs font-semibold text-[var(--r-muted-fg)]"><span>{fmtE(INCOME_MIN)}</span><span>{fmtE(INCOME_MAX)}</span></div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">Angariação — vendedores</p>
              <div className="mt-3 grid gap-3">
                <Stat label="Cold calls / dia" value={fmt(result.contacts_day, 0)} highlight />
                <Stat label="CMI (angariações) / mês" value={fmt(result.cmi_wins_mo, 1)} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">Venda — compradores</p>
              <div className="mt-3 grid gap-3">
                <Stat label="Leads / mês" value={fmt(result.leads_mo, 0)} />
                <Stat label="Visitas / mês" value={fmt(result.visitas_mo, 0)} />
                <Stat label="Propostas / mês" value={fmt(result.propostas_mo, 1)} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Stat label="Negócios / ano" value={fmt(result.deals_yr, 0)} />
            <Stat label="Rendimento líq. / ano" value={fmtE(result.net_yr)} />
          </div>

          <div className={`mt-6 rounded-xl border p-4 text-sm ${hoursColor}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div><strong>Atenção ao ritmo:</strong> ~{hours}h/semana. {hoursNote}</div>
            </div>
            {hoursLevel === "red" && (
              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-white/70 p-3">
                <UsersRound size={17} className="mt-0.5 shrink-0" />
                <p><strong>Considera constituir uma equipa.</strong> Dividir o trabalho de prospeção e acompanhamento entre consultores é a forma mais eficaz de escalar o rendimento sem sacrificar a qualidade de vida.</p>
              </div>
            )}
          </div>

          <div className="mt-10 overflow-x-auto">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">Projeção 3 anos · mesmo esforço</p>
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-[var(--r-border)] text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]"><th className="py-2">Ano</th><th className="py-2">Líquido</th><th className="py-2">×</th></tr></thead>
              <tbody>
                {projection.map((row) => (
                  <tr key={row.ano} className="border-b border-[var(--r-border)]">
                    <td className="py-2.5 font-bold text-[var(--r-primary)]">{row.ano}</td>
                    <td className="py-2.5 font-semibold">{fmtE(row.net_yr)}</td>
                    <td className="py-2.5 font-semibold text-[var(--r-accent-fg)]">×{fmt(row.mult, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-[var(--r-muted-fg)]">Valores estimados com base em rácios internos FigueiraHome · 2025. Não constituem garantia de resultados.</p>
          </div>

          <div className="mt-8 text-center">
            <a href="#formulario" className="inline-flex items-center gap-2 rounded-full bg-[var(--r-gradient-gold)] px-7 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Quero esta oportunidade <ArrowRight size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-[var(--r-accent)] bg-[var(--r-accent)]/10" : "border-[var(--r-border)] bg-[var(--r-secondary)]"}`}>
      <p className="text-xs font-semibold text-[var(--r-muted-fg)]">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-[var(--r-primary)]">{value}</p>
    </div>
  );
}
