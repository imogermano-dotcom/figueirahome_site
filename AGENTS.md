# AGENTS.md — Figueira Home

Handoff operacional. Reescrito em 2026-09-10 — estado atual consolidado num resumo único, narrativa de fixes já resolvidos comprimida ao essencial (o quê + porquê, sem o passo-a-passo de debugging). Manter este ficheiro abaixo de 200 linhas; substituir informação ultrapassada em vez de acumular.

## Estado atual

- Site institucional e catálogo imobiliário: Next.js App Router, Supabase (Postgres/PostgREST), Cloudflare Workers (via OpenNext). Formulários de contacto, recrutamento (quiz + relatório de perfil por IA) e chat (widget externo do portal).
- Produção: `https://figueirahome.pt` e `https://www.figueirahome.pt` (Worker Custom Domains). Preview/backup: `https://figueira-home.miguel-germano.workers.dev` (`workers_dev: true` em `wrangler.jsonc`). HEAD: `9460253` (branch `teste/alteracao-cliente`). Último deploy: Version `ae040fa8` (2026-09-12) — migração das chaves Supabase legacy (JWT) para o novo formato `sb_publishable_`/`sb_secret_` (ver "Segredos").
- Site antigo (WordPress) continua vivo no VPS CloudPanel (`165.22.31.75`), só deixou de ser apontado pelo domínio. Email (MX Microsoft 365 + SendGrid), `cloudpanel.`, `lp.`, `sip.` — todos intocados.
- Dev local: `http://localhost:3000` (`npm run dev`, Turbopack). Bug recorrente: CSS/HMR fica preso em cache — fix: matar processo na porta 3000, `rm -rf .next` (às vezes 2x), reiniciar. Mudar `next.config.ts` exige sempre reiniciar o servidor (não recarrega sozinho).
- Deploy: `npm run deploy` (`opennextjs-cloudflare build && deploy`). Nunca usar Turbopack para produção.
- Segredos: `.env.local` local (gitignored) + `wrangler secret put <NOME>` para produção (nunca em `vars` do `wrangler.jsonc`). Nunca expor valores de Supabase/Anthropic/MailerLite/Cloudflare/Widget/eGO em texto.
- **Chaves Supabase (2026-09-12): migradas de JWT legacy para o novo formato `sb_publishable_...`/`sb_secret_...`** (cliente desligou as chaves antigas). `SUPABASE_SERVICE_ROLE_KEY` é secret do Worker (`wrangler secret put`, runtime, sem rebuild necessário). `NEXT_PUBLIC_SUPABASE_ANON_KEY` fica **gravada no build** (inlined pelo Next em build-time) — mudar `.env.local` sozinho não basta, é preciso `npm run deploy` para o valor novo ir para produção. Sintoma quando a chave expira/desliga: `/imoveis` fica vazio sem erro visível no browser (Supabase devolve 401, código trata como "sem resultados"). Diagnóstico rápido: `curl` directo ao REST do Supabase com a chave (`.../rest/v1/imoveis?select=...`) — 401 com mensagem "Legacy API keys are disabled" confirma.
- `client-reference/` é gitignored — docs internos do cliente (briefings, PDFs) que nunca podem ficar em `public/`. `property-catalogue-local.png` e `tsconfig.tsbuildinfo` são ficheiros locais fora de escopo, não commitar.

## Implementado

### Catálogo e fichas de imóvel
- Fonte runtime é a tabela `imoveis` (Supabase); só entram publicados, disponíveis, com referência e preço válidos. Dados (agente, área, WC, descrição, fotos) vêm do eGO (`images.egorealestate.com`) — preenchimento não se corrige neste repo.
- SSR normal + fallback client-side (`PropertyDetailBrowserFallback`) quando o SSR não encontra o imóvel.
- Foto principal (hero, `property-gallery.tsx`) usa `object-cover` (corte ligeiro, normal p/ preview) + lightbox usa `object-contain` (foto sempre inteira, margem preta se a proporção não bater — convenção padrão de visualizador de fotos). Testado `object-fill` (esticar) e rejeitado por distorcer. Miniaturas usam `object-cover`. Mapa só mostra zona/freguesia/concelho, nunca morada exacta.
- Vídeo de imóvel (`property-video.tsx`, `videoSourceFromUrl()`) reconhece YouTube/Vimeo e aceita qualquer outra URL https como iframe genérico — decisão de produto existente, relevante para a CSP (ver "Segurança").

### Contactos, recrutamento e leads
- 3 funis confirmados end-to-end em produção: `/contacto` → `/api/leads`, ficha de imóvel → `/api/leads` (`source:"property_detail"`), candidatura de recrutamento → `/api/recrutamento`. `createLead()` grava sempre em `contactos` (tabela de Pessoa do CRM eGO, sync unidirecional eGO→Supabase por scraper externo — nunca escrever à espera de roundtrip).
- Quiz de recrutamento (`src/lib/recruitment.ts`, 10 perguntas, pontuação 0-30, 4 níveis): candidatura sem quiz deixa `pontuacao`/`nivel`/`quiz_respostas` `null` (colunas nullable desde migração `20260904000000` — antes fabricava respostas fictícias que davam sempre o nível mais alto). Relatório de perfil por IA (`sendReport()` → `/api/quiz-report` → Anthropic → `quiz_reports` com token público RLS → `/recrutamento/relatorio?t=...` → upsert MailerLite por nível) confirmado ao vivo (email entregue/aberto/clicado).
- **Push para eGO** (`src/lib/ego.ts`, `PUT websiteapi.egorealestate.com/v1/Lead`, secret `EGO_LEAD_API_TOKEN`) só dispara na ficha de imóvel, com o imóvel `publicado` e `ego_id` válido — gate nosso, não do eGO. Confirmado ao vivo: a API do eGO **não valida o RID** (aceita qualquer valor, sempre `Success:true`) e **não faz dedupe**. Um RID inválido cria um "Pedido de Informação" órfão com destino imprevisível — testado 2x, cada vez caiu numa pessoa diferente sem ligação óbvia ao token da API; mecanismo real de fallback por confirmar junto do suporte eGO. `/contacto` e `/servicos` nunca enviam `property_id`, por isso nunca tocam no eGO — por definir com o cliente o que fazer a esses.
- Rate-limit Cloudflare (5 pedidos/10s por IP) cobre todos os endpoints `/api/*`.

### Chat
- Chat AI interno foi **removido** — substituído pelo widget externo do cliente (`public/widget.js`, autocontido, monta bolha+painel via JS puro), que fala com os agentes do `figueira-home-portal` (FastAPI/Fly.io, Supabase próprio). Passa por `/api/site-chat` (proxy neste Worker) que injeta o header secreto `X-Widget-Key`/`WIDGET_CHAT_SECRET` — esconde URL e chave do browser, reaproveita a rate-limit de `/api/*`.

### Consentimento, analytics e legal
- Banner de cookies bloqueia GA4/Meta Pixel até "Aceitar" — verificado. `/politica-privacidade` e `/politica-cookies` cobrem WhatsApp, profiling do quiz, Google Translate vs GA/Pixel. Emails de contacto uniformizados para `geral@figueirahome.pt`.
- Footer (`video-footer.tsx`): vídeo de fundo substituído por imagem estática, pedido do cliente. Botões de âncora do footer em `/recrutamento` usam `jumpToAnchor()` (scroll instantâneo via JS) porque `scroll-behavior:smooth` global falha em silêncio em saltos muito longos (página tem ~23000px) — os links "curtos" internos (`recruitment-form.tsx`, `mobile-cta-bar.tsx`) continuam com scroll suave nativo, risco teórico não reportado.

### Segurança
- **Headers de segurança** (`next.config.ts`, `headers()`, 2026-09-09): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Testado ao vivo (local + produção) sem violações CSP. Ver "Decisões arquiteturais" para a lógica da política.
- Fix de z-index: `MobileCtaBar` (`z-95`) ficava por cima do menu mobile fullscreen (`z-80`) em `/recrutamento`; menu subiu para `z-100` (`site-chrome.tsx`).

### Conteúdo e design
- Blog: 68 artigos em `src/content/blog-archive.json` (import lazy, ver "Decisões"), tabelas verificadas contra o PDF original.
- Fontes via `next/font` (self-hosted, sem dependência externa). `.section-title`/`.hero-title` é o único ponto de override de fonte sans, usado em todo o site.
- Google Translate (pt/en/fr): `translate="no"` só no valor concreto (código energético, cargo), nunca no contentor.

## Ficheiros principais

- `src/lib/properties.ts` — consultas/filtros/mapeamento de `imoveis`.
- `src/app/imoveis/[slug]/page.tsx` + `src/components/property-detail-browser-fallback.tsx` — ficha SSR e espelho client-side.
- `src/lib/recruitment.ts`, `src/components/recruitment-form.tsx` — quiz, pontuação, candidatura.
- `src/app/api/quiz-report/route.ts`, `src/app/recrutamento/relatorio/page.tsx` — relatório de perfil por IA.
- `src/components/recruitment/scroll-progress.tsx`, `mobile-cta-bar.tsx` — UX de conversão do `/recrutamento`.
- `src/lib/mailerlite.ts` — upsert de subscriber (usado por `/api/recrutamento` e `/api/quiz-report`).
- `src/lib/ego.ts` — push de lead para o eGO.
- `public/widget.js` + `src/app/api/site-chat/route.ts` — widget de chat + proxy protegido.
- `src/lib/supabase.ts` — clientes Supabase (browser/service/public-server).
- `src/components/site-chrome.tsx` — nav + menu mobile (z-index partilhado com `MobileCtaBar`, ver "Segurança").
- `next.config.ts` — headers de segurança (CSP e restantes).
- `src/app/globals.css` — design tokens; `.recruitment-page` (`--r-*`) para toda a área de recrutamento.
- `.impeccable/config.json` — supressões do detector de design (commitado, sem segredos).

## Decisões arquiteturais

- Nunca `import` estático de JSON/dados grandes no top-level de ficheiros partilhados pelo bundle do Worker — usar `await import()` preguiçoso (causou 503 por CPU-limit em cold start).
- Rotas server-side seguem sempre: Zod valida → lógica → `fetch` directo a APIs externas (nunca SDKs pesados no bundle do Worker, ex. Anthropic/MailerLite via `fetch` puro).
- CSP sem nonces: nonces exigiriam dynamic rendering em todas as páginas, incompatível com o Worker de CPU limitada (mesma razão do ponto anterior). Em vez disso, `script-src`/`style-src` usam `'unsafe-inline'` + allowlist de domínios enumerados por auditoria de código (GA4, Pixel, Google Translate, widget de chat). `img-src`/`frame-src` ficam largos (`https:`) de propósito — fotos vêm de CDN do eGO (não Supabase) e o vídeo de imóvel já aceita qualquer iframe https por design.
- Relatórios públicos partilháveis por link (`quiz_reports`) usam RLS "leitura pública por token" em vez de autenticação — sem política de INSERT, só `service_role` escreve.
- Segredos partilhados com serviços externos usam header próprio (`X-Widget-Key`) com comparação constant-time — nunca confiar em CORS sozinho.
- Analytics só carregam depois de consentimento explícito — exigência legal, não opcional de UX.
- Não há CMS; blog é estático, catálogo é runtime Supabase. `imovel_ref` é a referência pública mais fiável para resolver fichas. Não existe tabela de agentes: responsáveis derivam de `angariador`/`vendedor` + `figueiraTeam`.

## Bugs conhecidos e dívida técnica

- **Outage 2026-09-11 16:14-16:35 — CPU time limit em quase todo o site** (`/`, `/imoveis`, `/imoveis/[slug]`, `/blog`, `/recrutamento`, `/quem-somos` todos 503; só `/servicos` ok). Reproduzido também no preview URL (não era DNS/CDN); Supabase respondia rápido (não era lentidão externa). Causa não confirmada — diff no momento era só CSS de fotos, não explica falha em páginas que nem usam esse componente. Resolvido com `wrangler rollback` para a version anterior (`6b3ae8ee`), depois redeploy com fix aplicado (`React.cache()` em `getPropertyBySlug`, que corria 2x por pedido em `/imoveis/[slug]` — `generateMetadata` + página). Padrão intermitente confirmado por `wrangler tail` mesmo depois do redeploy (1 erro isolado em `/imoveis/fh2283-fw?ref=...`, não reproduzível em pedidos manuais a seguir) — consistente com o cold-start CPU-limit já documentado, não 100% eliminado pelo fix. Se voltar a acontecer: `npx wrangler tail figueira-home --format pretty` para apanhar em tempo real, `npx wrangler deployments list --name figueira-home` + `npx wrangler rollback --version-id <id>` para repor rápido.
- **CRÍTICO, por resolver — `contactos` e `imoveis` sem Row Level Security.** Chave `anon` pública lê as duas tabelas na íntegra. Migração pronta (`supabase/migrations/20260831210000_rls_contactos_imoveis.sql`) — **NÃO APLICADA**: bloqueada porque `figueira-home-portal` (repo externo) usa a mesma chave `anon` directamente do browser. Correção real: portal passar a usar `service_role`/auth própria — decisão do cliente.
- Fallback do eGO para RID inválido é imprevisível (ver "Contactos, recrutamento e leads") — confirmar mecanismo real junto do suporte eGO.
- QA mobile: revisão de código feita (achou e corrigiu o bug de z-index), mas sem confirmação visual ao vivo — Claude-in-Chrome não consegue emular viewport mobile neste ambiente (`resize_window` fica preso ao estado maximizado da janela, confirmado via `window.outerWidth`). Confirmar `/recrutamento` (`MobileCtaBar`) num telemóvel real.
- Favicon em falta (404): ícone da marca fundido com o texto no logo, sem recorte quadrado limpo — precisa de asset dedicado do cliente/designer.
- Opt-out "PARAR" prometido na política de privacidade (§9) sem implementação no backend do agente WhatsApp (repo externo) — decisão de quem implementa fica com o cliente.
- Testemunhos da homepage ("Ana Carvalho", "Ricardo Silva", "Luísa Monteiro") por confirmar com o cliente se são reais/autorizados ou placeholder.
- `.env.local` tem `SUPABASE_SERVICE_ROLE_KEY` ainda no formato JWT antigo (desligado) — só afecta `npm run dev` local (queries com service role falham localmente); produção usa o secret novo do Worker, já correcto. Trocar por um `sb_secret_...` quando o cliente partilhar.
- 6 leads de teste ficaram no eGO CRM (`Teste eGO QA`, `Teste eGO QA2`, `Teste eGO Direto`, `Teste Node Fetch`, `Teste RID Invalido`, `Teste RID Invalido 2`) — API não tem endpoint de delete, apagar manualmente na UI do eGO.

## Monitorização

- Notificação Cloudflare "Site em baixo" já criada (Manage account → Notifications, tipo "Health Checks status notification", emails miguel.germano@gmail.com + jm.workflow2024@gmail.com, dispara em fica saudável/não saudável, "include future healthchecks" ligado) — **mas inactiva**: o plano `free` da zona `figueirahome.pt` inclui 0 Health Checks (precisa Pro). Se/quando fizer upgrade, só falta criar o Health Check em si (Traffic → Health Checks, apontar a `https://www.figueirahome.pt`) que a notificação já o apanha automaticamente.
- Alternativa combinada decidida com o cliente (2026-09-11): UptimeRobot (free, externo) por agora; segundo check a construir no `figueira-home-portal` (Fly.io, provider diferente = mais independente) — por fazer, fora deste repo.

## Próximos passos

1. QA responsivo mobile num telemóvel físico real (`/recrutamento` e `MobileCtaBar` em particular).
2. Decidir com o cliente o futuro do `figueira-home-portal` (trocar `anon` por `service_role`) para poder aplicar a migração RLS com segurança.
3. Confirmar junto do suporte eGO o mecanismo real de fallback para RID inválido.
4. Favicon dedicado quando houver asset do cliente.
5. Confirmar com o cliente: testemunhos da homepage (reais?) e quem implementa o opt-out "PARAR" do WhatsApp.
6. Configurar UptimeRobot (free) a apontar a figueirahome.pt; construir 2º check no figueira-home-portal.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
