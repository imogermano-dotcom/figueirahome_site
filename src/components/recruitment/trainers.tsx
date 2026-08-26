"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

const TRAINERS = [
  { name: "Cláudio & Rafael (P&A Legal)", topic: "Legal e enquadramento no imobiliário", photo: "/formadores/rafael-parreira.jpg", photo2: "/formadores/claudio-alfaiate.jpg", initials: "PA", bio: "Rafael Parreira (Forbes 30 Under 30) é Managing Partner da P&A Legal e mentor de negócios com formação em Solicitadoria. Cláudio Alfaiate é Partner na P&A Legal e CEO da Legal Factor. Juntos ensinam o enquadramento legal essencial no imobiliário: CPCV, contratos e proteção jurídica nas transações." },
  { name: "Pinheirinho", topic: "CPCV e resultados", photo: "/formadores/pinheirinho.jpg", initials: "PI", bio: "Especialista em Comunicação e Marketing Imobiliário, fundador do Novo Imobiliário® e da Comunidade Mais Imobiliário®. Criador da Mentoria CPCV®, ajuda consultores a fechar mais negócios com segurança e resultados mensuráveis." },
  { name: "Vítor Neves", topic: "PNL na angariação", photo: "/formadores/vitor-neves.jpg", initials: "VN", bio: "Com cerca de 30 anos de experiência no setor imobiliário e mais de 20 anos como formador especializado. Coach com certificação internacional, Master Practitioner em PNL e Avaliador Imobiliário CMVM. Coordenador de um MBA em Estratégia e Mediação Imobiliária." },
  { name: "Pedro Caramez", topic: "LinkedIn e geração de clientes", photo: "/formadores/pedro-caramez.png", initials: "PC", bio: "Mais de 15 anos como trainer, consultor e mentor em estratégia LinkedIn B2B. Mais de 1.500 keynotes e 4.500 horas de formação em IA & ChatGPT. Especialista em social selling, personal branding e geração de leads qualificados para o mercado imobiliário." },
  { name: "Kelwin Fernandes", topic: "Inteligência artificial", photo: "/formadores/kelwin.png", initials: "KF", bio: "CEO da NILG.AI, empresa especializada em Inteligência Artificial para negócios. Apaixonado por encontrar formas inovadoras de aplicar ciência de dados e IA em diferentes setores — incluindo o imobiliário." },
  { name: "Carlos Tavares", topic: "Leads e oportunidades", photo: "/formadores/carlos-tavares.jpg", initials: "CT", bio: "Especialista em recuperação de vendas e gestão de leads. Criou um sistema híbrido que combina contacto humano com automação via IA para converter oportunidades perdidas em faturação real — baseado em resultados, sem custo fixo." },
  { name: "Marina Ferreira", topic: "Organização e produtividade", photo: "/formadores/marina-ferreira.jpg", initials: "MF", bio: "Life Coach com mais de 20 anos no mercado imobiliário e mais de 20 mil horas de consultoria. Certificação Internacional em Coaching pelo ICL. Ajuda consultores a estruturar o negócio, melhorar a produtividade e alcançar resultados consistentes." },
  { name: "Susana Gomes", topic: "Integridade e comissão", photo: "/formadores/susana-gomes.jpg", initials: "SG", bio: "Mentora de consultores imobiliários e criadora do Modelo Sem Limites — um sistema de crescimento baseado em estratégia, sistemas e decisão. Criadora do Summit Imobiliário Portugal e host do podcast Conversas Imobiliárias." }
] as const;

export function Trainers() {
  const [active, setActive] = useState<number | null>(null);
  const trainer = active !== null ? TRAINERS[active] : null;

  return (
    <section className="bg-[var(--r-secondary)] py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Formadores</span>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl lg:text-5xl">Aprende com quem já está no terreno</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--r-muted-fg)]">Formação com profissionais que trabalham diariamente no mercado.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {TRAINERS.map((t, index) => (
            <button key={t.name} type="button" onClick={() => setActive(index)} className="group rounded-2xl bg-[var(--r-card)] p-5 text-center shadow-[var(--r-shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--r-shadow-elegant)]">
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-[var(--r-secondary)]">
                <Image src={t.photo} alt={t.name} fill sizes="80px" className="object-cover" />
              </div>
              <p className="mt-3 text-sm font-extrabold text-[var(--r-primary)] group-hover:text-[var(--r-accent-fg)]">{t.name}</p>
              <p className="mt-1 text-xs text-[var(--r-muted-fg)]">{t.topic}</p>
            </button>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-semibold text-[var(--r-muted-fg)]">Clica em qualquer formador para saber mais</p>
      </div>

      {trainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--r-card)] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setActive(null)} aria-label="Fechar" className="absolute right-5 top-5 text-[var(--r-muted-fg)]"><X size={20} /></button>
            <div className="flex justify-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[var(--r-secondary)]"><Image src={trainer.photo} alt={trainer.name} fill sizes="80px" className="object-cover" /></div>
              {"photo2" in trainer && trainer.photo2 && <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[var(--r-secondary)]"><Image src={trainer.photo2} alt={trainer.name} fill sizes="80px" className="object-cover" /></div>}
            </div>
            <h3 className="mt-5 text-center text-xl font-extrabold text-[var(--r-primary)]">{trainer.name}</h3>
            <p className="mt-1 text-center text-sm font-bold text-[var(--r-accent-fg)]">{trainer.topic}</p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--r-muted-fg)]">{trainer.bio}</p>
          </div>
        </div>
      )}
    </section>
  );
}
