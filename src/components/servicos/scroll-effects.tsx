"use client";

import { useEffect } from "react";

export function ServicosScrollEffects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealables = Array.from(document.querySelectorAll<HTMLElement>(".servicos-page .reveal"));

    let io: IntersectionObserver | null = null;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const siblings = Array.from(el.parentElement?.children ?? []).filter((n) => n.classList.contains("reveal"));
          const idx = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = `${Math.min(idx * 85, 420)}ms`;
          el.classList.add("is-in");
          io?.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      revealables.forEach((el) => io?.observe(el));
    }

    const counters = Array.from(document.querySelectorAll<HTMLElement>(".servicos-page [data-count]"));
    function fmt(n: number, prefix: string, suffix: string, group: boolean) {
      let t = String(n);
      if (group) t = t.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return prefix + t + suffix;
    }
    function animateCount(el: HTMLElement) {
      const target = parseInt(el.getAttribute("data-count") || "0", 10) || 0;
      const prefix = el.getAttribute("data-prefix") || "";
      const suffix = el.getAttribute("data-suffix") || "";
      const group = el.getAttribute("data-group") === "1";
      if (reduceMotion || target === 0) { el.textContent = fmt(target, prefix, suffix, group); return; }
      const duration = 1150;
      let start: number | null = null;
      function frame(ts: number) {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased), prefix, suffix, group);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    let co: IntersectionObserver | null = null;
    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCount);
    } else {
      co = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target as HTMLElement);
          co?.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => co?.observe(el));
    }

    return () => { io?.disconnect(); co?.disconnect(); };
  }, []);

  return null;
}
