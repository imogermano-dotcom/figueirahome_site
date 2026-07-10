import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Handshake, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { getAgents } from "@/lib/properties";
import { initials } from "@/lib/format";
import { VideoFooter } from "@/components/video-footer";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: "Conhe\u00e7a a Figueira Home, imobili\u00e1ria local na Figueira da Foz, licenciada com AMI 7968."
};

const principles = [
  [MapPin, "Conhecimento local", "Conhecemos a Figueira da Foz para l\u00e1 dos mapas: as zonas, os ritmos e o valor de cada localiza\u00e7\u00e3o."],
  [Sparkles, "Apresenta\u00e7\u00e3o que valoriza", "Fotografia, v\u00eddeo, drone e comunica\u00e7\u00e3o digital colocados ao servi\u00e7o de cada im\u00f3vel."],
  [Handshake, "Rela\u00e7\u00f5es transparentes", "Explicamos cada decis\u00e3o, acompanhamos cada etapa e mantemos o processo claro do in\u00edcio ao fim."],
  [ShieldCheck, "Rigor no processo", "Tratamos cada neg\u00f3cio com prepara\u00e7\u00e3o, acompanhamento documental e foco no resultado certo."],
] as const;

export default async function AboutPage() {
  const agents = await getAgents();

  return (
    <>
      <main>
        <section className="about-hero relative isolate min-h-[590px] overflow-hidden bg-[var(--navy)] pt-[72px] text-white">
          <Image
            src="/about/figueira-home-office.png"
            alt="Espa\u00e7o de trabalho da Figueira Home com vista para a costa"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="about-hero-overlay absolute inset-0" />
          <div className="container relative z-10 flex min-h-[518px] items-end py-16 md:py-20">
            <div className="max-w-[640px]">
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--gold-l)]">Figueira da Foz desde 2009</p>
              <h1 className="display-font text-[clamp(2.6rem,5vw,4.5rem)] font-extrabold leading-[0.98]">Uma casa \u00e9 mais do que um neg\u00f3cio.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">\u00c9 uma decis\u00e3o de vida. A Figueira Home junta experi\u00eancia local, m\u00e9todo e proximidade para tornar cada transa\u00e7\u00e3o mais segura e mais simples.</p>
            </div>
          </div>
          <svg className="absolute bottom-[-1px] left-0 z-10 h-16 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="#ffffff" />
          </svg>
        </section>

        <section className="container py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--blue)]">A nossa hist\u00f3ria</p>
              <h2 className="section-title mt-4">Imobili\u00e1ria local, com vis\u00e3o atual.</h2>
            </div>
            <div className="max-w-2xl text-[1.05rem] leading-8 text-[var(--muted)]">
              <p>A Figueira Home nasceu em 2009 para fazer a diferen\u00e7a no mercado imobili\u00e1rio da regi\u00e3o. Somos uma equipa local, licenciada pelo IMPIC com AMI 7968, que trabalha a compra, venda, arrendamento e avalia\u00e7\u00e3o de im\u00f3veis com acompanhamento pr\u00f3ximo.</p>
              <p className="mt-5">Aliamos rela\u00e7\u00f5es de confian\u00e7a a ferramentas atuais de apresenta\u00e7\u00e3o e divulga\u00e7\u00e3o. O objetivo \u00e9 simples: dar a cada cliente informa\u00e7\u00e3o clara, exposi\u00e7\u00e3o eficaz e apoio real em cada decis\u00e3o.</p>
            </div>
          </div>

          <div className="mt-14 grid overflow-hidden rounded-md border border-[var(--border)] sm:grid-cols-3">
            {[
              ["2009", "Ano de funda\u00e7\u00e3o"],
              ["AMI 7968", "Licen\u00e7a de media\u00e7\u00e3o imobili\u00e1ria"],
              ["Figueira da Foz", "Conhecimento de mercado local"]
            ].map(([value, label]) => (
              <div key={value} className="border-b border-[var(--border)] bg-[var(--offwhite)] px-7 py-8 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <div className="display-font text-2xl font-extrabold text-[var(--navy)]">{value}</div>
                <div className="mt-2 text-sm font-bold text-[var(--muted)]">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[var(--offwhite)] py-20 md:py-24">
          <div className="container">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--blue)]">Como trabalhamos</p>
              <h2 className="section-title mt-4">Cada im\u00f3vel merece uma estrat\u00e9gia \u00e0 medida.</h2>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
              {principles.map(([Icon, title, description]) => (
                <article key={title} className="bg-white p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-sm bg-[var(--navy)] text-[var(--gold-l)]"><Icon size={21} strokeWidth={1.8} /></span>
                  <h3 className="mt-6 font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20 md:py-28">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--blue)]">As pessoas</p>
              <h2 className="section-title mt-4">Uma equipa que conhece o seu pr\u00f3ximo passo.</h2>
            </div>
            <Link href="/contacto" className="inline-flex items-center gap-2 font-extrabold text-[var(--blue)] hover:text-[var(--navy)]">Falar connosco <ArrowUpRight size={18} /></Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent, index) => (
              <article key={agent.id} className="group relative overflow-hidden rounded-md border border-[var(--border)] bg-white p-7">
                <div className="absolute right-0 top-0 h-20 w-20 border-l border-b border-[var(--border)] bg-[var(--offwhite)]" />
                <div className="relative grid h-16 w-16 place-items-center rounded-full bg-[var(--navy)] text-lg font-extrabold text-[var(--gold-l)]">{initials(agent.name)}</div>
                <p className="relative mt-8 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--blue)]">{agent.role}</p>
                <h3 className="relative mt-2 text-xl font-extrabold">{agent.name}</h3>
                <div className="relative mt-7 h-px w-12 bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
                <span className="sr-only">Membro {index + 1} da equipa Figueira Home</span>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--navy)] py-16 text-white">
          <div className="container grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--gold-l)]">Vamos conversar</p>
              <h2 className="display-font mt-3 text-3xl font-extrabold">Procura uma equipa para o acompanhar?</h2>
            </div>
            <Link href="/contacto" className="btn btn-gold">Entrar em contacto <ArrowUpRight size={17} /></Link>
          </div>
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
