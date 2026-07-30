"use client";

import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { PropertyImage } from "@/lib/types";

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
  contentLabel?: "fotografia" | "planta";
};

export function PropertyGallery({ images, title, contentLabel = "fotografia" }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex] || images[0];
  const imageFit = contentLabel === "planta" ? "object-contain bg-white" : "object-cover";

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (hasMultipleImages && event.key === "ArrowLeft") showPrevious();
      if (hasMultipleImages && event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, isLightboxOpen, showNext, showPrevious]);

  if (!activeImage) return null;

  return (
    <section aria-label={`Galeria de ${contentLabel === "planta" ? "plantas" : "imagens"}: ${title}`}>
      <div className="property-detail-media relative h-[420px] overflow-hidden rounded-md bg-[var(--navy)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`h-full w-full ${imageFit}`} src={activeImage.url} alt={activeImage.alt || title} />
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-sm bg-[var(--navy)] px-4 py-2 text-sm font-extrabold text-white shadow-lg transition hover:bg-[var(--blue)] focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={`Ampliar ${contentLabel}`}
        >
          <Expand size={17} /> Ver {contentLabel}
        </button>
        {hasMultipleImages && <GalleryNavigation onPrevious={showPrevious} onNext={showNext} />}
      </div>

      {hasMultipleImages && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label={`Selecionar ${contentLabel}`}>
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-sm border-2 transition focus:outline-none focus:ring-2 focus:ring-[var(--gold)] ${index === activeIndex ? "border-[var(--gold)]" : "border-transparent opacity-65 hover:opacity-100"}`}
              aria-label={`Ver ${contentLabel} ${index + 1} de ${images.length}`}
              aria-pressed={index === activeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={`h-full w-full ${imageFit}`} src={image.url} alt="" />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] grid bg-black/95 p-4" role="dialog" aria-modal="true" aria-label={`${contentLabel === "planta" ? "Planta" : "Fotografia"} ${activeIndex + 1} de ${images.length}: ${title}`}>
          <div className="relative m-auto flex h-full w-full max-w-6xl items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="max-h-full max-w-full object-contain" src={activeImage.url} alt={activeImage.alt || title} />
            <button type="button" onClick={() => setIsLightboxOpen(false)} className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Fechar fotografia">
              <X size={22} />
            </button>
            {hasMultipleImages && <GalleryNavigation onPrevious={showPrevious} onNext={showNext} lightbox />}
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryNavigation({ onPrevious, onNext, lightbox = false }: { onPrevious: () => void; onNext: () => void; lightbox?: boolean }) {
  const position = lightbox ? "top-1/2 -translate-y-1/2" : "top-1/2 -translate-y-1/2";
  const style = lightbox ? "bg-white/15 text-white hover:bg-white/30" : "bg-white/90 text-[var(--navy)] hover:bg-white";

  return (
    <>
      <button type="button" onClick={onPrevious} className={`absolute left-4 ${position} grid h-11 w-11 place-items-center rounded-full ${style} transition focus:outline-none focus:ring-2 focus:ring-[var(--gold)]`} aria-label="Fotografia anterior">
        <ChevronLeft size={24} />
      </button>
      <button type="button" onClick={onNext} className={`absolute right-4 ${position} grid h-11 w-11 place-items-center rounded-full ${style} transition focus:outline-none focus:ring-2 focus:ring-[var(--gold)]`} aria-label="Fotografia seguinte">
        <ChevronRight size={24} />
      </button>
    </>
  );
}
