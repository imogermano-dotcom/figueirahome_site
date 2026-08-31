# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-08-29. Manter este ficheiro abaixo de 200 linhas e substituir informação ultrapassada.

## Estado atual

- Site institucional e catálogo imobiliário em Next.js App Router, Supabase, Cloudflare Workers, contactos, recrutamento e chat AI.
- Produção: `https://figueira-home.miguel-germano.workers.dev` (Worker `figueira-home`). Último deploy validado: `a8373bf2-0fe9-4c56-ae74-5dab510ac398`, em 2026-08-28 (commit `cd060f9`).
- Branch: `teste/alteracao-cliente`. HEAD local em `cd060f9`; nada por commitar (só `next-env.d.ts` modificado por tooling e os ficheiros locais fora de escopo abaixo).
- Servidor local: `http://localhost:3000` (`npm run dev`, Turbopack). Bug recorrente: CSS compilado fica preso em cache e HMR não aplica edições a `globals.css`/CSS scoped — ver "Bugs conhecidos".
- Produção usa `npm run deploy` (`opennextjs-cloudflare build && deploy`); não usar Turbopack para produção.
- Nunca expor valores de `.env.local` ou segredos Supabase, AI, MailerLite e Cloudflare.
- `property-catalogue-local.png` e `tsconfig.tsbuildinfo` são ficheiros locais fora do escopo, não commitar.

## Implementado

### Cookie consent + analytics (GA4/Meta Pixel) — IDs configurados, deploy feito

- `src/lib/consent.ts`: `localStorage` (`fh_cookie_consent`) + `CustomEvent` (`cookie-consent-change`, `cookie-consent-reopen`) para banner, loader de scripts e link do rodapé comunicarem sem prop-drilling.
- `src/components/cookie-consent-banner.tsx`: banner fixo, "Aceitar"/"Rejeitar", nomeia GA e Meta Pixel, liga para `/politica-cookies`.
- `src/components/analytics-scripts.tsx`: só renderiza scripts (`next/script`) se `NEXT_PUBLIC_GA_MEASUREMENT_ID`/`NEXT_PUBLIC_META_PIXEL_ID` estiverem definidos **e** consentimento = `"accepted"`. Sem IDs, não carrega nada (infraestrutura inerte).
- `src/components/cookie-preferences-link.tsx`: botão "Preferências de Cookies" no rodapé (`video-footer.tsx`), reabre o banner sem tornar o footer client component.
- Ambos montados em `src/app/layout.tsx`.
- GA4 (`G-78MN2SQB9J`) e Meta Pixel (`821222191626360`) do cliente recebidos 2026-08-31. `NEXT_PUBLIC_*` são build-time only (client bundle) — bastou meter em `.env.local` e `npm run deploy`, sem vars/secrets no Worker. Deployado em produção, version `21d935a0-a95d-4cb5-8ef4-2d5b65439b5b`.

### Página de recrutamento

- Ecrã de resultado do quiz agora tem: barra de progresso (`score/30`), pill "O teu resultado", e mini-formulário de email para receber relatório (`src/components/recruitment-form.tsx`, `sendReport()` → `/api/leads` com `request_type: "recrutamento_relatorio"`).
- Botão "Refazer questionário" com fundo branco, hover dourado (antes era link sublinhado simples).
- Paleta `--r-*` do `.recruitment-page` realinhada em HSL para bater com `--navy`/`--gold` reais do site (antes tinha hue/saturação diferentes, mais roxo).

### Homepage e contactos WhatsApp

- Hero da homepage usa foto real (`public/foto fundo.jpg`) em vez de vídeo; o vídeo do rodapé (`video-footer.tsx`) mantém-se inalterado.
- Todos os botões de WhatsApp com fundo branco ficam verdes (`#25d366`) no hover (`.btn-whatsapp:hover` em `globals.css`).
- Páginas de consultores (`/consultores/[slug]`): CTA principal passou a "Ligar a [nome]" quando há telefone; botão WhatsApp adicional via `wa.me/<telefone sem símbolos>`.
- Ficha de imóvel (`imoveis/[slug]/page.tsx` e o fallback client-side `property-detail-browser-fallback.tsx`, mantidos em espelho): card "Agente responsável" ganhou foto do agente, telefone como link `tel:`, e botão WhatsApp.
- `src/lib/team.ts`: telefone/email adicionados para Sandra Silva, Alexsandra Ferreira, Alexandra Santos. Sofia Monteiro e Giulia Almeida continuam sem contacto — confirmado pelo cliente, não são consultoras.

### Fontes (fix definitivo)

- Causa raiz encontrada: `.section-title` (usada quase em todo o site, incl. "X imóveis associados" nos consultores) nunca tinha override de `font-family`, herdando a serifada `h1-h4`. Corrigido fundindo a regra na declaração partilhada `.section-title, .hero-title { font-family: var(--font-body)... }` em `globals.css` — resolve de vez sem patches por página.
- `/servicos`: `--ff-display` corrigido para `var(--font-body)` (sans, igual ao resto do site); primeira tentativa (serifada) estava errada, confirmado por comparação visual do cliente.
- `.legal-page h1/h2/h3` adicionado ao grupo de override sans (usado em `/politica-privacidade` e `/politica-cookies`).

### Política de privacidade e cookies

- Email `lidia.sousa@ondaveloz.pt` → `geral@figueirahome.pt`. Também trocado `geral.figueirahome@gmail.com` → `geral@figueirahome.pt` em `team.ts`, `video-footer.tsx`, `contacto/page.tsx`.
- Revisão feita contra RGPD/Lei 58/2019/Lei 41/2004 (pesquisa web, ago/2026) — consentimento prévio obrigatório antes de cookies não essenciais, confirmado.
- Secção 8 ("Os seus direitos") ganhou frase sobre opt-out de processamento automatizado/profiling (relevante para o scoring do quiz de recrutamento).
- Nova secção 9 "Contacto via WhatsApp" (base legal, retenção, opt-out via "PARAR"). Estas duas peças vieram de comparação com a política externa do cliente em `figueirahome.pt/politica-de-privacidade/` — só estas duas, resto da política externa era boilerplate desatualizado (WordPress GDPR plugin, TODOs visíveis) e foi ignorado por pedido explícito.
- `/politica-cookies` secção 5 nomeia explicitamente Google Translate (necessário) vs GA/Meta Pixel (consentimento).

### Blog e conteúdo editorial

- Arquivo importado com 68 artigos completos e 190 imagens em `src/content/blog-archive.json` e `public/blog/archive/`.
- Tabelas extraídas do PDF são reconstruídas por heurística (`mergeBlogTableBlocks`/`toBlogTable` em `src/lib/blog.ts`).

### Catálogo, homepage e equipa

- A fonte runtime é `imoveis`; só entram imóveis publicados, disponíveis, com referência válida e preço positivo. Dev e produção usam Supabase real.
- Quando o SSR não encontra o imóvel, `PropertyDetailBrowserFallback` recupera os dados via Supabase público no browser.
- O mapa usa apenas zona/freguesia/concelho; nunca publica morada, número ou código-postal.
- Google Translate (pt/en/fr): valores frágeis (certificado energético, cargo) usam `translate="no"`; prosa (`Estado`) traduz normalmente.

### `/contacto` e `/api/leads`

- Confirmado end-to-end em produção (teste real, criado e apagado via Supabase REST com service-role key): `/contacto` → `ContactForm` → `/api/leads` (Zod `LeadSchema`) → `createLead()` grava mesmo na tabela `contactos`, sem cair no fallback `local-fallback`.

## Ficheiros principais

- `src/lib/properties.ts`: consultas, filtros, mapeamento de `imoveis`, fallback e visita virtual.
- `src/app/imoveis/[slug]/page.tsx` + `src/components/property-detail-browser-fallback.tsx`: ficha SSR e espelho client-side.
- `src/components/hero-experience.tsx`: hero da homepage (agora foto, não vídeo).
- `src/components/video-footer.tsx`: rodapé com vídeo (inalterado) + link de preferências de cookies.
- `src/components/recruitment-form.tsx`: quiz de recrutamento + relatório por email.
- `src/lib/team.ts`: equipa, contactos, bios, fotos.
- `src/lib/consent.ts`, `src/components/cookie-consent-banner.tsx`, `src/components/analytics-scripts.tsx`, `src/components/cookie-preferences-link.tsx`: infra de consentimento + GA/Pixel.
- `src/app/globals.css`: design tokens; `.section-title`/`.hero-title` (fonte sans partilhada), `.btn-whatsapp:hover` (verde), paleta `.recruitment-page`.
- `.impeccable/config.json`: supressões do detector de design (commitado — `side-tab`/`gradient-text` ignorados só em `src/app/servicos/servicos.css`, confirmado como cópia literal do CSS de produção do cliente).

## Decisões arquiteturais

- Analytics (GA4/Meta Pixel) só carregam depois de consentimento explícito no banner — exigência legal (Lei 41/2004 art. 5º), não opcional de UX.
- `.section-title` é o ponto único de override de fonte para títulos sans — não voltar a duplicar por página.
- `.impeccable/config.json` é commitado (sem segredos); `.impeccable/hook.cache.json` fica fora do git (cache local).
- Não há CMS nesta fase. O blog é estático e o catálogo é runtime Supabase.
- `imovel_ref` é a referência pública mais fiável para resolver fichas; slug continua compatível por razões de URL/indexação.
- Não existe tabela dedicada de agentes: responsáveis derivam de `angariador`/`vendedor`, enriquecidos por `figueiraTeam`/`sampleAgents`.
- `translate="no"` só no valor concreto (código/nome próprio), nunca no contentor inteiro.

## Bugs conhecidos e dívida técnica

- **Turbopack dev server**: CSS compilado fica preso em cache, HMR não aplica edições. Fix quando acontece: matar processo (`netstat` p/ PID, `taskkill`), `rm -rf .next` (às vezes 2x), reiniciar `npm run dev`, confirmar via `curl` no chunk `.css` compilado.
- Tabela "Ano/Alteração/Impacto" do artigo de heranças no blog foi corrigida; outras tabelas do mesmo artigo (testamentos, aceitação de herança, impostos) ainda por validar contra o original.
- Auditoria 2026-08-31 (Supabase, catálogo live = `publicado=true`+`disponibilidade="Disponível"`, só **54 de 4464** imóveis): 2 sem agente (`FH2571`, `FH2483_C`), 19 sem WC, 11 sem área, 1 sem descrição, 50 sem plantas (opcional), 28 sem vídeo (opcional), fotos ok. Sandra Silva com 0 imóveis live (31 no total da tabela, nenhum publicado/disponível).
- **Fonte destes dados é o eGO** (`ego_id`/`fonte` na tabela `imoveis`) — atribuição de agente e preenchimento de área/WC/descrição fazem-se lá, não neste repo. Site só espelha o que o eGO sincroniza.
- Confirmar se `message`/`property_id` são persistidos em `contactos`; schema local e migrations remotas podem divergir.
- QA visual desta sessão foi sobretudo desktop; mobile/tablet por validar.

## Próximos passos

1. Validar restantes tabelas do artigo de heranças no blog; avaliar se outros dos 68 artigos têm o mesmo problema.
2. QA responsivo (mobile/tablet).
