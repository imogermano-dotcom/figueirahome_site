"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getStoredConsent } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Píxeis Meta: o da variável (821222191626360, portfólio "01", usado pelas campanhas) + o "Figueira Home - Site"
// (2099212427379707, portfólio ImoGermano, criado a 2026-11-18). A variável aceita vários separados por vírgula.
const PIXEL_IDS = Array.from(new Set(
  [...(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").split(","), "2099212427379707"].map((s) => s.trim()).filter(Boolean)
));

export function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getStoredConsent() === "accepted");
    const onChange = (event: Event) => setEnabled((event as CustomEvent<string>).detail === "accepted");
    window.addEventListener("cookie-consent-change", onChange);
    return () => window.removeEventListener("cookie-consent-change", onChange);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      {PIXEL_IDS.length > 0 && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            ${PIXEL_IDS.map((id) => `fbq('init', '${id}');`).join(" ")}
            fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
