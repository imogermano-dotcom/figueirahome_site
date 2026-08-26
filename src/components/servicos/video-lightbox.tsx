"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";

type VideoRef = { id: string; ref: string; title: string };

const LightboxContext = createContext<((v: VideoRef) => void) | null>(null);

function posterFor(id: string, fallbackLevel: number) {
  if (fallbackLevel === 0) return `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
  if (fallbackLevel === 1) return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function VideoLightboxProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<VideoRef | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((v: VideoRef) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setActive(v);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [active, close]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      {active && (
        <div className="vmodal is-open" role="dialog" aria-modal="true" aria-label="Minifilme do imóvel" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <button type="button" className="vmodal__close" onClick={close} aria-label="Fechar o vídeo e voltar à apresentação"><X size={15} /> Fechar</button>
          <div className="vmodal__box">
            <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(active.id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title="Minifilme do imóvel" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen />
          </div>
          <p className="vmodal__hint">Prima <kbd>Esc</kbd> ou carregue fora do vídeo para voltar à apresentação.</p>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox deve ser usado dentro de VideoLightboxProvider");
  return ctx;
}

export function VideoCard({ id, reference, title, flag }: { id: string; reference: string; title: string; flag?: string }) {
  const open = useLightbox();
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <button type="button" className="video" disabled aria-hidden="true"><span className="video__ph">Minifilme<br />{reference}</span></button>;
  }

  return (
    <button type="button" className="video" aria-label={`Ver o minifilme do imóvel ${reference}`} onClick={() => open({ id, ref: reference, title })}>
      <img className="video__poster" src={posterFor(id, fallbackLevel)} alt="" loading="lazy" decoding="async" onError={() => (fallbackLevel < 2 ? setFallbackLevel(fallbackLevel + 1) : setFailed(true))} />
      {flag && <span className={`video__flag${flag.toLowerCase() === "vendido" ? " video__flag--vendido" : ""}`}>{flag}</span>}
      <span className="video__scrim" />
      <span className="video__play"><Play size={21} fill="var(--navy)" style={{ marginLeft: 3 }} /></span>
      <span className="video__meta"><span className="video__ref">{reference}</span><span className="video__t">{title}</span></span>
    </button>
  );
}

export function CaseFilmButton({ id, reference, label }: { id: string; reference: string; label: string }) {
  const open = useLightbox();
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const [failed, setFailed] = useState(false);

  return (
    <button type="button" className="case__film" onClick={() => open({ id, ref: reference, title: label })} aria-label={`Ver o minifilme do imóvel ${reference}`}>
      <span className="case__film__thumb">
        {!failed && <img src={posterFor(id, fallbackLevel)} alt="" loading="lazy" decoding="async" onError={() => (fallbackLevel < 2 ? setFallbackLevel(fallbackLevel + 1) : setFailed(true))} />}
        <span className="case__film__play"><Play size={11} fill="var(--navy)" /></span>
      </span>
      <span className="case__film__txt"><b>Ver o minifilme</b><i>{label}</i></span>
    </button>
  );
}
