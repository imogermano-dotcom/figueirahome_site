# AGENTS.md — Figueira Home

Handoff operacional. Reescrito em 2026-10-03 — estado consolidado num resumo único; incidentes resolvidos comprimidos ao essencial (o quê + porquê). Manter este ficheiro abaixo de 200 linhas; substituir informação ultrapassada em vez de acumular.

## Estado atual

- Site institucional e catálogo imobiliário: Next.js App Router, Supabase (Postgres/PostgREST), Cloudflare Workers (via OpenNext). Formulários de contacto, recrutamento (quiz + relatório de perfil por IA) e chat (widget externo do portal).
- Produção: `https://figueirahome.pt` e `https://www.figueirahome.pt` (Worker Custom Domains). Preview/backup: `https://figueira-home.miguel-germano.workers.dev` (`workers_dev: true`). Branch `teste/alteracao-cliente`, sem push p/ `origin`; último commit de código (redirects) a seguir ao `9b52ec7`. Último deploy: Version `0a93c7bb` (2026-10-08) — redirects 308 do WordPress antigo + `www` → apex, blog partido em índice + 1 JSON por artigo, `origem:"site"` em `contactos`.
- Site antigo (WordPress) continua vivo no VPS CloudPanel (`165.22.31.75`), só deixou de ser apontado pelo domínio. Email (MX Microsoft 365 + SendGrid), `cloudpanel.`, `lp.`, `sip.` — todos intocados.
- Dev local: `http://localhost:3000` (`npm run dev`, Turbopack). CSS/HMR preso em cache: matar processo na porta 3000, `rm -rf .next` (às vezes 2x), reiniciar. Mudar `next.config.ts` exige reiniciar o servidor.
- Deploy: `npm run deploy` (`opennextjs-cloudflare build && deploy`). Nunca usar Turbopack para produção.
- Segredos: `.env.local` local (gitignored) + `wrangler secret put <NOME>` em produção (nunca em `vars` do `wrangler.jsonc`). Nunca expor valores de Supabase/Anthropic/MailerLite/Cloudflare/Widget/eGO/Resend em texto. Chaves Supabase no formato novo `sb_publishable_...`/`sb_secret_...` (legacy JWT desligado em 2026-09-12; sem regressão verificada em 2026-09-17).
- `client-reference/` é gitignored — docs internos do cliente que nunca podem ficar em `public/`. `property-catalogue-local.png`, `tsconfig.tsbuildinfo` e alterações soltas em `next-env.d.ts` são locais, não commitar.

## Implementado

### Catálogo e fichas de imóvel
- Fonte runtime é a tabela `imoveis` (Supabase); só entram publicados, disponíveis, com referência e preço válidos. Dados (agente, área, WC, descrição, fotos) vêm do eGO — preenchimento não se corrige neste repo.
- SSR + fallback client-side (`PropertyDetailBrowserFallback`) quando o SSR não encontra o imóvel. `getPropertyBySlug` com `React.cache()` (evita 2 chamadas Supabase por pedido).
- Galeria: hero `object-cover`, lightbox `object-contain`, miniaturas `object-cover` (`object-fill` rejeitado por distorcer). Mapa só mostra zona/freguesia/concelho, nunca morada exacta.
- Vídeo (`property-video.tsx`): YouTube/Vimeo + qualquer outra URL https como iframe genérico (decisão de produto, relevante para a CSP).

### Contactos, recrutamento e leads
- 3 funis em produção: `/contacto` → `/api/leads`, ficha de imóvel → `/api/leads` (`source:"property_detail"`), recrutamento → `/api/recrutamento`. `createLead()` grava sempre em `contactos` (Pessoa do CRM eGO; sync unidirecional eGO→Supabase por scraper externo — nunca esperar roundtrip).
- `/api/recrutamento` grava em `recrutamento` + `contactos` (`tipo_contacto:["Recrutamento"]`) e faz upsert MailerLite por nível, registando o estado na linha de `recrutamento`.
- `contactos.tipo_contacto` (array, criado pelo cliente) preenchido a partir do `request_type` — mapa `REQUEST_TYPE_TO_TIPO_CONTACTO` (`src/lib/properties.ts`). `Senhorio`/`Procurador`/`investidor` por atribuir: nenhum formulário gera esses casos.
- `contactos.origem` = `"site"` gravado por `createLead()` e pelo insert em `contactos` de `/api/recrutamento` (desde 2026-10-08, verificado ao vivo em `/contacto` e `/recrutamento`). Sem constraint na coluna. Leads anteriores têm `origem` vazio — distinguir pelo array `tipos`. O chat (widget do portal) não grava em `contactos` por este repo.
- Quiz (`src/lib/recruitment.ts`, 10 perguntas, 0-30, 4 níveis): candidatura sem quiz deixa `pontuacao`/`nivel`/`quiz_respostas` `null`. Relatório por IA: `sendReport()` → `/api/quiz-report` → Anthropic → `quiz_reports` (token público RLS) → `/recrutamento/relatorio?t=...` → MailerLite. Confirmado ao vivo.
- Leads do `/servicos` ("Quero Vender", rota `/servicos`) disparam email para `miguel.germano@figueirahome.pt` via Resend (`src/lib/resend.ts`, `RESEND_API_KEY`/`RESEND_REMETENTE`; remetente `noreply@miguelgermano.com`, domínio verificado no Resend). Gate `request_type === "servicos"` em `createLead()`; falha de envio não bloqueia o lead.
- `/servicos` reescrito 2026-09-18 (9 etapas, leadbar de origem do comprador, grelha de 6 pessoas, secção `#preco`; imagens em `public/servicos/*.webp`). WhatsApp mantém-se `913 702 002` (o HTML do cliente trazia `928 318 953`, resíduo do subdomínio antigo — confirmado não mudar). Bandeiras via `next/font/google` `Noto_Color_Emoji` (Windows/Chrome sem fonte de emoji a cores mostra "PT"/"GB"). Flag `wide` dos `metrics` de cada `case` já corrigida.
- **Push para eGO** (`src/lib/ego.ts`, `PUT websiteapi.egorealestate.com/v1/Lead`, `EGO_LEAD_API_TOKEN`) só dispara na ficha de imóvel, com imóvel `publicado` e `ego_id` válido. A API do eGO **não valida o RID** nem faz dedupe — RID inválido cria "Pedido de Informação" órfão. `/contacto` e `/servicos` nunca enviam `property_id`, nunca tocam no eGO.
- Rate-limit Cloudflare (5 pedidos/10s por IP) cobre todos os `/api/*`.

### Chat
- Chat AI interno **removido**; widget externo (`public/widget.js`) fala com os agentes do `figueira-home-portal` (FastAPI/Fly.io, Supabase próprio) via `/api/site-chat` (proxy que injeta `X-Widget-Key`/`WIDGET_CHAT_SECRET`).

### Consentimento, analytics e legal
- Banner de cookies bloqueia GA4/Meta Pixel até "Aceitar" (`analytics-scripts.tsx`). Pixel ativo em produção (confirmado 2026-09-29, `PageView` chega à Meta).
- Evento `Lead`: `trackLead()` (`src/lib/track.ts`, no-op sem consentimento) dispara após resposta ok de `/api/leads` (`contact-form.tsx` — cobre `/contacto` e ficha de imóvel; `servicos/contact-form.tsx`) e `/api/recrutamento` (`recruitment-form.tsx`). Honeypot/erros não contam. Confirmado ao vivo em `/recrutamento` (2026-10-08: `ev=Lead` em `facebook.com/tr`, pixel `821222191626360`); `/contacto` e `/servicos` não testados com consentimento. Ao testar candidaturas: o formulário lê o quiz de `localStorage` (`quiz_perfil`), por isso um browser com quiz anterior grava pontuação sem o utilizador o repetir; a candidatura entra no MailerLite — apagar também o subscritor de teste.
- `/politica-privacidade` e `/politica-cookies` cobrem WhatsApp, profiling do quiz, Google Translate vs GA/Pixel. Emails de contacto: `geral@figueirahome.pt`.
- Footer (`video-footer.tsx`): imagem estática em vez de vídeo (pedido do cliente). `/recrutamento` usa `jumpToAnchor()` nas âncoras do footer (`scroll-behavior:smooth` falha em saltos muito longos, página ~23000px).

### Segurança e conteúdo
- Headers (`next.config.ts`): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Menu mobile fullscreen em `z-100`, acima do `MobileCtaBar` (`z-95`) em `/recrutamento` (`site-chrome.tsx`).
- Blog: 68 artigos, `src/content/blog/index.json` (metadados, 52KB) + `src/content/blog/posts/<slug>.json` (1 por artigo), ambos com import lazy em `src/lib/blog.ts`. Para editar/acrescentar um artigo: criar/editar o JSON do slug **e** a entrada no índice (sem `blocks`/`images`). Fontes via `next/font`; `.section-title`/`.hero-title` é o único override de fonte sans. Google Translate (pt/en/fr): `translate="no"` só no valor concreto, nunca no contentor.

### Monitorização
- UptimeRobot (free) **ativo** em `figueirahome.pt` (confirmado 2026-09-29). Falta 2º check no `figueira-home-portal` (Fly.io, provider diferente do Cloudflare) — fora deste repo.
- Notificação Cloudflare "Site em baixo" criada mas **inactiva**: plano `free` tem 0 Health Checks (precisa Pro). Activa-se sozinha quando o Health Check for criado (Traffic → Health Checks → `https://www.figueirahome.pt`).

## Ficheiros principais

- `src/lib/properties.ts` — consultas/filtros/mapeamento de `imoveis`, `createLead()`, `getPropertyBySlug`.
- `src/app/imoveis/[slug]/page.tsx` + `src/components/property-detail-browser-fallback.tsx` — ficha SSR e espelho client-side.
- `src/components/property-gallery.tsx` — hero/lightbox/miniaturas.
- `src/components/contact-form.tsx`, `src/components/servicos/contact-form.tsx`, `src/components/recruitment-form.tsx` — formulários (disparam `trackLead()`).
- `src/lib/track.ts`, `src/components/analytics-scripts.tsx` — Pixel/GA4 e evento `Lead`.
- `src/app/api/leads/route.ts`, `src/app/api/recrutamento/route.ts`, `src/app/api/quiz-report/route.ts` — endpoints de leads, candidatura e relatório por IA.
- `src/lib/recruitment.ts`, `src/app/recrutamento/relatorio/page.tsx` — quiz, pontuação, relatório.
- `src/lib/mailerlite.ts`, `src/lib/resend.ts`, `src/lib/ego.ts` — MailerLite, email de leads do `/servicos`, push eGO.
- `public/widget.js` + `src/app/api/site-chat/route.ts` — chat + proxy protegido.
- `src/lib/supabase.ts` — clientes Supabase (browser/service/public-server).
- `src/components/site-chrome.tsx` — nav + menu mobile; `src/components/recruitment/` — `mobile-cta-bar.tsx` e restante UX de conversão do `/recrutamento`.
- `next.config.ts` — headers de segurança. `src/app/globals.css` — design tokens; `.recruitment-page` (`--r-*`).
- `.impeccable/config.json` — supressões do detector de design (commitado, sem segredos).

## Decisões arquiteturais

- Nunca `import` estático de JSON/dados grandes no top-level de ficheiros partilhados pelo bundle do Worker — usar `await import()` preguiçoso (causou 503 por CPU-limit em cold start).
- Rotas server-side: Zod valida → lógica → `fetch` directo a APIs externas (nunca SDKs pesados no bundle do Worker).
- `React.cache()` quando uma rota chama a mesma query em `generateMetadata` e no componente.
- `NEXT_PUBLIC_*` ficam **gravadas no bundle no build** — mudar `.env.local` não chega, é preciso `npm run deploy`. Secrets (`wrangler secret put`) aplicam-se em runtime, sem rebuild.
- CSP sem nonces (exigiriam dynamic rendering, incompatível com o Worker de CPU limitada): `script-src`/`style-src` com `'unsafe-inline'` + allowlist (GA4, Pixel, Google Translate, widget). `img-src`/`frame-src` largos (`https:`) de propósito — fotos do CDN do eGO e vídeo com iframe https arbitrário.
- `quiz_reports`: sem unique em `email`, `/api/quiz-report` sempre `insert()` — repetir o quiz gera relatório+token novos (confirmado com o cliente 2026-09-17; não mudar para upsert sem pedido). Leitura pública por token via RLS, sem política de INSERT (só `service_role` escreve).
- Segredos partilhados com serviços externos: header próprio (`X-Widget-Key`) com comparação constant-time — nunca confiar em CORS sozinho.
- Analytics só após consentimento explícito — exigência legal.
- Sem CMS: blog estático, catálogo runtime Supabase. `imovel_ref` é a referência pública mais fiável. Não existe tabela de agentes: responsáveis derivam de `angariador`/`vendedor` + `figueiraTeam`.
- **Runbook — "CPU time limit"**: `npx wrangler tail figueira-home --format pretty`; `npx wrangler deployments list --name figueira-home` + `npx wrangler rollback --version-id <id>` repõem a version anterior.

## Bugs conhecidos e dívida técnica

- **CRÍTICO — `contactos` e `imoveis` sem Row Level Security.** Chave `anon` pública lê as duas tabelas na íntegra (inclui dados pessoais de leads e candidatos). Migração pronta (`supabase/migrations/20260831210000_rls_contactos_imoveis.sql`) **NÃO APLICADA**: `figueira-home-portal` (repo externo) usa a mesma `anon` no browser. Correção: portal passar a `service_role`/auth própria — decisão do cliente. Estado de RLS da tabela `recrutamento` por verificar.
- Cold-start CPU-limit (erro 1102, 503 em todo o site) já aconteceu 2x: 2026-09-11 (rollback + dedupe) e 2026-10-08 (~25 min em baixo, rajada de 126 pedidos a artigos do blog; cada isolate frio fazia parse do `blog-archive.json` de 3,2MB; resolvido por rollback + divisão do blog). Provável origem dos erros 5xx no Search Console. Pode voltar noutra rota — ver runbook. **Nunca correr loops/rajadas de pedidos contra produção**; testar com pedidos espaçados + `wrangler tail`.
- SEO / Search Console (propriedade de domínio `figueirahome.pt`, 2026-10-08): 603 "404" + 214 "noindex" são URLs do WordPress antigo (artigos na raiz `/<slug>/`, `/imovel/*`, `/imovel-caracteristicas|tipo|cidade/*`, `/category/*`, `/tag/*`); só 1 erro 5xx. `redirects()` em `next.config.ts` (308): `www` → apex, os 68 artigos `/<slug>` → `/blog/<slug>`, `/imovel*` → `/imoveis`, `/category|tag` e `/feed` → `/blog`. Em URLs com `/` final há 2 saltos (o Next tira a barra primeiro). Armadilha: `:path*` vazio fica literal num destino externo (`www/` dava 404) — usar `/` explícito + `:path+`; um deploy com isto foi revertido e corrigido. Os 404/noindex só saem do relatório quando o Google recrastrear; falta clicar "Validar correção" no Search Console (feito por humano). Por ver: 38 "alternativa com canonical", 13 redirect, 2 soft 404, 1 erro 4xx, 174 "rastreada, não indexada". `lastmod` do sitemap é sempre "agora".
- Fallback do eGO para RID inválido imprevisível — confirmar com suporte eGO.
- QA mobile só por revisão de código; Claude-in-Chrome não emula viewport mobile (`resize_window` preso ao estado maximizado). Confirmar `/recrutamento` (`MobileCtaBar`) num telemóvel real.
- Favicon em falta (404): precisa de asset dedicado do cliente/designer.
- Opt-out "PARAR" prometido na política de privacidade (§9) sem implementação no agente WhatsApp (repo externo).
- Testemunhos da homepage ("Ana Carvalho", "Ricardo Silva", "Luísa Monteiro") por confirmar se são reais/autorizados ou placeholder.
- 6 leads de teste no eGO CRM (`Teste eGO QA`, `Teste eGO QA2`, `Teste eGO Direto`, `Teste Node Fetch`, `Teste RID Invalido`, `Teste RID Invalido 2`) — sem endpoint de delete, apagar na UI do eGO.

## Próximos passos

1. (Opcional) Confirmar `ev=Lead` também em `/contacto` e `/servicos` com cookies aceites; `/servicos` envia email ao Miguel.
2. Decidir com o cliente o futuro do `figueira-home-portal` (`anon` → `service_role`) para aplicar a migração RLS; verificar RLS de `recrutamento`.
3. Mensagem única ao cliente com pendentes: RLS/portal, testemunhos, opt-out "PARAR", favicon.
4. QA mobile num telemóvel físico (`/recrutamento`, `MobileCtaBar`).
5. Confirmar com suporte eGO o fallback para RID inválido.
6. 2º check de uptime no `figueira-home-portal`; push da branch / merge para `main` quando o cliente aprovar.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
