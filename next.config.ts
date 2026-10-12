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

// Slug do WordPress antigo → página equivalente (artigos apagados vão para /blog).
const oldPages: Record<string, string> = {
  "a-qualidade-de-vida-na-europa-pelos-habitantes": "/blog",
  "agencias": "/consultores",
  "ana-daniel-aqui-esta-o-seu-ebook": "/servicos",
  "aquecimento-da-casa-quais-as-melhores-opcoes": "/blog",
  "avaliacao-de-imoveis-quanto-vale-a-minha-casa": "/blog",
  "bolor-e-fungos-riscos-para-a-saude-em-casa": "/blog",
  "casa-ou-apartamento-qual-escolher-em-portugal": "/blog",
  "casas-com-vista-mar-ou-rurais-a-venda-preferencias": "/blog",
  "como-comprar-a-primeira-casa-guia-essencial": "/blog",
  "como-poupar-dinheiro-ao-longo-da-vida": "/blog",
  "como-preparar-a-casa-para-ser-mostrada-para-visitas": "/blog",
  "como-tirar-boas-fotografias-com-o-seu-telemovel": "/blog",
  "como-vender-o-meu-imovel-sem-imobiliarias-em-portugal": "/blog",
  "comprar-casa-em-portugal-maioria-acima-de-150-000e": "/blog",
  "comprar-casa-para-arrendar-em-portugal-e-bom-negocio": "/blog",
  "comprar-ou-arrendar-na-figueira-da-foz-vale-a-pena": "/blog",
  "condicoes-de-contacto-via-whatsapp": "/politica-privacidade",
  "consultora-alexsandra-ferreira": "/consultores",
  "consultores": "/consultores",
  "contato": "/contacto",
  "contrato-de-arrendamento-dicas-essenciais-pre-assinatura": "/blog",
  "credito-habitacao-baixar-prestacao-em-2024": "/blog",
  "crescimento-das-imobiliarias-na-figueira-da-foz-fruto-da-procura-por-imoveis-nesta-zona": "/blog",
  "custo-de-arrendar-imovel-na-figueira-da-foz": "/blog",
  "desafios-na-habitacao-e-demografia-em-portugal": "/blog",
  "descentralizacao-urbana-portugueses-deixam-centros": "/blog",
  "descubra-os-melhores-lugares-para-viver-na-figueira-da-foz": "/blog",
  "despejos-protecao-reforcada-para-inquilinos-sociais": "/blog",
  "dicas-para-encontrar-a-casa-dos-seus-sonhos": "/blog",
  "ebook-guia-para-vender-o-seu-imovel-alexandra": "/servicos",
  "ebook-guia-para-vender-o-seu-imovel-ana-daniel": "/servicos",
  "em-que-consiste-o-simplex": "/blog",
  "empreendimento-bellevue": "/empreendimentos",
  "empreendimento-novo-na-quinta-dos-condados": "/empreendimentos",
  "formacao-no-mercado-imobiliario-a-sua-importancia": "/blog",
  "funil-de-vendas-no-imobiliario-estrategias-eficazes": "/blog",
  "guia-para-comprar-uma-casa-nova-com-sucesso": "/blog",
  "guia-para-escolher-sistema-de-aquecimento-domestico": "/blog",
  "guia-para-estrangeiro-comprarem-casa-em-portugal-credito-impostos-e-regalias-fiscais": "/blog",
  "guia-para-vender-o-seu-imovel": "/servicos",
  "guia-ser-fiador-ao-comprar-ou-arrendar-casa": "/blog",
  "imobiliaria": "/quem-somos",
  "imobiliario-em-portugal-ate-2025-o-que-esperar": "/blog",
  "imobiliária": "/quem-somos",
  "investir-em-imobiliario-tendencias-do-momento": "/blog",
  "isencao-do-imt-e-imposto-de-selo-condicoes": "/blog",
  "lina-galvao-aqui-esta-o-seu-ebook": "/servicos",
  "miguel-germano-aqui-esta-o-seu-ebook": "/servicos",
  "moradias-geminadas-a-escolha-para-a-familia": "/blog",
  "morar-em-casas-pequenas-desafio-de-vida-e-espaco": "/blog",
  "moratoria-do-credito-habitacao-como-vai-funcionar": "/blog",
  "o-que-e-uma-consolidacao-de-creditos-saiba-mais": "/blog",
  "o-que-os-estrangeiros-dizem-de-portugal-descubra": "/blog",
  "o-que-sao-as-aru-areas-de-reabilitacao-urbana-e-quais-as-vantagens-para-quem-quer-fazer-obras": "/blog",
  "obras-em-casa-o-que-saber-antes-de-comecar": "/blog",
  "paises-seguros-para-comprar-casa-portugal-destacado": "/blog",
  "politica-de-cookies": "/politica-cookies",
  "politica-de-privacidade": "/politica-privacidade",
  "porque-morar-na-figueira-da-foz-descobre-as-vantagens": "/blog",
  "procurar-imoveis": "/imoveis",
  "quanto-custa-mobilar-uma-casa-eis-os-precos-que-deves-conhecer": "/blog",
  "quinta-da-esperanca": "/empreendimentos",
  "rede-de-contactos-para-consultores-imobiliarios": "/recrutamento",
  "renove-a-cozinha-ideias-para-pintar-as-paredes": "/blog",
  "reparar-fissuras-na-parede-e-teto-truques-uteis": "/blog",
  "resolucao-alternativa-de-litigios": "/politica-privacidade",
  "seu-ebook-foi-enviado-para-o-seu-email": "/servicos",
  "simplex-urbanistico-2024-novidades-e-beneficios": "/blog",
  "testemunhos": "/quem-somos",
  "venda-o-seu-imovel": "/servicos"
};

const nextConfig: NextConfig = {
  images: {
    // O /_next/image não otimiza no Worker (devolve o original, sem Cache-Control)
    // e gasta CPU do Worker. As imagens de public/ já estão redimensionadas em WebP
    // e são servidas direto como ficheiros estáticos.
    unoptimized: true,
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
      // Imóveis antigos: /imovel/*, /imovel-cidade/*, /imóvel-características/* (com e sem acento).
      { source: "/:type(imovel|im%C3%B3vel|(?:imovel|im%C3%B3vel)-[^/]+)/:path*", destination: "/imoveis", permanent: true },
      { source: "/:type(category|tag)/:path*", destination: "/blog", permanent: true },
      // Paginação do WordPress (/blog/page/11/, /page/5/, /todos-os-imoveis/page/6/).
      { source: "/blog/page/:path*", destination: "/blog", permanent: true },
      { source: "/page/:path*", destination: "/", permanent: true },
      { source: "/todos-os-imoveis/:path*", destination: "/imoveis", permanent: true },
      { source: "/consultor/:path*", destination: "/consultores", permanent: true },
      // Páginas e artigos do WordPress que já não existem (Search Console 2026-10-12).
      ...Object.entries(oldPages).map(([from, to]) => ({ source: `/${encodeURIComponent(from)}`, destination: to, permanent: true })),
      { source: "/imobiliaria/:path*", destination: "/quem-somos", permanent: true },
      { source: "/imobili%C3%A1ria/:path*", destination: "/quem-somos", permanent: true },
      { source: "/:slug/feed", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/blog", permanent: true }
    ];
  }
};

export default nextConfig;
