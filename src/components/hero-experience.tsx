"use client";

import Link from "next/link";
import { ArrowUpRight, Award, BadgeCheck, Clapperboard, Handshake, MoveRight, Play, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { videoSourceFromUrl, type VideoSource } from "@/components/property-video";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export type HeroProperty = {
  id: string;
  slug: string;
  title: string;
  location: string;
  videoUrl: string | null;
};

type HeroItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  video: VideoSource;
};

type HeroVideoRow = {
  imovel_ref: string | null;
  titulo: string | null;
  zona: string | null;
  freguesia: string | null;
  concelho: string | null;
  video_url: string | null;
};

function slugFromReference(reference: string) {
  return reference
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function HeroExperience({ properties }: { properties: HeroProperty[] }) {
  const [heroProperties, setHeroProperties] = useState(properties);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const items: HeroItem[] = heroProperties.flatMap((property) => {
    const video = property.videoUrl ? videoSourceFromUrl(property.videoUrl) : null;
    return video ? [{ id: property.id, title: property.title, description: property.location, href: `/imoveis/${property.slug}?ref=${encodeURIComponent(property.id)}`, video }] : [];
  }).slice(0, 3);
  const activeItem = items[activeIndex] || items[0];
  const activeVideo = activeItem?.video || null;

  useEffect(() => {
    if (items.length) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    let cancelled = false;

    void supabase
      .from("imoveis")
      .select("imovel_ref,titulo,zona,freguesia,concelho,video_url")
      .eq("publicado", true)
      .eq("disponibilidade", "Disponível")
      .not("video_url", "is", null)
      .order("data_criacao", { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (cancelled || error || !data?.length) return;

        setHeroProperties(data.flatMap((row: HeroVideoRow) => {
          const reference = row.imovel_ref?.trim();
          const videoUrl = row.video_url?.trim();
          if (!reference || !videoUrl) return [];
          const location = [row.zona, row.freguesia, row.concelho].filter(Boolean).join(" - ") || "Figueira da Foz";
          return [{
            id: reference,
            slug: slugFromReference(reference),
            title: row.titulo?.trim() || `Imóvel ${reference}`,
            location,
            videoUrl
          }];
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [items.length]);

  function selectItem(index: number, play = false) {
    setActiveIndex((index + items.length) % items.length);
    setIsPlaying(play);
  }

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
              {isPlaying ? (
                activeVideo.kind === "file" ? <video className="hero-showcase-media" autoPlay muted loop playsInline controls preload="metadata"><source src={activeVideo.src} /></video> : <iframe className="hero-showcase-media border-0" title={`Vídeo: ${activeItem.title}`} src={`${activeVideo.src}&autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
              ) : (
                <button type="button" className="hero-showcase-poster" onClick={() => setIsPlaying(true)} aria-label={`Reproduzir vídeo de ${activeItem.title}`}>
                  {activeVideo.kind === "file" ? <video className="hero-showcase-media" muted autoPlay loop playsInline preload="metadata"><source src={activeVideo.src} /></video> : activeVideo.thumbnailSrc ? <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="hero-showcase-media" src={activeVideo.thumbnailSrc} alt="" />
                  </> : <span className="hero-showcase-fallback" />}
                  <span className="hero-play-icon"><Play size={24} fill="currentColor" aria-hidden="true" /></span>
                </button>
              )}
              <div className="hero-showcase-gradient" />
              <div className="hero-showcase-caption"><div className="hero-showcase-actions"><button type="button" onClick={() => setIsPlaying(true)} aria-label={`Reproduzir vídeo de ${activeItem.title}`}><Play size={17} fill="currentColor" aria-hidden="true" /></button><Link href={activeItem.href} aria-label={`Abrir página do imóvel ${activeItem.title}`}><ArrowUpRight size={18} aria-hidden="true" /></Link></div></div>
            </div>
            {items.length > 1 && <div className="hero-showcase-thumbs">{items.map((item, index) => (
              <div className="hero-showcase-thumb" key={item.id}>
                <button type="button" className={index === activeIndex ? "active" : ""} onClick={() => selectItem(index)} aria-label={`Selecionar vídeo de ${item.title}`}>
                  {item.video.kind === "file" ? <video muted loop autoPlay playsInline preload="metadata"><source src={item.video.src} /></video> : item.video.thumbnailSrc ? <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.video.thumbnailSrc} alt="" />
                  </> : <span className="hero-thumb-fallback" />}
                  <span className="hero-thumb-play"><Play size={14} fill="currentColor" aria-hidden="true" /></span>
                </button>
                <Link href={item.href} aria-label={`Abrir página do imóvel ${item.title}`}><ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
            ))}</div>}
          </div>
        </div>}
      </div>
    </section>
  );
}
