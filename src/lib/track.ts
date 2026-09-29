// fbq só existe depois do consentimento de cookies (ver analytics-scripts.tsx) — sem consentimento é no-op.
export function trackLead() {
  (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("track", "Lead");
}
