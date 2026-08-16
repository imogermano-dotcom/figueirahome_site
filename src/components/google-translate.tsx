"use client";

import { Globe2 } from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const sourceLanguage = "pt";

// Add supported automatic languages here as the service is expanded.
const languages = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" }
] as const;

type LanguageCode = (typeof languages)[number]["code"];

function languageFromCookie(): LanguageCode {
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("googtrans="))
    ?.split("=")[1];
  const target = value?.split("/").at(-1);

  return languages.some((language) => language.code === target) ? (target as LanguageCode) : sourceLanguage;
}

export function GoogleTranslate() {
  const [ready, setReady] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(sourceLanguage);

  useEffect(() => {
    const restoreLanguage = window.setTimeout(() => setSelectedLanguage(languageFromCookie()), 0);
    const hideGoogleChrome = () => {
      document.querySelectorAll<HTMLElement>(".goog-te-banner-frame, .goog-te-balloon-frame, .goog-tooltip, #goog-gt-tt, iframe.VIpgJd-ZVi9od-ORHb-OEVmcd").forEach((element) => {
        element.style.setProperty("display", "none", "important");
      });
      document.body.style.setProperty("top", "0", "important");
    };
    const chromeObserver = new MutationObserver(hideGoogleChrome);
    chromeObserver.observe(document.documentElement, { childList: true, subtree: true });
    hideGoogleChrome();

    const initialise = () => {
      if (!window.google?.translate) return;
      if (document.querySelector(".goog-te-combo")) {
        setReady(true);
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: sourceLanguage,
          includedLanguages: languages.map((language) => language.code).join(","),
          autoDisplay: false
        },
        "google_translate_element"
      );
      setReady(true);
    };

    window.googleTranslateElementInit = initialise;

    if (window.google?.translate) {
      initialise();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => setReady(false);
    document.body.appendChild(script);

    return () => {
      window.clearTimeout(restoreLanguage);
      chromeObserver.disconnect();
      script.remove();
      delete window.googleTranslateElementInit;
    };
  }, []);

  function changeLanguage(language: LanguageCode) {
    if (language === sourceLanguage) {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
      window.location.reload();
      return;
    }

    const translateSelect = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!translateSelect) return;

    translateSelect.value = language;
    translateSelect.dispatchEvent(new Event("change", { bubbles: true }));
    setSelectedLanguage(language);
  }

  return (
    <div className="language-switcher">
      <label className="sr-only" htmlFor="site-language">Idioma do site</label>
      <Globe2 aria-hidden="true" size={16} strokeWidth={2} />
      <select
        id="site-language"
        value={selectedLanguage}
        disabled={!ready}
        onChange={(event) => changeLanguage(event.target.value as LanguageCode)}
        aria-label="Idioma do site"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <div id="google_translate_element" className="google-translate-element" aria-hidden="true" />
    </div>
  );
}
