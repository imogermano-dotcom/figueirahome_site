import type { NextConfig } from "next";
import blogIndex from "./src/content/blog/index.json";

// Sem nonces (dynamic rendering em todas as páginas seria incompatível com o
// site estático + Cloudflare Worker de CPU limitada — ver AGENTS.md). 'unsafe-inline'
// cobre os scripts inline do GA4/Pixel/schema.org e o <style> injetado pelo widget.js.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://translate.google.com https://translate.googleapis.com https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://www.gstatic.com;
  img-src 'self' https: data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://translate.googleapis.com;
  frame-src 'self' https:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "figueirahome.pt" },
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // URLs do WordPress antigo que o Google ainda tem (Search Console, 2026-10-08:
  // 603 "404" + 214 "noindex"), e www → domínio canónico sem www.
  async redirects() {
    return [
      // `/` à parte: com :path* vazio o Next deixa ":path*" literal num destino externo.
      { source: "/", has: [{ type: "host", value: "www.figueirahome.pt" }], destination: "https://figueirahome.pt/", permanent: true },
      { source: "/:path+", has: [{ type: "host", value: "www.figueirahome.pt" }], destination: "https://figueirahome.pt/:path+", permanent: true },
      // Artigos do blog viviam na raiz (/<slug>/); agora em /blog/<slug>.
      ...blogIndex.map(({ slug }) => ({ source: `/${slug}`, destination: `/blog/${slug}`, permanent: true })),
      { source: "/:type(imovel|imovel-caracteristicas|imovel-tipo|imovel-cidade)/:path*", destination: "/imoveis", permanent: true },
      { source: "/:type(category|tag)/:path*", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true }
    ];
  }
};

export default nextConfig;
