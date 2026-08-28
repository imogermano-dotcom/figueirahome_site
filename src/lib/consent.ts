export const COOKIE_CONSENT_KEY = "fh_cookie_consent";
export type ConsentValue = "accepted" | "rejected";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setStoredConsent(value: ConsentValue) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: value }));
}

export function reopenCookiePreferences() {
  window.dispatchEvent(new CustomEvent("cookie-consent-reopen"));
}
