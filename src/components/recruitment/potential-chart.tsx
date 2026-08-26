"use client";

import { useMemo, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { MIN_WAGE_BY_YEAR, MONTH_LABELS, SIMULATION_BY_YEAR_MONTH } from "@/lib/recruitment-sim";

const CHART_HEIGHT = 220;
const MAX_Y = 8000;
const BAR_W = 5;
const BAR_GAP = 3;
const GROUP_W = BAR_W * 2 + BAR_GAP;

export function PotentialChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const { points, crossIdx, totalSal, totalSim } = useMemo(() => {
    const rows: Array<{ idx: number; yearIdx: number; monthIdx: number; salario: number; simulacao: number }> = [];
    let sal = 0, sim = 0, cross = -1;
    for (let y = 0; y < 5; y++) {
      for (let m = 0; m < 12; m++) {
        const salario = MIN_WAGE_BY_YEAR[y];
        const simulacao = SIMULATION_BY_YEAR_MONTH[y][m];
        sal += salario; sim += simulacao;
        const idx = y * 12 + m;
        if (cross === -1 && simulacao > salario) cross = idx;
        rows.push({ idx, yearIdx: y, monthIdx: m, salario, simulacao });
      }
    }
    return { points: rows, crossIdx: cross, totalSal: sal, totalSim: sim };
  }, []);

  const width = points.length * GROUP_W + 40;
  const scaleY = (v: number) => CHART_HEIGHT - (Math.min(v, MAX_Y) / MAX_Y) * CHART_HEIGHT;

  return (
    <section id="potencial" className="bg-[var(--r-bg)] py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]"><TrendingUp size={16} /> Potencial</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl lg:text-5xl">O salário mínimo cresce de forma previsível. O teu potencial pode crescer muito mais.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--r-muted-fg)]">Nos primeiros meses, a simulação começa a zero. Depois, com método, consistência e acompanhamento, o crescimento pode acelerar.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-4 text-center">
          <div className="rounded-xl bg-[var(--r-card)] p-5 shadow-[var(--r-shadow-card)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-muted-fg)]">Salário mínimo · 5 anos</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--r-muted-fg)]">{Math.round(totalSal).toLocaleString("pt-PT")} €</p>
          </div>
          <div className="rounded-xl bg-[var(--r-card)] p-5 shadow-[var(--r-shadow-card)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Simulação imobiliária · 5 anos</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--r-primary)]">{Math.round(totalSim).toLocaleString("pt-PT")} €</p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-x-auto rounded-2xl bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-elegant)]">
          <div className="mb-4 flex items-center gap-5 text-xs font-semibold text-[var(--r-muted-fg)]">
            <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(215 16% 75%)" }} /> Salário mínimo</span>
            <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(142 65% 45%)" }} /> Simulação imobiliária</span>
          </div>
          <div className="relative">
            <svg width={width} height={CHART_HEIGHT + 34} role="img" aria-label="Gráfico interativo comparando salário mínimo e simulação imobiliária ao longo de 5 anos" onMouseLeave={() => setHovered(null)}>
              {[0, 2000, 4000, 6000, 8000].map((tick) => (
                <g key={tick}>
                  <line x1={30} x2={width} y1={scaleY(tick)} y2={scaleY(tick)} stroke="hsl(220 20% 90%)" strokeWidth={1} />
                  <text x={0} y={scaleY(tick) + 4} fontSize={10} fill="hsl(222 15% 42%)">{(tick / 1000).toFixed(1)}k€</text>
                </g>
              ))}
              {points.map((p) => (
                <g key={p.idx} transform={`translate(${30 + p.idx * GROUP_W}, 0)`}>
                  <rect x={-1} y={0} width={GROUP_W + 1} height={CHART_HEIGHT} fill={hovered === p.idx ? "hsl(46 92% 53% / .08)" : "transparent"} onMouseEnter={() => setHovered(p.idx)} className="cursor-pointer" />
                  <rect x={0} y={scaleY(p.salario)} width={BAR_W} height={CHART_HEIGHT - scaleY(p.salario)} fill="hsl(215 16% 75%)" rx={1.5} className="pointer-events-none" />
                  <rect x={BAR_W + 1} y={scaleY(p.simulacao)} width={BAR_W} height={CHART_HEIGHT - scaleY(p.simulacao)} fill={`hsl(142 ${55 + p.yearIdx * 5}% ${Math.max(25, 70 - p.yearIdx * 10)}%)`} rx={1.5} className="pointer-events-none" />
                  {p.monthIdx === 0 && <text x={BAR_W} y={CHART_HEIGHT + 16} fontSize={10} fontWeight={700} textAnchor="middle" fill="hsl(222 60% 10%)" className="pointer-events-none">Ano {p.yearIdx + 1}</text>}
                </g>
              ))}
              {crossIdx >= 0 && (
                <g transform={`translate(${30 + crossIdx * GROUP_W}, 0)`} className="pointer-events-none">
                  <line x1={0} x2={0} y1={0} y2={CHART_HEIGHT} stroke="hsl(46 92% 53%)" strokeWidth={1.5} strokeDasharray="3 3" />
                  <text x={4} y={10} fontSize={10} fontWeight={700} fill="hsl(46 92% 40%)">↑ ultrapassa</text>
                </g>
              )}
            </svg>
            {hovered !== null && (() => {
              const p = points[hovered];
              const left = Math.min(30 + hovered * GROUP_W + 12, width - 170);
              return (
                <div className="pointer-events-none absolute z-10 w-44 rounded-lg border border-[var(--r-border)] bg-[var(--r-card)] p-3 text-xs shadow-[var(--r-shadow-elegant)]" style={{ left, top: Math.max(0, scaleY(Math.max(p.salario, p.simulacao)) - 70) }}>
                  <p className="font-extrabold text-[var(--r-primary)]">{MONTH_LABELS[p.monthIdx]} Ano {p.yearIdx + 1}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[var(--r-muted-fg)]"><span>Salário mínimo</span><span className="font-bold">{p.salario.toLocaleString("pt-PT")} €</span></div>
                  <div className="mt-1 flex items-center justify-between text-[var(--r-muted-fg)]"><span>Simulação imobiliária</span><span className="font-bold text-emerald-600">{p.simulacao.toLocaleString("pt-PT")} €</span></div>
                  <div className="mt-1.5 flex items-center justify-between border-t border-[var(--r-border)] pt-1.5 font-bold text-[var(--r-accent-fg)]"><span>Diferença</span><span>{p.simulacao - p.salario >= 0 ? "+" : ""}{(p.simulacao - p.salario).toLocaleString("pt-PT")} €</span></div>
                </div>
              );
            })()}
          </div>
          <p className="mt-4 text-xs text-[var(--r-muted-fg)]">Simulação ilustrativa. Resultados dependem do desempenho individual, consistência, mercado e acompanhamento. O salário mínimo foi projetado com crescimento hipotético de 50€/ano.</p>
        </div>

        <div className="mt-10 text-center">
          <a href="#simulador" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Quero perceber o meu potencial <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}
