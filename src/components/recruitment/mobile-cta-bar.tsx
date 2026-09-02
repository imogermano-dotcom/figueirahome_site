"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-[95] border-t border-[var(--r-border)] bg-[var(--r-card)] px-4 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <a href="#quiz" className="flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[var(--r-accent-fg)]" style={{ background: "var(--r-gradient-gold)" }}>
        Quero perceber se tenho perfil <ArrowRight size={16} />
      </a>
    </div>
  );
}
