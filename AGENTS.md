# AGENTS.md — Figueira Home

Handoff operacional. Reescrito em 2026-09-05 — secção de estado consolidada, histórico de fixes já resolvidos removido. Manter este ficheiro abaixo de 200 linhas; substituir informação ultrapassada em vez de acumular.

**2026-09-09**: headers de segurança implementados (`421d3e8`); fix z-index menu mobile (`be7aa4c`); correção sobre fallback de RID inválido no eGO (`b394bf6`). HEAD ainda não deployado — só código local + commits, sem `npm run deploy` nesta sessão.

## Estado atual

- Site institucional e catálogo imobiliário: Next.js App Router, Supabase (Postgres/PostgREST), Cloudflare Workers (via OpenNext). Formulários de contacto, recrutamento (com quiz + relatório de perfil por IA) e chat (widget externo do portal).
- Produção: `https://figueirahome.pt` e `https://www.figueirahome.pt` (Worker Custom Domains). Preview/backup: `https://figueira-home.miguel-germano.workers.dev` (`workers_dev: true` em `wrangler.jsonc`). HEAD: `828b285` (branch `teste/alteracao-cliente`). Último deploy: Version `2d08ce3b` (2026-09-03) — footer de `/recrutamento` (imagens + botões).
- Site antigo (WordPress) continua vivo no VPS CloudPanel (`165.22.31.75`), só deixou de ser apontado pelo domínio. Email (MX Microsoft 365 + SendGrid), `cloudpanel.`, `lp.`, `sip.` — todos intocados.
- Dev local: `http://localhost:3000` (`npm run dev`, Turbopack). Bug recorrente: CSS/HMR fica preso em cache — fix: matar processo na porta 3000, `rm -rf .next` (às vezes 2x), reiniciar.
- Deploy: `npm run deploy` (`opennextjs-cloudflare build && deploy`). Nunca usar Turbopack para produção.
- Segredos: `.env.local` local (gitignored) + `wrangler secret put <NOME>` para produção (nunca em `vars` do `wrangler.jsonc`). Nunca expor valores de Supabase/Anthropic/MailerLite/Cloudflare/Widget em texto.
- `client-reference/` é gitignored — para docs internos do cliente (briefings, PDFs) que nunca podem ficar em `public/` (ficaria publicamente servido). `property-catalogue-local.png` e `tsconfig.tsbuildinfo` são ficheiros locais fora de escopo, não commitar.

## Implementado

### Catálogo e fichas de imóvel
- Fonte runtime é a tabela `imoveis` (Supabase); só entram publicados, disponíveis, com referência e preço válidos. Dados (agente, área, WC, descrição) vêm do eGO — preenchimento não se corrige neste repo.
- SSR normal + fallback client-side (`PropertyDetailBrowserFallback`) quando o SSR não encontra o imóvel.
- Lightbox de fotos (`property-gallery.tsx`) usa `object-cover` (enche o ecrã, corta o excesso) — decisão explícita do cliente após testar `object-contain`.
- Mapa só mostra zona/freguesia/concelho, nunca morada exacta.

### Contactos, recrutamento e leads
- 3 funis confirmados end-to-end em produção (teste real + verificação na BD + limpeza): `/contacto` → `/api/leads`, ficha de imóvel → `/api/leads` (`source:"property_detail"`), candidatura de recrutamento → `/api/recrutamento`.
- **Candidatura sem quiz**: `/recrutamento` tem 3 links que levam direto ao formulário de candidatura sem passar pelo questionário. Corrigido em 2026-09-04: antes fabricava respostas fictícias (`Array(10).fill(0)`, que na verdade dava sempre 30/30 "muito_alinhado" — índice 0 é a opção de mais pontos em cada pergunta, não a de menos). Agora `pontuacao`/`nivel`/`quiz_respostas` ficam `null` em `recrutamento` quando não há quiz (colunas passaram a nullable, migração `20260904000000`), e o MailerLite não usa grupo de nível nesse caso.
- Formulário "Recebe o teu relatório" (dentro do resultado do quiz) passou a exigir checkbox de consentimento (`privacy_consent`), igual à candidatura completa — antes subscrevia ao MailerLite com tags de perfil sem consentimento explícito nesse ponto (2026-09-04).
- `createLead()` (`src/lib/properties.ts`) grava sempre em `contactos` (Supabase, tabela de Pessoa do CRM eGO, sync unidirecional eGO→Supabase feito por scraper externo — nunca escrever esperando roundtrip). Coluna `mensagem` adicionada em 2026-09-03 (não existia; texto do pedido era descartado desde sempre).
- **Push para eGO** (`src/lib/ego.ts`, `sendLeadToEgo`, `PUT websiteapi.egorealestate.com/v1/Lead`, secret `EGO_LEAD_API_TOKEN`) só dispara quando há `property_id` (ou seja, só na ficha de imóvel) **e** o imóvel está `publicado` com `ego_id`. Este gate é responsabilidade nossa, não do eGO — confirmado ao vivo que a API do eGO **não valida o RID** (aceita imóvel retirado e até `RID` inventado, sempre `Success:true`; o eGO tem atraso a mostrar leads novos na UI). Um `RID` que não corresponde a nenhum imóvel real cria mesmo assim um "Pedido de Informação" no eGO, mas **órfão** (sem imóvel associado) e **mal-encaminhado**. Testado 2x com RID inválido: 1º teste caiu no dono da conta do token; 2º teste (2026-09-07) caiu numa consultora sem ligação nenhuma ao token — a teoria "cai no dono do token" está **errada/incompleta**. Mecanismo real de fallback do eGO por confirmar (provavelmente responsável default/round-robin configurado na conta, não ligado ao token da API) — reforça ainda mais a necessidade do gate `publicado`+`ego_id` real antes de enviar, já que o destino de um RID inválido é imprevisível. `/contacto` e `/servicos` nunca enviam `property_id`, por isso nunca tocam no eGO — ainda por definir com o cliente o que fazer a esses. Confirmado ao vivo: **não há dedupe** — cada submissão cria um "Pedido de Informação" separado no eGO, mesmo repetindo email/telefone/imóvel.
- **Quiz de recrutamento + relatório de perfil por IA** (`/recrutamento`): 10 perguntas/dimensões, pontuação 0-30, 4 níveis (`src/lib/recruitment.ts`). Ao terminar, `sendReport()` chama `/api/quiz-report` → Anthropic Messages API gera relatório personalizado em PT-PT → grava em `quiz_reports` (token público, RLS leitura-por-token) → `/recrutamento/relatorio?t=...` renderiza → upsert MailerLite (grupos dedicados por nível, ex. `Quiz Recrutamento - Alto`). Confirmado ao vivo: email entregue, aberto e clicado (100%).
- `ScrollProgress` e `MobileCtaBar` (barra de progresso + CTA fixo mobile) montados em `/recrutamento`; secção "Dúvidas comuns" tem resposta a cada dúvida.
- Rate-limit Cloudflare (`URI Path starts with /api/`, 5 pedidos/10s por IP) cobre todos os endpoints `/api/*`.

### Chat
- Chat AI interno (`/api/chat`) foi **removido** — substituído pelo widget externo do cliente (`public/widget.js`), que fala com os agentes do `figueira-home-portal` (backend FastAPI/Fly.io, próprio Supabase). Montado via `next/script` em `layout.tsx`.
- Widget não chama o backend directamente: passa por `/api/site-chat` (proxy neste Worker), que injeta um header secreto (`X-Widget-Key`/`WIDGET_CHAT_SECRET`) exigido pelo backend — esconde URL e chave do browser, e reaproveita a rate-limit de `/api/*`.

### Consentimento, analytics e legal
- Banner de cookies (`cookie-consent-banner.tsx` + `consent.ts`) bloqueia GA4/Meta Pixel até "Aceitar" — verificado (scripts só carregam com consentimento e com os IDs do cliente configurados).
- `/politica-privacidade` e `/politica-cookies` cobrem WhatsApp, profiling do quiz, Google Translate vs GA/Pixel. Emails de contacto uniformizados para `geral@figueirahome.pt`.

- **Footer (`video-footer.tsx`)**: vídeo de fundo substituído por imagem estática (`public/blog.png` em geral, `public/recrutamento.png` na variante recrutamento) — pedido do cliente, sem lógica de vídeo no componente.
- **Botões do footer em `/recrutamento` corrigidos (2026-09-05)**, 3 causas empilhadas: (1) âncoras erradas/inexistentes (`#perfil` não existia; secção "Processo" não tinha `id`, adicionado `id="processo"` em `recrutamento/page.tsx`); (2) `next/link` não faz scroll em navegação de âncora para a mesma rota; (3) `html{scroll-behavior:smooth}` (globals.css) falha em silêncio em saltos muito longos — `/recrutamento` tem ~23000px, saltar do fundo até `#quiz`/`#processo` (~19000px) simplesmente não movia o scroll (confirmado: `scroll-behavior:auto` corrige na hora). Fix: `jumpToAnchor()` em `video-footer.tsx` — `<a>` nativo + `scrollIntoView({behavior:"auto"})` via `onClick`, ignora CSS global e o `Link` do Next. Os links "curtos" já existentes dentro da própria página (`recruitment-form.tsx`, `mobile-cta-bar.tsx`) não foram tocados — mesmo risco teórico se clicarem de um extremo ao outro da página, mas não reportado.

### Segurança
- **Headers de segurança** (`next.config.ts`, `headers()`): CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. CSP sem nonces (dynamic rendering em todas as páginas seria incompatível com o Worker de CPU limitada — ver "Decisões arquiteturais"); domínios enumerados por auditoria de código (GA4/Pixel/Google Translate/widget de chat/Supabase/fotos eGO `images.egorealestate.com`/YouTube-nocookie/Vimeo/Google Maps) e testados ao vivo em localhost sem violações. `img-src`/`frame-src` ficam largos (`https:`) de propósito: fotos de imóveis vêm de CDN do eGO (não Supabase) e `videoSourceFromUrl()` (`property-video.tsx`) já aceita qualquer URL https como iframe (decisão de produto pré-existente, não deste commit).

### Conteúdo e design
- Blog: 68 artigos em `src/content/blog-archive.json` (import lazy, ver "Decisões"), tabelas verificadas contra o PDF original, sem inconsistências conhecidas.
- Fontes: `.section-title`/`.hero-title` é o único ponto de override de fonte sans, usado em todo o site (incl. `/servicos`, páginas legais).
- Google Translate (pt/en/fr): `translate="no"` só no valor concreto (código energético, cargo), nunca no contentor.

## Ficheiros principais

- `src/lib/properties.ts` — consultas/filtros/mapeamento de `imoveis`.
- `src/app/imoveis/[slug]/page.tsx` + `src/components/property-detail-browser-fallback.tsx` — ficha SSR e espelho client-side.
- `src/lib/recruitment.ts` — perguntas/pontuação/níveis do quiz + mapa de grupos MailerLite.
- `src/components/recruitment-form.tsx` — quiz + candidatura.
- `src/app/api/quiz-report/route.ts`, `src/app/recrutamento/relatorio/page.tsx`, `src/components/recruitment/relatorio-view.tsx` — relatório de perfil por IA.
- `src/components/recruitment/scroll-progress.tsx`, `mobile-cta-bar.tsx` — UX de conversão do `/recrutamento`.
- `src/lib/mailerlite.ts` — helper partilhado de upsert de subscriber (usado por `/api/recrutamento` e `/api/quiz-report`).
- `src/lib/ego.ts` — push de lead para o eGO (só ficha de imóvel; ver "Contactos, recrutamento e leads").
- `public/widget.js` + `src/app/api/site-chat/route.ts` — widget de chat do portal + proxy protegido.
- `src/lib/supabase.ts` — clientes Supabase (browser/service/public-server).
- `src/app/globals.css` — design tokens; `.recruitment-page` (`--r-*`) para toda a área de recrutamento.
- `.impeccable/config.json` — supressões do detector de design (commitado, sem segredos).

## Decisões arquiteturais

- Nunca `import` estático de JSON/dados grandes no top-level de ficheiros partilhados pelo bundle do Worker — usar `await import()` preguiçoso (causou 503 por CPU-limit em cold start quando o blog violava isto).
- Rotas server-side (`src/app/api/*/route.ts`) seguem sempre o mesmo padrão: Zod valida → lógica → `fetch` directo a APIs externas (nunca SDKs pesados no bundle do Worker, ex. Anthropic/MailerLite via `fetch` puro).
- Relatórios/dados públicos partilháveis por link (ex. `quiz_reports`) usam RLS "leitura pública por token" (token de 32 chars gerado pela BD é o segredo efectivo) em vez de autenticação — sem política de INSERT, só `service_role` escreve.
- Segredos partilhados entre este Worker e serviços externos (backend do widget, etc.) usam um header próprio (`X-Widget-Key`) verificado do lado do backend com comparação constant-time — nunca confiar em CORS sozinho.
- Analytics só carregam depois de consentimento explícito — exigência legal, não opcional de UX.
- Não há CMS; blog é estático, catálogo é runtime Supabase. `imovel_ref` é a referência pública mais fiável para resolver fichas.
- Não existe tabela de agentes: responsáveis derivam de `angariador`/`vendedor` + `figueiraTeam`.

## Bugs conhecidos e dívida técnica

- **CRÍTICO, por resolver — `contactos` e `imoveis` sem Row Level Security.** A chave `anon` pública lê as duas tabelas na íntegra (dados pessoais completos, imóveis não publicados, `proprietario`/`morada`). Migração pronta em `supabase/migrations/20260831210000_rls_contactos_imoveis.sql` — **NÃO APLICADA**: bloqueada porque `figueira-home-portal` (ferramenta interna, repo externo) usa a mesma chave `anon` do mesmo projeto Supabase directamente do browser. RLS distingue por *role*, não por aplicação — restringir um parte o outro. Correção real: portal passar a usar `service_role`/auth própria — decisão do cliente, fora deste repo.
- Favicon em falta (404): o ícone da marca está fundido com o texto "FIGUEIRA HOME" no logo, sem recorte quadrado limpo possível — precisa de asset dedicado do cliente/designer.
- Opt-out "PARAR" prometido na política de privacidade (§9) sem implementação no backend do agente WhatsApp (`Figueirahome-Agent-call`, repo externo) — decisão de quem implementa fica com o cliente.
- Testemunhos da homepage ("Ana Carvalho", "Ricardo Silva", "Luísa Monteiro") por confirmar com o cliente se são reais/autorizados ou placeholder — risco de confiança/legal se forem inventados e apresentados como reais.
- `MobileCtaBar` do `/recrutamento` (mobile) revisto no código (incl. fix de z-index vs. menu mobile, 2026-09-09) mas não confirmado visualmente ao vivo — Claude-in-Chrome não consegue emular viewport mobile neste ambiente (`resize_window` não sai do estado maximizado da janela, confirmado via `window.outerWidth`); confirmar num telemóvel real.
- QA responsivo geral foi sobretudo desktop nesta sessão; mobile/tablet por validar em várias páginas.
- 6 leads de teste ficaram no eGO CRM dos testes da integração (`Teste eGO QA`, `Teste eGO QA2`, `Teste eGO Direto`, `Teste Node Fetch`, `Teste RID Invalido`, `Teste RID Invalido 2`) — API não tem endpoint de delete, apagar manualmente na UI do eGO.

## Próximos passos

1. QA responsivo mobile real (telemóvel físico) — revisão de código já feita nesta sessão (achado e corrigido: z-index do menu mobile sobreposto pela `MobileCtaBar` em `/recrutamento`); Claude-in-Chrome não consegue emular viewport mobile neste ambiente (janela fica presa maximizada, resize não aplica).
2. Decidir com o cliente o futuro do `figueira-home-portal` (trocar `anon` por `service_role`) para poder aplicar a migração RLS com segurança.
3. Favicon dedicado quando houver asset do cliente.
4. Confirmar com o cliente: testemunhos da homepage (reais?) e quem implementa o opt-out "PARAR" do WhatsApp.
5. Confirmar mecanismo real de fallback do eGO para RID inválido junto do suporte eGO (testado 2x, resultado inconsistente — ver "Contactos, recrutamento e leads").

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
