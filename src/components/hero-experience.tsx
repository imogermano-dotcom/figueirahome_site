"use client";
import Link from "next/link";
import { Award, BadgeCheck, Clapperboard, Handshake, MoveRight, UserRound } from "lucide-react";
import { useState } from "react";
import { videoSourceFromUrl } from "@/components/property-video";

export type HeroProperty = {
  id: string;
  slug: string;
  title: string;
  location: string;
  videoUrl: string | null;
};

type HeroItem = { id: string; title: string; description: string; href: string; videoUrl: string };

export function HeroExperience({ properties }: { properties: HeroProperty[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items: HeroItem[] = properties
    .filter((property): property is HeroProperty & { videoUrl: string } => Boolean(property.videoUrl && videoSourceFromUrl(property.videoUrl)))
    .slice(0, 3)
    .map((property) => ({ id: property.id, title: property.title, description: property.location, href: `/imoveis/${property.slug}`, videoUrl: property.videoUrl }));
  const activeItem = items[activeIndex] || items[0];
  const activeVideo = activeItem ? videoSourceFromUrl(activeItem.videoUrl) : null;

  function selectItem(index: number) { setActiveIndex((index + items.length) % items.length); }

  return (
    <section className="hero-section hero-experience relative -mt-0 overflow-hidden bg-[var(--navy)] pt-[72px]">
      <video className="hero-video absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata"><source src="/Video/hero-web.mp4" type="video/mp4" /></video>
      <div className="hero-video-tint absolute inset-0" />
      <div className="hero-copy-shade absolute inset-y-0 left-0" />
      <div className="container hero-layout relative z-10 grid min-h-[800px] items-center gap-12 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.82fr)] lg:gap-16">
        <div className="hero-intro">
          <h1 className="hero-title display-font mt-5 max-w-[650px] text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.98] text-white">A sua imobiliária de referência na <span className="text-[var(--gold-l)]">Figueira da Foz.<span className="hero-title-rule" aria-hidden="true" style={{ display: "block", width: 62, height: 3, marginTop: 22, backgroundColor: "var(--gold-l)" }} /></span></h1>
          <p className="hero-sub mt-7 max-w-[570px] text-[1.05rem] leading-8 text-white/80">Compre, venda ou arrende o seu imóvel com uma equipa local especializada, presente na região desde 2009. Transparência e resultados em cada transação.</p>
          <div className="hero-btns mt-8 flex flex-wrap gap-3"><Link className="btn btn-primary" href="/imoveis">Ver imóveis <MoveRight size={16} /></Link><Link className="btn btn-outline-light" href="/contacto?pedido=avaliacao">Avaliação gratuita</Link></div>
          <div className="hero-proof-grid mt-12">
            <div><UserRound aria-hidden="true" /><strong>Experiência Local</strong><span>Conhecemos o mercado e a região como ninguém.</span></div>
            <div><BadgeCheck aria-hidden="true" /><strong>Marketing de Excelência</strong><span>Promovemos o seu imóvel com estratégias eficazes.</span></div>
            <div><Handshake aria-hidden="true" /><strong>Acompanhamento Total</strong><span>Estamos consigo em todas as etapas do processo.</span></div>
            <div><Award aria-hidden="true" /><strong>Resultados Comprovados</strong><span>Focados em resultados reais e clientes satisfeitos.</span></div>
          </div>
        </div>
        {activeItem && activeVideo && <div className="hero-showcase" aria-label="Vídeos de imóveis Figueira Home">
          <div className="hero-showcase-heading"><Clapperboard aria-hidden="true" /><div><p>Veja o nosso trabalho</p><span>Vídeos curtos dos nossos imóveis e projetos.</span></div></div>
          <div className="hero-showcase-layout">
            <div className="hero-showcase-stage">
              {activeVideo.kind === "file" ? <video className="hero-showcase-media" autoPlay muted loop playsInline controls preload="metadata"><source src={activeVideo.src} /></video> : <iframe className="hero-showcase-media border-0" title={`Vídeo: ${activeItem.title}`} src={activeVideo.src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
              <div className="hero-showcase-gradient" />
              <div className="hero-showcase-caption"><span>Vídeo do imóvel</span><strong>{activeItem.title}</strong><p>{activeItem.description}</p><Link href={activeItem.href} className="hero-showcase-link">Ver imóvel <MoveRight size={15} /></Link></div>
            </div>
            {items.length > 1 && <div className="hero-showcase-thumbs">{items.map((item, index) => {
              const thumbnailVideo = videoSourceFromUrl(item.videoUrl);
              return <button type="button" key={item.id} className={index === activeIndex ? "active" : ""} onClick={() => selectItem(index)} aria-label={`Ver vídeo de ${item.title}`}>
                {thumbnailVideo?.kind === "file" ? <video muted loop autoPlay playsInline preload="metadata"><source src={thumbnailVideo.src} /></video> : thumbnailVideo?.kind === "embed" ? <iframe title="" src={thumbnailVideo.src} tabIndex={-1} aria-hidden="true" /> : null}
                <span>Ver vídeo</span>
              </button>;
            })}</div>}
          </div>
        </div>}
      </div>
    </section>
  );
}
