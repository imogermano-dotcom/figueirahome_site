"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredConsent, setStoredConsent, type ConsentValue } from "@/lib/consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
    const reopen = () => setVisible(true);
    window.addEventListener("cookie-consent-reopen", reopen);
    return () => window.removeEventListener("cookie-consent-reopen", reopen);
  }, []);

  if (!visible) return null;

  function decide(value: ConsentValue) {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-[var(--border)] bg-white p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] sm:p-6">
      <div className="container flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Utilizamos cookies estritamente necessários ao funcionamento do site e, com o seu consentimento, cookies analíticos e de publicidade (Google Analytics e Meta Pixel) para perceber como o site é utilizado. Pode aceitar ou rejeitar a qualquer momento — saiba mais na{" "}
          <Link href="/politica-cookies" className="font-bold text-[var(--blue)] underline">Política de Cookies</Link>.
        </p>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => decide("rejected")} className="btn btn-outline-dark">Rejeitar</button>
          <button type="button" onClick={() => decide("accepted")} className="btn btn-primary">Aceitar</button>
        </div>
      </div>
    </div>
  );
}
