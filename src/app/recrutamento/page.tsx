import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, Briefcase, BrainCircuit, Camera, CheckCircle2, ChevronDown, Compass, Flame, GraduationCap, Handshake, Home as HomeIcon, Layers, Megaphone, Phone, PhoneCall, Plus, PlayCircle, Rocket, Search, Sparkles, Star, Target, TrendingUp, Users, UsersRound, Wrench, Zap } from "lucide-react";
import { RecruitmentLeadForm, RecruitmentQuiz } from "@/components/recruitment-form";
import { IncomeSimulator } from "@/components/recruitment/income-simulator";
import { PotentialChart } from "@/components/recruitment/potential-chart";
import { Trainers } from "@/components/recruitment/trainers";
import { ScrollProgress } from "@/components/recruitment/scroll-progress";
import { MobileCtaBar } from "@/components/recruitment/mobile-cta-bar";
import { VideoFooter } from "@/components/video-footer";

const recruitBody = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-recruit-body", display: "swap" });
const recruitDisplay = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-recruit-display", display: "swap" });

export const metadata: Metadata = { title: "Recrutamento", description: "O imobiliário pode transformar a tua vida. Recrutamento na Figueira Home: método, acompanhamento e formação, mesmo sem experiência.", alternates: { canonical: "/recrutamento" } };

const fitReasons = [
  [Briefcase, "Estás insatisfeito com o teu trabalho atual", "Trabalhas muito, mas sentes pouco reconhecimento, pouca margem de crescimento ou pouca perspetiva de evolução."],
  [Compass, "Queres mudar de carreira", "Sentes que estás pronto para começar uma nova fase, mas ainda não encontraste o contexto certo para dar esse passo."],
  [TrendingUp, "Queres ganhar mais", "Procuras uma atividade onde o teu desempenho possa ter mais impacto no teu rendimento e no teu futuro."],
  [Sparkles, "Valorizas autonomia", "Queres uma carreira com mais liberdade, mais responsabilidade e maior controlo sobre o teu dia."],
  [Flame, "Não tens experiência, mas tens ambição", "Sabes que ainda tens muito para aprender, mas tens vontade, energia e compromisso para construir algo novo."]
];

const differentiators = [
  [UsersRound, "Acompanhamento próximo", "Contacto direto, orientação e apoio real no início."],
  [BadgeCheck, "Liderança experiente", "Aprendes com quem conhece o setor e sabe formar consultores."],
  [GraduationCap, "Formação contínua", "Apoio interno e acesso a conteúdos de formação complementar."],
  [Sparkles, "Tecnologia e IA", "Ferramentas modernas para aumentar produtividade e eficácia."],
  [Rocket, "Espaço para crescer", "Procuramos pessoas com atitude para construir resultados com consistência."]
];

const trainingModules = [
  [BookOpen, "Fundamentos FigueiraHome"], [Wrench, "Ferramentas e Tecnologia"], [Megaphone, "Geração de Atenção"], [Search, "Prospeção e Canais de Aquisição"],
  [PhoneCall, "Qualificação do Vendedor"], [HomeIcon, "Reunião em Casa do Proprietário"], [Handshake, "Angariação"], [Camera, "Promoção do Imóvel"],
  [Users, "Gestão de Compradores"], [TrendingUp, "Negociação e Fecho"], [Star, "Pós-venda e Fidelização"]
] as const;
const academyTopics = ["Leads mortas: oportunidades mal trabalhadas", "Consultores desorganizados, negócios perdidos", "CPCV: método que transforma ética em resultados", "Legal no imobiliário: ética e enquadramento", "Integridade e comissão", "PNL na angariação", "Inteligência artificial no imobiliário", "Nova era do CRM", "Sustentabilidade no negócio", "Gestão de risco e resultados", "LinkedIn com IA para gerar clientes", "Comunicação profissional no imobiliário"];

const benefits = [
  ["Começar sem te sentires perdido", "Tens orientação prática para perceberes o caminho desde o início."],
  ["Ganhar confiança mais rápido", "Com acompanhamento, evitas muitos erros comuns de quem começa sozinho."],
  ["Aprender com método", "Não dependes apenas de tentativa e erro."],
  ["Usar ferramentas atuais", "Trabalhamos com tecnologia, CRM, automação e inteligência artificial."],
  ["Ter uma cultura de crescimento", "Ambição, responsabilidade e melhoria contínua fazem parte da forma como trabalhamos."],
  ["Construir uma carreira com potencial", "O teu esforço pode ter impacto direto no teu rendimento e evolução."]
];

const howWeWork = [
  [Target, "Método comercial", "Prospeção, acompanhamento, argumentação, propostas e negociação com processo claro."],
  [GraduationCap, "Formação aplicada", "Aprendizagem ligada ao trabalho real do consultor, não apenas teoria."],
  [BrainCircuit, "Tecnologia e IA", "CRM, automações, análise de dados, conteúdos e follow-up."],
  [Handshake, "Mentoria próxima", "Apoio para perceber o que fazer, quando fazer e como corrigir mais depressa."],
  [Sparkles, "Marca pessoal", "Ajuda para comunicar melhor, aparecer melhor e construir autoridade local."],
  [Zap, "Cultura de execução", "Ambição sem execução não chega. Valorizamos ação, responsabilidade e consistência."]
];

const commissionTiers = [
  ["40%", "até € 50 000", "—", "—"],
  ["50%", "€ 50 001 – € 70 000", "—", "—"],
  ["60%", "€ 70 001 – € 80 000", "€100/mês", "€100/CMI"],
  ["70%", "€ 80 001 – € 100 000", "€200/mês", "€200/CMI"],
  ["80%", "acima de € 100 000", "€300/mês", "€300/CMI"]
];

const processSteps = [
  ["01", "Preenches o formulário", "Partilhas os teus dados e o motivo pelo qual estás a considerar uma mudança."],
  ["02", "Falamos contigo", "Fazemos uma conversa inicial para perceber o teu perfil, motivação e objetivos."],
  ["03", "Apresentamos a oportunidade", "Explicamos como trabalhamos, o que valorizamos e como apoiamos quem está a começar."],
  ["04", "Decidimos o próximo passo", "Se houver alinhamento, avançamos para uma fase seguinte com mais detalhe."]
];

const commonDoubts = [
  ["“Mas eu não tenho experiência.”", "Não. Valorizamos mais perfil, atitude, vontade de aprender e capacidade de evoluir."],
  ["“E se eu não conseguir?”", "Ninguém entra sozinho nem sem preparação — tens formação estruturada, acompanhamento próximo e um método testado. O risco de tentares com essa base é muito menor do que tentares sozinho."],
  ["“Vou estar sozinho no início?”", "Não. Um dos pontos fortes da proposta é a proximidade no acompanhamento."],
  ["“E se isto não for para mim?”", "É exatamente para perceberes isso que existe uma conversa inicial, sem compromisso. Não tens de decidir uma carreira — só de dar o primeiro passo."],
  ["“Tenho de decidir já?”", "Não. O primeiro passo é só uma conversa. A decisão de avançar é sempre tua, com toda a informação que precisares."]
];

const faqs = [
  ["Preciso de experiência no imobiliário?", "Não. Valorizamos mais perfil, atitude, vontade de aprender e capacidade de evoluir."],
  ["Vou ter formação?", "Sim. A integração assenta em acompanhamento, orientação prática e formação complementar."],
  ["Esta oportunidade é para toda a gente?", "Não. É uma atividade exigente e com responsabilidade. Faz mais sentido para pessoas ambiciosas, consistentes e com gosto por trabalhar com pessoas."],
  ["Vou estar sozinho no início?", "Não. Um dos pontos fortes da proposta é a proximidade no acompanhamento."],
  ["O que valorizam num candidato?", "Ambição, compromisso, capacidade de aprender, responsabilidade, comunicação e vontade real de construir uma nova carreira."],
  ["Quero mudar de área, mas ainda tenho dúvidas. Faz sentido falar convosco?", "Sim. Muitas vezes, o primeiro passo certo é apenas uma conversa clara e sem compromisso."]
];

export default function RecruitmentPage() {
  const jobPosting = { "@context": "https://schema.org", "@type": "JobPosting", title: "Consultor(a) Imobiliário(a)", description: "Oportunidade de carreira no imobiliário com acompanhamento, formação e tecnologia.", datePosted: "2026-07-14", employmentType: "FULL_TIME", hiringOrganization: { "@type": "Organization", name: "Figueira Home" }, jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Figueira da Foz", addressCountry: "PT" } } };

  return (
    <>
      <main className={`recruitment-page ${recruitBody.variable} ${recruitDisplay.variable}`}>
        <ScrollProgress />
        <MobileCtaBar />
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-[72px] text-white" style={{ background: "var(--r-gradient-hero)" }}>
          <div className="container relative z-10 mx-auto grid gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)]/30 bg-[var(--r-accent)]/10 px-4 py-1.5 text-xs font-bold text-[var(--r-accent)]"><Sparkles size={14} /> Recrutamento · Sem experiência necessária · Figueira da Foz</span>
              <h1 className="mt-6 text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[1.02]">O imobiliário pode <span className="text-[var(--r-accent)]">mudar</span> a tua vida.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Se tens ambição, vontade de crescer e estás cansado de continuar no mesmo ponto, esta pode ser a oportunidade certa para começares — mesmo sem experiência.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#quiz" className="inline-flex items-center gap-2 rounded-full bg-[var(--r-gradient-gold)] px-6 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Quero perceber se tenho perfil <ArrowRight size={16} /></a>
                <a href="#formulario" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"><Phone size={16} /> Falar convosco</a>
              </div>
              <p className="mt-3 text-xs font-semibold text-white/60">Leva menos de 1 minuto. Sem compromisso.</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-[var(--r-accent)]" /> Vagas limitadas</span>
                <span><strong className="text-[var(--r-accent)]">+218</strong> negócios fechados</span>
                <span><strong className="text-[var(--r-accent)]">+1,8M€</strong> em comissões faturadas</span>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--r-shadow-elegant)]">
                <Image src="/hero-team-recrutamento.jpg" alt="Equipa FigueiraHome em sessão de formação sobre o mercado imobiliário" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[var(--r-primary)]/90 px-5 py-3 text-sm font-bold backdrop-blur-sm">Começa com método, não sozinho.</div>
            </div>
          </div>
          <svg className="absolute bottom-[-1px] left-0 z-10 h-14 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true"><path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="var(--r-bg)" /></svg>
        </section>

        {/* Fit section */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Esta oportunidade pode ser para ti se...</h2>
              <p className="mt-4 text-[var(--r-muted-fg)]">Nem toda a gente que entra no imobiliário vem do imobiliário. Muitas vezes, as pessoas certas chegam de outras áreas, num momento em que já perceberam que querem mais da sua vida profissional.</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fitReasons.map(([Icon, title, body]) => (
                <div key={String(title)} className="rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-7 shadow-[var(--r-shadow-card)]">
                  <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: "var(--r-gradient-gold)" }}><Icon size={22} className="text-[var(--r-accent-fg)]" /></span>
                  <p className="mt-5 font-extrabold leading-snug text-[var(--r-primary)]">{String(title)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--r-muted-fg)]">{String(body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center text-white lg:py-28" style={{ background: "var(--r-gradient-dark)" }}>
          <div className="container mx-auto max-w-3xl px-6">
            <p className="text-lg font-bold text-white/90">Se te revês neste momento de vida, esta página foi feita para ti.</p>
            <h2 className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-[1.08]">A maioria das pessoas não fica parada por falta de capacidade.<br /><span className="text-[var(--r-accent)]">Fica parada por falta de direção.</span></h2>
            <p className="mx-auto mt-6 max-w-2xl text-white/70">No imobiliário, isso nota-se ainda mais. Há quem entre e fique perdido. E há quem entra com método, acompanhamento e um plano claro para evoluir.</p>
            <p className="mx-auto mt-4 max-w-2xl font-bold text-[var(--r-accent)]">A diferença não está apenas na experiência. Está no contexto onde começas.</p>
            <a href="#quiz" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--r-gradient-gold)] px-7 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Quero começar com direção <ArrowRight size={16} /></a>
          </div>
        </section>

        {/* Differentiation */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Diferenciação</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Aqui não entras para ficar perdido. Entras para ser acompanhado.</h2>
              <p className="mt-4 text-[var(--r-muted-fg)]">Há estruturas onde entras e és apenas mais um. A nossa proposta é diferente: queremos construir uma equipa forte, moderna e preparada para crescer — e isso começa por dar atenção real às pessoas certas.</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {differentiators.map(([Icon, title, body]) => (
                <div key={String(title)} className="rounded-2xl bg-[var(--r-card)] p-6 text-center shadow-[var(--r-shadow-card)]">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--r-accent)]/15 text-[var(--r-accent-fg)]"><Icon size={22} /></span>
                  <p className="mt-4 font-extrabold text-[var(--r-primary)]">{String(title)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--r-muted-fg)]">{String(body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RecruitmentQuiz />

        {/* Academy intro */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Academia FigueiraHome</span>
                <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Não vais começar sozinho. Vais começar com formação de alto nível.</h2>
                <p className="mt-4 text-[var(--r-muted-fg)]">Para além do acompanhamento direto, vais ter acesso a uma academia com conteúdos práticos, atuais e orientados para resultados no imobiliário.</p>
                <ul className="mt-6 grid gap-3">
                  {([
                    [GraduationCap, "Formação prática aplicada ao dia a dia do consultor"],
                    [Handshake, "Conteúdos sobre angariação, negociação, CRM e IA"],
                    [TrendingUp, "Acesso a conhecimento atualizado do mercado"],
                    [Sparkles, "Complemento direto ao acompanhamento interno"]
                  ] as const).map(([Icon, item]) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-semibold text-[var(--r-fg)]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--r-accent)]/15 text-[var(--r-accent-fg)]"><Icon size={16} /></span> {item}</li>
                  ))}
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[var(--r-card)] shadow-[var(--r-shadow-elegant)]">
                <div className="flex items-center gap-3 px-6 py-5" style={{ background: "var(--r-primary)" }}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white"><GraduationCap size={18} /></span>
                  <div className="flex-1"><p className="text-sm font-extrabold text-white">Academia FigueiraHome</p><p className="text-xs text-white/60">O teu percurso</p></div>
                  <span className="rounded-full bg-[var(--r-accent)] px-3 py-1 text-xs font-bold text-[var(--r-accent-fg)]">EM CURSO</span>
                </div>
                <div className="grid grid-cols-3 divide-x divide-[var(--r-border)] border-b border-[var(--r-border)] py-5 text-center">
                  <div><p className="text-xl font-extrabold text-[var(--r-primary)]">11</p><p className="mt-1 text-xs font-semibold text-[var(--r-muted-fg)]">Módulos</p></div>
                  <div><p className="text-xl font-extrabold text-[var(--r-primary)]">100%</p><p className="mt-1 text-xs font-semibold text-[var(--r-muted-fg)]">Incluído</p></div>
                  <div><p className="text-xl font-extrabold text-[var(--r-primary)]">1</p><p className="mt-1 text-xs font-semibold text-[var(--r-muted-fg)]">Certificado</p></div>
                </div>
                <div className="divide-y divide-[var(--r-border)]">
                  {([
                    [BadgeCheck, "Prospeção e Canais de Aquisição", "Módulo 03 · todos os canais", 92],
                    [Handshake, "Angariação", "Módulo 06 · argumento de valor", 62],
                    [TrendingUp, "Negociação e Fecho", "Módulo 09 · do proposta à escritura", 38],
                    [BrainCircuit, "Ferramentas, CRM e IA", "Módulo 01 · Novo conteúdo", 14]
                  ] as const).map(([Icon, title, sub, pct]) => (
                    <div key={title} className="flex items-center gap-4 px-6 py-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--r-accent)]/15 text-[var(--r-accent-fg)]"><Icon size={19} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[var(--r-primary)]">{title}</p>
                        <p className="text-xs text-[var(--r-muted-fg)]">{sub}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--r-border)]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--r-gradient-gold)" }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-6 py-4 text-xs font-semibold">
                  <span className="text-[var(--r-muted-fg)]">Atualizado mensalmente</span>
                  <span className="inline-flex items-center gap-1.5 text-[var(--r-accent-fg)]"><Sparkles size={13} /> Novos conteúdos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training plan */}
        <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: "var(--r-gradient-dark)", backgroundImage: "radial-gradient(hsl(46 30% 60% / .12) 1px, transparent 1px), var(--r-gradient-dark)", backgroundSize: "22px 22px, auto" }}>
          <div className="container relative mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)]/30 px-4 py-1.5 text-xs font-bold text-[var(--r-accent)]"><BookOpen size={14} /> Plano de formação FigueiraHome</span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">11 módulos que te levam do <span className="text-[var(--r-accent)]">zero ao primeiro negócio.</span></h2>
              <p className="mt-4 text-white/65">Um percurso estruturado, do onboarding à fidelização, desenvolvido internamente para consultores FigueiraHome. Formação prática, orientada para resultados reais.</p>
            </div>
            <ol className="mx-auto mt-12 grid max-w-3xl gap-3">
              {trainingModules.map(([Icon, title], index) => (
                <li key={title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[var(--r-accent)]"><Icon size={17} /></span>
                  <span className="text-xs font-extrabold text-[var(--r-accent)]">{String(index).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm font-bold text-white">{title}</span>
                  <ChevronDown size={16} className="text-white/40" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Academia Novo Imobiliário — complemento + comparação + tópicos (bloco escuro contínuo) */}
        <section className="relative overflow-hidden py-20 text-white lg:py-28" style={{ background: "var(--r-gradient-dark)" }}>
          <div className="pointer-events-none absolute -top-24 left-0 h-80 w-80 rounded-full bg-[var(--r-accent)]/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[var(--r-accent)]/10 blur-[100px]" />
          <div className="container relative mx-auto px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)]/30 px-4 py-1.5 text-xs font-bold text-[var(--r-accent)]"><Layers size={14} /> Complemento de formação</span>
              <h2 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">Para além do acompanhamento, tens acesso incluído a uma <span className="text-[var(--r-accent)]">academia de formação</span> que complementa a tua integração.</h2>
              <p className="mt-5 text-white/65">Trabalhamos em parceria com a Academia Novo Imobiliário, um programa de formação online estruturado que serve como base de conhecimento para quem se integra connosco. É um complemento à tua evolução — pensado para acelerar a aprendizagem desde o início.</p>
            </div>

            <ul className="mx-auto mt-10 grid max-w-2xl gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              {([
                [PlayCircle, "Formação online com aulas estruturadas e disponíveis sempre que precisares"],
                [HomeIcon, "Aprendes ao teu ritmo, a partir de qualquer lugar"],
                [GraduationCap, "Conteúdos práticos aplicáveis ao dia a dia do consultor"],
                [Sparkles, "Complemento direto ao acompanhamento na FigueiraHome"],
                [CheckCircle2, "Acesso a uma base estruturada que acelera a tua aprendizagem"]
              ] as const).map(([Icon, item]) => (
                <li key={item} className="flex items-center gap-3.5 text-sm font-semibold"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ background: "var(--r-gradient-gold)" }}><Icon size={16} className="text-[var(--r-accent-fg)]" /></span> {item}</li>
              ))}
            </ul>

            <div className="mt-16 text-center">
              <span className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)]" style={{ background: "var(--r-gradient-gold)" }}><Layers size={14} /> Acesso incluído na tua integração</span>
              <p className="mx-auto mt-5 max-w-2xl text-xl font-bold leading-snug sm:text-2xl">O que acelera resultados não é só ter formação. <span className="text-[var(--r-accent)]">É ter formação + acompanhamento para aplicar.</span></p>
            </div>

            <div className="mx-auto mt-10 flex max-w-4xl flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><p className="font-extrabold">FigueiraHome</p><p className="mt-1 text-sm text-white/60">Acompanhamento prático diário</p></div>
              <span className="mx-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/60"><Plus size={15} /></span>
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><p className="font-extrabold">Academia Novo Imobiliário</p><p className="mt-1 text-sm text-white/60">Formação estruturada online</p></div>
              <span className="mx-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/60"><ArrowRight size={15} /></span>
              <div className="flex-1 rounded-2xl p-6 text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)]" style={{ background: "var(--r-gradient-gold)" }}><p className="font-extrabold">Resultado</p><p className="mt-1 text-sm opacity-90">Evolução mais rápida e consistente</p></div>
            </div>
            <p className="mx-auto mt-8 max-w-2xl border-l-4 border-[var(--r-accent)] pl-5 text-sm italic text-white/60">A maioria entra no imobiliário sem uma base de formação estruturada. <span className="font-bold not-italic text-[var(--r-accent)]">Aqui, essa base faz parte do teu ponto de partida.</span></p>

            <div className="mt-20">
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--r-accent)]"><GraduationCap size={16} /> Academia Novo Imobiliário</span>
                <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">Conteúdos que te preparam para o mercado real.</h3>
                <p className="mt-3 text-white/65">A Academia Novo Imobiliário complementa o teu percurso com formação prática, atualizada e orientada para os desafios reais do dia a dia.</p>
              </div>
              <ol className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {academyTopics.map((topic, index) => (
                  <li key={topic} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"><span className="text-xs font-extrabold text-[var(--r-accent)]">{String(index + 1).padStart(2, "0")}</span><span className="text-sm font-semibold">{topic}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <Trainers />

        {/* Method quote */}
        <section className="py-16 text-center text-white" style={{ background: "var(--r-gradient-dark)" }}>
          <div className="container mx-auto px-6">
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent)]">A diferença está no método</span>
            <p className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold leading-snug sm:text-3xl">A maioria entra no imobiliário sem método.<br />Aqui entras com <span className="text-[var(--r-accent)]">formação + acompanhamento</span>.</p>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-[var(--r-secondary)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Benefícios</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">O que vais encontrar connosco</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
                  <p className="font-extrabold text-[var(--r-primary)]">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--r-muted-fg)]">{body}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-14 max-w-2xl text-center text-lg font-bold text-[var(--r-primary)]">Não prometemos facilidades.<br /><span className="font-normal text-[var(--r-muted-fg)]">Prometemos uma oportunidade séria para quem quer aprender, executar e crescer.</span></p>
          </div>
        </section>

        <PotentialChart />

        {/* How we work */}
        <section className="py-20 text-white lg:py-28" style={{ background: "var(--r-gradient-dark)" }}>
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent)]">Como trabalhamos</span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Não é sorte. É método, acompanhamento e ferramentas certas.</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {howWeWork.map(([Icon, title, body]) => (
                <div key={String(title)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <Icon size={24} className="text-[var(--r-accent)]" />
                  <p className="mt-4 font-extrabold">{String(title)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{String(body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case study */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Prova real</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Resultados começam quando há método, acompanhamento e compromisso.</h2>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--r-accent)]/30 bg-[var(--r-accent)]/10 px-4 py-1.5 text-xs font-bold text-[var(--r-accent-fg)]">Caso real · 2025</span>
                <p className="mt-5 text-lg leading-relaxed text-[var(--r-muted-fg)]">Uma consultora entrou sem experiência no mercado local, sem rede de contactos consolidada e sem conhecimento prévio do setor. Com acompanhamento, método e consistência, conseguiu evoluir e fechar resultados relevantes num curto espaço de tempo.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-[var(--r-accent)]/30 bg-[var(--r-card)] p-8 text-center shadow-[var(--r-shadow-card)]"><p className="text-5xl font-extrabold text-[var(--r-primary)]">17</p><p className="mt-2 text-sm font-semibold text-[var(--r-muted-fg)]">transações fechadas em 2025</p></div>
                <div className="rounded-2xl p-8 text-center text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)]" style={{ background: "var(--r-gradient-gold)" }}><p className="text-4xl font-extrabold">~100.000€</p><p className="mt-2 text-sm font-semibold opacity-90">faturação gerada</p></div>
              </div>
            </div>
          </div>
        </section>

        <IncomeSimulator />

        {/* Commission table */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Plano de comissionamento</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Quanto mais produzes, mais recebes.</h2>
              <p className="mt-4 text-[var(--r-muted-fg)]">O teu patamar sobe com a tua faturação anual. Quanto mais negócios fechas, maior a percentagem que recebes de cada transação.</p>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl bg-[var(--r-card)] shadow-[var(--r-shadow-elegant)]">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead><tr style={{ background: "var(--r-primary)" }} className="text-white"><th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Patamar</th><th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Faturação bruta / ano</th><th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Fee mensal</th><th className="px-5 py-4 text-xs font-bold uppercase tracking-wider">Fee por CMI</th></tr></thead>
                <tbody>{commissionTiers.map((row) => <tr key={row[0]} className="border-t border-[var(--r-border)]"><td className="px-5 py-4 text-lg font-extrabold text-[var(--r-primary)]">{row[0]}</td><td className="px-5 py-4 font-semibold">{row[1]}</td><td className="px-5 py-4 font-semibold">{row[2]}</td><td className="px-5 py-4 font-semibold">{row[3]}</td></tr>)}</tbody>
              </table>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-[var(--r-muted-fg)]">Reset anual — a faturação conta desde a data de aniversário do teu contrato. Em cada aniversário o contador reinicia: no 1.º ano começas nos 40%; a partir do 2.º ano começas diretamente nos 50%. Os valores dos fees podem ser revistos em função de alterações nos preços praticados pelos portais imobiliários ou outros prestadores de serviços incluídos.</p>
          </div>
        </section>

        {/* Founder message */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto max-w-3xl px-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full"><Image src="/founder-miguel-germano.png" alt="Miguel Germano" fill sizes="64px" className="object-cover" /></div>
              <div><p className="font-extrabold text-[var(--r-primary)]">Miguel Germano</p><p className="text-sm text-[var(--r-muted-fg)]">Fundador da FigueiraHome · ~20 anos no imobiliário</p></div>
            </div>
            <span className="mt-8 inline-block text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Mensagem do fundador</span>
            <h2 className="mt-3 text-2xl font-extrabold text-[var(--r-primary)] sm:text-3xl">Já estive exatamente onde tu estás hoje. E sei como te levar onde queres chegar.</h2>
            <div className="prose-ai mt-6 grid gap-4 text-[var(--r-muted-fg)]">
              <p>Em 2005, tinha aquilo que muitos considerariam um &ldquo;bom emprego&rdquo;. Trabalhava numa empresa pública em Lisboa, tinha estabilidade e uma posição confortável. Mas havia algo que me consumia por dentro: o teto.</p>
              <p>Por mais que me esforçasse, por mais horas que dedicasse ou por melhor que fosse o meu trabalho, o meu rendimento estava bloqueado. Eu tinha um preço/hora estabelecido e não havia forma de o ultrapassar. Sentir que o meu esforço não tinha impacto direto na minha vida financeira era algo que me frustrava profundamente.</p>
              <p>Foi numa conversa com uma amiga que o mercado imobiliário surgiu no meu radar. Percebi rapidamente: se tivesse as ferramentas certas e o apoio adequado, o meu crescimento dependeria apenas de mim. Não hesitei. Despedi-me, deixei o &ldquo;seguro&rdquo; para trás e abri a minha primeira agência imobiliária, sem qualquer experiência prévia no setor.</p>
              <p className="mt-2 font-extrabold text-[var(--r-primary)]">O poder do método e do acompanhamento</p>
              <p>No início, liguei-me a uma marca forte que me deu um apoio incansável. O meu &ldquo;segredo&rdquo;? Apenas pus em prática, à risca, aquilo que me ensinaram. O resultado foi explosivo: em apenas dois anos, cheguei ao Top 10 Nacional. Fui a prova viva de que, com direção, a falta de experiência não é um obstáculo.</p>
              <p>Mas a vida de empresário não é feita só de vitórias. A crise de 2008 atingiu o mercado com violência. Foi um período duríssimo, mas que me obrigou a reinventar. Nessa altura, adquiri a agência na Figueira da Foz. Mesmo no meio da tempestade, continuámos a fechar negócios e a fazer crescer a equipa.</p>
              <p>Mais tarde, um revés financeiro inesperado voltou a testar a minha resiliência. Foram momentos de grande pressão, em que tive de reconstruir muito do que tinha criado. Mas se há algo de que me orgulho é que nunca baixei os braços e nunca deixei de apoiar quem trabalhava comigo.</p>
              <p className="mt-2 font-extrabold text-[var(--r-primary)]">A minha visão para o consultor de hoje</p>
              <p>Se no passado uma grande marca me ajudou a alcançar o sucesso, hoje defendo algo diferente: cada consultor deve ser conhecido pelo seu próprio nome. Esse é que é a sua verdadeira marca.</p>
              <p>A pegada que construíres com clientes satisfeitos deve ficar associada a ti — ao teu nome, aos teus valores, ao teu empenho e à tua credibilidade. Não à marca para a qual trabalhas. Porque as marcas mudam, as agências mudam, mas a confiança que os clientes depositam em ti é tua para sempre.</p>
              <p>O meu papel não é dar-te uma agência luxuosa ou uma localização premium. O cliente não vai à tua agência ver casas num computador — isso já foi. Hoje tens redes sociais, portais imobiliários e ferramentas digitais que chegam ao cliente onde ele está.</p>
              <p>O meu papel é criar as condições, as ferramentas, os recursos e o acompanhamento diário para que te possas focar no teu caminho e encurtares o tempo que te leva ao sucesso. Para que não te preocupes com a preparação de um processo para escritura, com o marketing do imóvel, com as campanhas nas redes sociais, nem com o desenvolvimento de ferramentas de inteligência artificial que te apoiem no dia a dia.</p>
              <blockquote className="border-l-4 border-[var(--r-accent)] pl-5 text-lg font-bold italic text-[var(--r-primary)]">&ldquo;Eu sou como uma rede que te ampara e não te deixa cair.&rdquo;</blockquote>
              <p className="mt-2 font-extrabold text-[var(--r-primary)]">A minha missão hoje: o teu sucesso</p>
              <p>Ao longo destes quase 20 anos, vi dezenas de consultores passarem por mim. Muitos deles continuam no mercado hoje, com carreiras sólidas e de sucesso. Posso dizer com orgulho que não há ninguém que tenha trabalhado lado a lado comigo, que se tenha deixado ajudar, e que não tenha alcançado bons resultados.</p>
              <p>Hoje, a minha dedicação não está apenas em fechar as minhas vendas. Está em fechar as tuas.</p>
              <p>Sou obcecado pelo sucesso de quem trabalha comigo. Faço questão de estar presente no terreno: acompanho-te nas tuas primeiras prospeções, vou contigo às primeiras angariações e estou ao teu lado nas negociações e fechos de venda. Faço isto porque sei o que é começar do zero. Sei o que é o medo de falhar. E sei exatamente o que é preciso fazer para transformar esse medo numa carreira altamente rentável.</p>
              <p>Se tens vontade de aprender e recusas-te a baixar os braços, eu dou-te o método, a experiência e o acompanhamento.</p>
              <p className="text-xl font-extrabold text-[var(--r-primary)]">O teu teto acaba aqui.</p>
            </div>
            <div className="mt-8 text-center">
              <a href="#formulario" className="inline-flex items-center gap-2 rounded-full bg-[var(--r-gradient-gold)] px-7 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Vamos começar? Candidatar-me agora <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Processo</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Como funciona o processo</h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map(([n, title, body]) => (
                <div key={n} className="rounded-2xl bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
                  <span className="text-2xl font-extrabold text-[var(--r-accent-fg)]">{n}</span>
                  <p className="mt-3 font-extrabold text-[var(--r-primary)]">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--r-muted-fg)]">{body}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-xl text-center text-sm font-semibold text-[var(--r-muted-fg)]">Sem pressão. Sem promessas vazias. Apenas uma conversa séria para perceber se faz sentido.</p>
          </div>
        </section>

        {/* Common doubts */}
        <section className="bg-[var(--r-secondary)] py-20 lg:py-28">
          <div className="container mx-auto max-w-2xl px-6 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">Dúvidas comuns</span>
            <h2 className="mt-3 text-2xl font-extrabold text-[var(--r-primary)] sm:text-3xl">Talvez estejas a pensar...</h2>
          </div>
          <div className="container mx-auto mt-10 grid max-w-2xl gap-4 px-6">
            {commonDoubts.map(([doubt, answer]) => (
              <div key={doubt} className="rounded-2xl border border-[var(--r-border)] bg-[var(--r-card)] p-6 shadow-[var(--r-shadow-card)]">
                <p className="font-extrabold italic text-[var(--r-primary)]">{doubt}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--r-muted-fg)]">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <RecruitmentLeadForm />

        {/* FAQ */}
        <section className="bg-[var(--r-bg)] py-20 lg:py-28">
          <div className="container mx-auto max-w-3xl px-6">
            <div className="text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-[var(--r-accent-fg)]">FAQ</span>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--r-primary)] sm:text-4xl">Perguntas frequentes</h2>
            </div>
            <div className="mt-10 divide-y divide-[var(--r-border)] rounded-2xl bg-[var(--r-card)] px-2 shadow-[var(--r-shadow-card)]">
              {faqs.map(([question, answer]) => (
                <details key={question} className="group px-4 py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-extrabold text-[var(--r-primary)]">{question}<span className="shrink-0 text-xl font-bold text-[var(--r-accent-fg)] transition group-open:rotate-45">+</span></summary>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--r-muted-fg)]">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Formação + Acompanhamento diagram */}
        <section className="bg-[var(--r-secondary)] py-16 text-center">
          <div className="container mx-auto px-6">
            <p className="mx-auto max-w-2xl text-xl font-bold leading-relaxed text-[var(--r-primary)] sm:text-2xl">O que faz a diferença não é só a formação.<br />É ter alguém ao teu lado para aplicar o que aprendes.</p>
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-6 text-sm">
              <div><p className="text-lg font-extrabold text-[var(--r-accent-fg)]">Formação</p><p className="mt-1 text-[var(--r-muted-fg)]">dá conhecimento</p></div>
              <span className="text-2xl text-[var(--r-muted-fg)]">+</span>
              <div><p className="text-lg font-extrabold text-[var(--r-accent-fg)]">Acompanhamento</p><p className="mt-1 text-[var(--r-muted-fg)]">transforma em resultados</p></div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-center text-white lg:py-28" style={{ background: "var(--r-gradient-dark)" }}>
          <div className="container mx-auto max-w-2xl px-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Talvez não precises de outro emprego. Talvez precises de uma nova direção.</h2>
            <p className="mt-4 text-white/70">Se tens ambição, vontade de aprender e sentes que está na altura de construir uma nova fase profissional, começa por uma conversa.</p>
            <a href="#quiz" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--r-gradient-gold)] px-7 py-3.5 text-sm font-bold text-[var(--r-accent-fg)] shadow-[var(--r-shadow-gold)] transition hover:opacity-90" style={{ background: "var(--r-gradient-gold)" }}>Quero perceber se tenho perfil <ArrowRight size={16} /></a>
            <p className="mt-4 text-xs font-semibold text-white/50">Vagas limitadas para garantir acompanhamento próximo.</p>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }} />
      <VideoFooter variant="recruitment" />
    </>
  );
}
