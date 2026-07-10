import Link from "next/link";
import { BarChart3, Camera, ClipboardList, Home, KeyRound, Megaphone, MoveRight, ShieldCheck } from "lucide-react";
import { getAgents, getFeaturedProperties, getProperties } from "@/lib/properties";
import { initials } from "@/lib/format";
import { PropertyCard } from "@/components/property-card";
import { QuickSearch } from "@/components/quick-search";
import { ScrollEffects } from "@/components/scroll-effects";
import { VideoFooter } from "@/components/video-footer";

export default async function HomePage() {
  const [featured, allProperties, agents] = await Promise.all([
    getFeaturedProperties(3),
    getProperties(),
    getAgents()
  ]);

  return (
    <>
      <ScrollEffects />
      <section className="hero-section relative -mt-0 min-h-[620px] overflow-hidden bg-[var(--navy)] pt-[72px]">
        <video className="hero-video absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
          <source src="/Video/hero-web.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-tint absolute inset-0" />
        <div className="hero-copy-shade absolute inset-y-0 left-0" />
        <div className="container relative z-10 flex min-h-[548px] items-center py-16">
          <div className="max-w-[590px]">
            <h1 className="hero-title display-font text-[clamp(2.1rem,4vw,3.4rem)] font-extrabold leading-tight text-white">
              A Sua Imobiliária de Referência na <span className="text-[var(--gold-l)]">Figueira da Foz</span>
            </h1>
            <p className="hero-sub mt-5 max-w-[480px] leading-8 text-white/75">
              Compre, venda ou arrende o seu imóvel com uma equipa local especializada, presente na região desde 2009. Transparência e resultados em cada transação.
            </p>
            <div className="hero-btns mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href="/imoveis">Ver Imóveis</Link>
              <Link className="btn btn-outline-light" href="/contacto?pedido=avaliacao">Avaliação Gratuita</Link>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-[-1px] left-0 z-10 h-16 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="#0D2B4E" />
        </svg>
      </section>

      <section className="bg-[var(--navy)] pb-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            [Home, "Comprar Imóvel", "Mais de 78 imóveis na Figueira da Foz. Apartamentos, moradias, terrenos e comercial.", "Explorar Imóveis", "/imoveis", "/services/comprar-imovel.png"],
            [ShieldCheck, "Vender o Seu Imóvel", "Avaliação gratuita, fotografia profissional, drone e marketing digital avançado.", "Saber Mais", "/contacto?pedido=avaliacao", "/services/vender-imovel.png"],
            [KeyRound, "Arrendar ou Trespassar", "Mediação de arrendamentos e trespasses. Processo simples, documentado e rápido.", "Ver Disponíveis", "/imoveis?negocio=arrendar", "/services/arrendar-trespassar.png"]
          ].map(([Icon, title, desc, cta, href, image], index) => (
            <article key={String(title)} className="fade zoom-card rounded-md border border-white/10 bg-[var(--navy2)] text-white transition hover:-translate-y-1 hover:shadow-2xl" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="service-media h-44 overflow-hidden" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 20, 38, 0.52), rgba(5, 20, 38, 0.08)), url(${image})` }}>
                <div className="zoom-layer grid h-full w-full place-items-center">
                  <Icon size={42} strokeWidth={1.6} />
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h2 className="display-font text-xl font-extrabold">{String(title)}</h2>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-[rgba(21,101,192,0.25)]"><Icon size={20} /></span>
                </div>
                <p className="mb-5 text-sm leading-7 text-white/62">{String(desc)}</p>
                <Link href={String(href)} className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-4 py-2 text-sm font-bold">{String(cta)} <MoveRight size={15} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--offwhite)] py-10">
        <QuickSearch />
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="fade-left">
            <h2 className="section-title">Quem Somos</h2>
            <p className="mt-5 leading-8 text-[var(--muted)]">A Figueira Home nasceu em 2009 com o objetivo de fazer a diferença no mercado imobiliário local. Apostamos em métodos de trabalho inovadores, tecnologia digital avançada e numa abordagem transparente.</p>
            <p className="mt-4 leading-8 text-[var(--muted)]">Somos uma equipa local, licenciada pela IMPIC (AMI 7968), com conhecimento de cada zona, rua e bairro da Figueira da Foz.</p>
            <div className="mt-8 flex flex-wrap gap-8">
              {[[allProperties.length || 78, "Imóveis disponíveis"], [15, "Anos de experiência"], [500, "Transações"]].map(([n, label]) => (
                <div key={String(label)}>
                  <div className="display-font text-3xl font-extrabold text-[var(--blue)]"><span className="count-num" data-count={n}>{n}</span><span className="text-[var(--gold)]">+</span></div>
                  <div className="text-sm font-bold text-[var(--muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-right relative rounded-md p-2">
            <div className="absolute left-0 top-0 h-24 w-24 border-l-4 border-t-4 border-[var(--blue)]" />
            <div className="absolute bottom-0 right-0 h-24 w-24 border-b-4 border-r-4 border-[var(--gold)]" />
            <div className="media-fallback h-80 rounded-md" />
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-[260px_1fr]">
          <div>
            <h2 className="section-title">Os Nossos Diferenciais</h2>
            <p className="mt-4 leading-7 text-[var(--muted)]">Tecnologia, transparência e dedicação total ao seu processo imobiliário.</p>
          </div>
          <div className="fade grid gap-6 sm:grid-cols-2">
            {[
              [Camera, "Fotografia Profissional", "Foto e vídeo de alta qualidade, incluindo filmagem com drone para captação aérea."],
              [BarChart3, "Avaliação de Mercado", "Análise rigorosa do valor real do seu imóvel com base no mercado local atual."],
              [Megaphone, "Marketing Digital", "Presença em portais imobiliários, Google Ads, redes sociais e email marketing."],
              [ClipboardList, "Gestão Documental", "Tratamos da documentação e preparação para escritura."]
            ].map(([Icon, title, desc]) => (
              <div key={String(title)} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded border border-[var(--border)] bg-[var(--offwhite)]"><Icon size={20} /></span>
                <div><h3 className="font-extrabold">{String(title)}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{String(desc)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-20">
        <div className="container">
          <div className="mb-10 grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <h2 className="section-title text-white">Imóveis<br />em Destaque</h2>
            <p className="max-w-3xl leading-8 text-white/62">Uma seleção dos imóveis publicados e marcados como destaque na base de dados. Ao alterar `featured` ou `published`, esta área reflete a mudança.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((property) => <PropertyCard key={property.id} property={property} dark />)}
          </div>
          <div className="mt-10 text-center">
            <Link href="/imoveis" className="btn btn-outline-light">Ver Todos os Imóveis ({allProperties.length})</Link>
          </div>
        </div>
      </section>

      <section className="bg-[var(--offwhite)] py-16">
        <div className="container">
          <h2 className="section-title mb-8">A Nossa Equipa</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.slice(0, 4).map((agent) => (
              <article key={agent.id} className="fade rounded-md border border-[var(--border)] bg-white p-6 text-center">
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border-[3px] border-[var(--blue)] bg-[var(--navy)] text-xl font-extrabold text-white">{initials(agent.name)}</div>
                <h3 className="font-extrabold">{agent.name}</h3>
                <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-[var(--blue)]">{agent.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="section-title mb-8 text-center">O que dizem os nossos clientes</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Ana Carvalho", "Vendedora - Março 2025", "A equipa da Figueira Home foi excecional. Vendemos o apartamento em menos de 3 semanas."],
            ["Ricardo Silva", "Comprador - Janeiro 2025", "Encontramos a casa dos nossos sonhos em Quiaios. O processo foi muito tranquilo."],
            ["Luísa Monteiro", "Vendedora - Novembro 2024", "As fotos com drone do meu imóvel foram impressionantes. Profissionais de excelência."]
          ].map(([name, date, text]) => (
            <article key={name} className="fade rounded-md border border-[var(--border)] p-6">
              <div className="mb-4 text-[var(--gold)]" aria-label="5 estrelas">★★★★★</div>
              <p className="leading-7 text-[var(--muted)]">&quot;{text}&quot;</p>
              <div className="mt-5 font-extrabold">{name}</div>
              <div className="text-sm text-[var(--muted)]">{date}</div>
            </article>
          ))}
        </div>
      </section>
      <VideoFooter />
    </>
  );
}
