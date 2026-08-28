"use client";

import { reopenCookiePreferences } from "@/lib/consent";

export function CookiePreferencesLink() {
  return (
    <button type="button" onClick={reopenCookiePreferences} className="text-inherit">
      {"Preferências de Cookies"}
    </button>
  );
}
