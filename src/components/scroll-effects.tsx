"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          entry.target.querySelectorAll<HTMLElement>(".count-num").forEach(startCounter);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".fade, .fade-left, .fade-right").forEach((el) => revealObs.observe(el));

    const heroMedia = document.querySelector<HTMLElement>(".hero-video");
    const onScroll = () => {
      if (heroMedia && window.scrollY < window.innerHeight * 1.2) {
        heroMedia.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      revealObs.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

function startCounter(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = Number(el.dataset.count || 0);
  const start = performance.now();
  const duration = 1800;
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toString();
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
