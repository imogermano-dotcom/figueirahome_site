# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-08-29. Manter este ficheiro abaixo de 200 linhas e substituir informação ultrapassada.

## Estado atual

- Site institucional e catálogo imobiliário em Next.js App Router, Supabase, Cloudflare Workers, contactos, recrutamento e chat.
- Produção: `https://figueirahome.pt` e `https://www.figueirahome.pt` (Worker Custom Domains, desde 2026-08-31). `https://figueira-home.miguel-germano.workers.dev` continua ativo como preview/backup (`workers_dev: true` em `wrangler.jsonc`). Último deploy: `3ff0e2ba-4f88-422c-ad5d-9d171dcfbb06`, em 2026-09-01.
- Domínio `figueirahome.pt` já estava na Cloudflare, mesma conta do Worker (`miguel.germano@gmail.com`). Site antigo (WordPress, VPS CloudPanel `165.22.31.75`) continua a correr no VPS, só deixou de ser apontado pelo domínio — acessível por IP direto se precisar. Cutover exigiu apagar manualmente 6 registos DNS (A+2×AAAA em `figueirahome.pt` e `www`) "geridos externamente" que bloqueavam a criação do Custom Domain (erro Cloudflare 100117). Email (MX Microsoft 365 + SendGrid, SPF/DKIM/DMARC), `cloudpanel.`, `lp.`, `sip.` — todos intocados, confirmado.
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
- Todas as 8 tabelas do artigo de heranças corrigidas e confirmadas contra `client-reference/blog/FigueiraHome_Blog_2025_2026.pdf` (`pdftotext -layout`/sem layout para desambiguar): Ano/Alteração/Impacto, Tipos de Testamento, Formas de Aceitação, Imposto do Selo, Etapas da Partilha, Divórcio, Taxas Residentes/Não-Residentes (também faltava o símbolo `€`), IMT/Selo/IRS-IRC. Verificado renderizado no dev server (`curl localhost:3000/blog/...`).
- **Causa raiz comum**: `mergeBlogTableBlocks`/`toBlogTable` (`src/lib/blog.ts`) reconstroem tabelas por heurística de espaçamento; quando o PDF quebra uma célula em 2 linhas, o conteúdo às vezes "escorrega" para a linha do rótulo da linha seguinte. Fix aplicado sempre no dado (`blog-archive.json`), nunca no algoritmo — mesmo padrão do commit `b5135d1`.
- **Scan aos 68 artigos** (heurística: célula vazia fora da última coluna) encontrou 63 tabelas suspeitas em 37 outros artigos — mesmo padrão de scramble. Todas corrigidas 2026-08-31 (reconstrução manual linha a linha a partir dos próprios `lines` já capturados no JSON — sequência real de rótulo→conteúdo dentro do mesmo bloco/blocos vizinhos —, com `pdftotext` do PDF original só como desempate nos casos ambíguos como tabelas numéricas sem pontuação). Scan re-executado no fim: **0 tabelas suspeitas** em todo o arquivo. Verificado renderizado em 2 artigos via dev server.
- Auditoria 2026-08-31 (Supabase, catálogo live = `publicado=true`+`disponibilidade="Disponível"`, só **54 de 4464** imóveis): 2 sem agente (`FH2571`, `FH2483_C`), 19 sem WC, 11 sem área, 1 sem descrição, 50 sem plantas (opcional), 28 sem vídeo (opcional), fotos ok. Sandra Silva com 0 imóveis live (31 no total da tabela, nenhum publicado/disponível).
- **Fonte destes dados é o eGO** (`ego_id`/`fonte` na tabela `imoveis`) — atribuição de agente e preenchimento de área/WC/descrição fazem-se lá, não neste repo. Site só espelha o que o eGO sincroniza.
- Confirmar se `message`/`property_id` são persistidos em `contactos`; schema local e migrations remotas podem divergir.
- QA visual desta sessão foi sobretudo desktop; mobile/tablet por validar.
- **Fix 2026-08-31: 503 "Worker exceeded CPU time limit" intermitente na home após o cutover de domínio.** Causa: OpenNext empacota TODAS as rotas num único `worker.js`; `src/lib/blog.ts` fazia `import archive from "@/content/blog-archive.json"` (~3MB) no top-level, obrigando qualquer isolate frio a fazer parse do JSON inteiro mesmo em pedidos que nunca tocam no blog (ex: `/`). Falhava ~50% das vezes em cold start (confirmado via `wrangler tail`), passava em isolates já quentes — por isso só apareceu depois do domínio novo trazer tráfego disperso por mais PoPs/isolates. Fix: `blog.ts` passou a fazer `await import(...)` preguiçoso (memoizado por isolate) em vez de import estático; `getBlogPost`/`getRelatedBlogPosts` e o novo `getAllBlogPosts` (substitui o export direto `blogPosts`) ficaram async — atualizados os 3 consumidores (`blog/page.tsx`, `blog/[slug]/page.tsx`, `sitemap.ts`). Verificado pós-deploy: 6/6 pedidos a `/` OK, blog/sitemap/`www` também OK.
- **Fix 2026-08-31: idioma do site preso em inglês, "voltar a Português" não funcionava** (`src/components/google-translate.tsx`). Causa real: `changeLanguage("pt")` limpava o cookie `googtrans` só com `path=/`, sem `domain=`. O widget do Google tinha-o criado com `domain=.figueirahome.pt` (partilhado entre apex/`www`) — limpar sem esse `domain=` explícito cria um cookie vazio à parte em vez de apagar o real, então o `googtrans=/pt/en` original sobrevivia ao "clear" e reaplicava-se no reload. Fix: limpa agora em 5 variantes de domínio (sem domain, host atual, `.`+host atual, domínio raiz `figueirahome.pt`, `.`+raiz) para cobrir qualquer scope que o Google possa ter usado. Confirmado ao vivo, ciclo completo PT→FR→PT com conteúdo e dropdown sempre sincronizados. Nota de troubleshooting: automação de browser (clique/teclado em `<select>` nativo) não é fiável para testar isto — só reproduz de forma consistente com interação real ou `dispatchEvent` programático.
- **Fix 2026-08-31: `npm audit` — 9 vulnerabilidades (4 altas) no Next.js instalado** (SSRF, DoS, cache confusion, divulgação não autenticada de Server Function endpoints internos). `next` 16.2.9→16.3.4 (já cabia no `^16.2.9` existente) + `npm audit fix` limpou o resto (ai-sdk, postcss). `npm audit --omit=dev`: 0 vulnerabilidades. `sharp`/`undici`/`wrangler` ficam de fora do `--omit=dev` — são devDependencies (tooling), não vão para o bundle do Worker.
- **CRÍTICO, por resolver — `contactos` (28.261 linhas) e `imoveis` (4.464 linhas) sem Row Level Security.** A chave `anon` (pública, embutida no JS do site) lê as duas tabelas na íntegra: `contactos` expõe nome/email/telefone/data de nascimento/consentimentos RGPD de todas as pessoas; `imoveis` expõe os ~4.410 imóveis não publicados e colunas internas (`proprietario`, `comissao_agencia/angariador/vendedor`, `morada`). `recrutamento` já está correctamente bloqueada (RLS activo, sem políticas para anon) mas isso nunca ficou commitado neste repo. Migração pronta em `supabase/migrations/20260831210000_rls_contactos_imoveis.sql` — **NÃO APLICADA**: bloqueada porque `https://github.com/imogermano-dotcom/figueira-home-portal` (ferramenta interna de corretores) usa a MESMA chave `anon` do MESMO projeto Supabase (`zphasvfopnbzwnaidsnw`) directamente do browser para pesquisar `contactos` por telefone/email/nome e ler `imoveis` incluindo `morada`/`proprietario`. RLS distingue por *role* do Postgres, não por aplicação — como os dois consumidores partilham o role `anon`, restringir um parte o outro. Correção real: o portal passar a usar `service_role` (ou autenticação própria) em vez de `anon` — mudança nesse outro repo, a decidir com o cliente antes de aplicar a migração. Verificado que os outros consumidores externos (scraper eGO, backend do agente WhatsApp em `Figueirahome-Agent-call`) usam sempre `service_role`, não são afectados.
- **Fix 2026-09-01: rate-limit em `/api/leads` e `/api/chat`.** Cloudflare Security Rules → Rate limiting rule (plano Free, só permite período/duração de 10s): `URI Path starts with /api/`, 5 pedidos/10s por IP, action Block, duration 10s. Cobre também `/api/recrutamento` (já tinha honeypot próprio, dupla proteção não faz mal). Testado ao vivo: pedidos 1-5 chegam à app, 6-8 cortados com 429; volta ao normal passados os 10s. Nota: janela curta (10s) é o teto do plano Free — não é uma proteção tão forte quanto 5min/1h, mas trava flood sustentado porque a janela reabre a cada 10s enquanto o ataque continuar.
- **Fix 2026-09-01: `/api/chat` devolvia 500 com corpo vazio/inválido** (`src/app/api/chat/route.ts`) — `await req.json()` desestruturado sem validação nenhuma; `messages: undefined` rebentava dentro de `convertToModelMessages`. Descoberto ao testar o rate-limit acima. Agora valida JSON parseável + `messages` array não vazio, devolve 400 limpo, mesmo padrão do `/api/leads`.
- **Por investigar — `/api/chat` com payload válido devolve `"An error occurred"` genérico no stream**, falha não relacionada com os dois fixes acima (confirmado que o diff do fix de validação não toca na chamada ao modelo). Suspeita: falta configurar a chave de API do provider do modelo (`AI_MODEL=openai/gpt-5.4` sugere precisa de `OPENAI_API_KEY` ou equivalente nos secrets do Worker) — por confirmar.
- **RGPD 2026-09-01 — banner de consentimento verificado, funciona correctamente.** Testado em aba de browser limpa (sem localStorage prévio): GA4/Meta Pixel **não disparam** antes de aceitar; disparam com os IDs corretos (`G-78MN2SQB9J`, `821222191626360`) só depois de "Aceitar"; ausentes depois de "Rejeitar"; site e Google Translate continuam a funcionar normalmente com cookies rejeitados. Nota de troubleshooting: `read_network_requests` do browser não limpa o buffer entre navegações same-domain — testar sempre numa aba nova para evitar falsos positivos de pedidos residuais de testes anteriores.
- **RGPD — achado fora deste repo: opt-out "PARAR" prometido na política de privacidade (§9) sem implementação.** Procurei o termo exato (`PARAR`) em todo o código/docs de `Figueirahome-Agent-call` (backend do agente WhatsApp) — zero resultados. O direito está documentado na política do site mas não é tecnicamente aplicado onde as mensagens WhatsApp são processadas. Texto de consentimento no formulário de recrutamento (`src/components/recruitment-form.tsx`) está correto, o gap é só no backend de mensagens.
- **Fix 2026-09-01: `og-image.jpg` em falta (404), partilhas sociais quebradas.** `layout.tsx` referenciava `/og-image.jpg` no OpenGraph mas o ficheiro nunca existiu. Gerado a partir de `foto fundo.jpg` (foto hero da homepage), recortado 1200×630. Confirmado 200 em produção.
- **Favicon também 404** — sem fix automático: o ícone da marca (casa+seta) está desenhado fundido com o texto "FIGUEIRA HOME", não há recorte quadrado limpo possível. Precisa de asset dedicado do cliente/designer.
- **Fix 2026-09-01: canonical URL em falta em todas as páginas.** Confirmado 0/3 (`<link rel="canonical">` ausente em home/imóveis/blog em produção) — importa em particular com `figueirahome.pt`+`www` a servir o mesmo conteúdo em dois domínios, risco de duplicado para o Google. `alternates.canonical` adicionado às 13 rotas com metadata; `/imoveis/[slug]` canonicaliza sem o `?ref=`. Verificado ao vivo em 6 tipos de página.
- **CRÍTICO, corrigido 2026-09-01: formulário de recrutamento estava a rejeitar TODAS as candidaturas em produção.** A constraint `recrutamento_preferencia_contacto_check` na BD (migration `20260714000000`) só aceitava `'telefone'/'email'/'whatsapp'`, mas o formulário real (`recruitment-form.tsx`) e o Zod da API pedem preferência de horário (`"Manhã (9h-13h)"` etc, `"Qualquer horário"` é o **default** do `<select>` — ou seja, falhava mesmo sem o utilizador mexer em nada). Reproduzido com insert direto via `service_role` (erro Postgres 23514), corrigido na BD via Supabase Management API + migration `20260901120000_fix_recrutamento_preferencia_contacto.sql` commitada. Testado end-to-end pós-fix: `recrutamento` + `contactos` + sync MailerLite todos OK. **Não se sabe há quanto tempo estava partido — perguntar ao cliente se notou quebra nas candidaturas.**
- **Fix 2026-09-01: número de WhatsApp errado em `/servicos`.** `src/lib/contact-details.ts` define o número canónico (`913 702 002`, usado correctamente no rodapé via `video-footer.tsx`), mas `servicos/page.tsx` e `src/components/servicos/contact-form.tsx` tinham hardcoded um número diferente (`928 318 953`). Confirmado com o cliente que `913 702 002` é o correto — trocado nos 2 sítios, sem outras ocorrências no repo. Verificado ao vivo.
- **Conversão 2026-09-01 — 3/4 funis de lead confirmados end-to-end** (submissão de teste real + verificação na BD + limpeza): contacto (`/api/leads`, `source:"form"`), recrutamento (ver fix crítico acima), pedido em ficha de imóvel (`source:"property_detail"`). O 4º (chat) passou nesta mesma sessão do `/api/chat` interno (bloqueado, erro genérico) para o widget externo do portal — ver fix "chat AI interno substituído" abaixo; leads desse canal já não passam por `createLead()` deste repo.
- **Fix 2026-09-01: `border-l-4` inconsistente em `imoveis/[slug]` (secção "Documentação do imóvel").** Sinalizado pelo hook de design (padrão "side-tab"). Confirmado inconsistente com o resto da própria página — a secção irmã "Vídeo do imóvel" logo a seguir não tem borda nenhuma, só `mt-10`+heading. Removido, alinhado com o padrão da página.
- **Marca/Autoridade 2026-09-01 — fotos de equipa (6/6) e páginas de consultores (6/6) confirmadas OK ao vivo.** AMI 7968 consistente em todas as páginas relevantes (já documentado). **Por confirmar com o cliente**: os testemunhos na homepage ("Ana Carvalho", "Ricardo Silva", "Luísa Monteiro", com datas e citações) são clientes reais autorizados ou placeholder de layout? Se forem inventados e apresentados como reais, é risco de confiança/legal — user não sabia responder, fica pendente.

- **Fix 2026-09-01: lightbox de fotos da ficha de imóvel com barras pretas / não fullscreen** (`src/components/property-gallery.tsx`). Duas causas em sequência: (1) container do lightbox tinha `max-w-6xl` (1152px), capando a largura independentemente do ecrã — removido. (2) mesmo sem o cap, `object-contain` deixa barras pretas sempre que o aspect ratio da foto não bate com o do ecrã (comportamento normal de letterbox); cliente pediu explicitamente para a imagem preencher o ecrã inteiro em vez disso — trocado `<img>` do lightbox de `max-h-full max-w-full object-contain` para `h-full w-full object-cover` (enche sempre, corta o excesso da foto em vez de sobrar preto). Confirmado ao vivo em produção via screenshot do cliente.
- **2026-09-01: chat AI interno (`/api/chat`) substituído pelo widget externo do portal.** Cliente forneceu `public/widget.js` (script autocontido, sem dependências) que fala com os agentes do `figueira-home-portal`, backend `figueirahome-agentos.fly.dev` (FastAPI/Fly.io, chama Anthropic Claude, persiste em Supabase próprio). Montado em `src/app/layout.tsx` via `next/script` (`strategy="afterInteractive"`), a seguir ao `<SiteChrome>`. Removidos como código morto: `src/components/chat-widget.tsx`, `src/app/api/chat/route.ts` (rota `streamText`/`tools` antiga), `src/components/ai-elements/message.tsx` (órfão), CSS morto `.chat-widget`/`.chat-toggle`/`.chat-panel`. Pacote `ai`/`@ai-sdk/*` fica em `package.json` sem uso conhecido — não removido, confirmar antes de tirar.
- **2026-09-01: proteção do widget de chat — proxy `/api/site-chat` + chave partilhada.** O widget chamava o backend fly.dev directamente do browser, fora do domínio/Worker — a rate-limit rule de Cloudflare (`/api/*`, 5/10s) não cobria isso, e qualquer site terceiro podia copiar o URL e abusar do backend (custo de LLM). Fix: `widget.js` passou a chamar `/api/site-chat` (mesma origem, por omissão — override continua possível via `window.FIGUEIRAHOME_CHAT_API`); nova rota `src/app/api/site-chat/route.ts` valida o payload (Zod, `mensagem` até 2000 chars) e reencaminha para `WIDGET_CHAT_BACKEND_URL` (default `https://figueirahome-agentos.fly.dev/api/site/chat`) injetando o header `X-Widget-Key` a partir do secret `WIDGET_CHAT_SECRET` — o browser nunca vê a chave nem o URL real do backend. Secret gerado (64 hex chars), guardado em `.env.local` (dev, gitignored) e como Cloudflare Worker secret (`wrangler secret put WIDGET_CHAT_SECRET`, prod). Lado do backend (FastAPI): dependency `require_widget_key` com `hmac.compare_digest` no router de `/api/site/chat`, secret via `fly secrets set` — aplicado e confirmado pelo cliente. Ficha completa passa agora pela rate-limit já existente em Cloudflare.

- **2026-09-02: `/recrutamento` alinhada com `client-reference/BRIEFING-DEV-LP-Recrutamento_1.md`** (especificação técnica da LP de referência, fornecida pelo cliente — **não commitar em `public/`, fica publicamente servida**; ficheiro é gitignored em `client-reference/`, exactamente para isto). Agente Explore confirmou que quiz (10 perguntas/dimensões/pontuação/bandas), simulador de rendimentos e JSON-LD `JobPosting` já batiam certo com o briefing — só 3 gaps reais, todos fechados:
  1. **Relatório de perfil por IA** (maior gap — o ecrã do quiz prometia "recebe o teu relatório por email" mas só disparava um lead genérico). Nova tabela `quiz_reports` (migration `20260902000000`, RLS leitura pública por token, sem policy de INSERT). Nova rota `src/app/api/quiz-report/route.ts`: Zod → chama Anthropic Messages API via `fetch` directo (sem SDK; modelo em `RECRUITMENT_AI_MODEL`, default `claude-sonnet-5` — **confirmar que continua o id correcto quando isto for revisto no futuro**, extrai `{...}` por regex antes do `JSON.parse`) → insere em `quiz_reports` → upsert MailerLite com `report_url`. Nova página `src/app/recrutamento/relatorio/page.tsx` + `src/components/recruitment/relatorio-view.tsx` (client, fetch por `anon key`, estados loading/token inválido/erro/sucesso, `noindex`). `sendReport()` em `recruitment-form.tsx` passou de `/api/leads` para `/api/quiz-report`, agora envia o `breakdown` completo das 10 respostas. Testado end-to-end (local, `ANTHROPIC_API_KEY` do cliente): relatório gerado em PT-PT, 10/10 dimensões, JSON válido à primeira; `/relatorio?t=` renderiza; token inválido dá ecrã dedicado; MailerLite aceita o upsert mesmo sem os campos custom criados (ignora em silêncio, conforme o briefing avisa). **Passo manual pendente do cliente, fora deste repo**: criar no MailerLite os 5 campos custom (`quiz_score`, `quiz_tier`, `report_url`, `origem`) e as 4 automações "subscriber joins group" que enviam o email com `{$report_url}` — sem isto o candidato nunca recebe o link. **Nota**: reutiliza os mesmos 4 group IDs já usados pelo formulário de candidatura completa (`mailerliteGroupEnvByLevel`, extraído para `src/lib/recruitment.ts`) — se o cliente já tiver automações nesses grupos ligadas à candidatura final, confirmar que não colidem com a automação nova do relatório do quiz.
  2. **UX de conversão**: `ScrollProgress` (barra de progresso no topo) e `MobileCtaBar` (CTA fixo em mobile após a Hero) — novos, `src/components/recruitment/`. `StickyHeader` do briefing ficou de fora por já estar coberto pelo `SiteChrome` (nav fixo/sólido sitewide).
  3. **Secção "Dúvidas comuns"** (`page.tsx`) passou de pills sem resposta para 5 pares dúvida+resposta.
  Lógica de MailerLite (`syncMailerLite`) extraída para `src/lib/mailerlite.ts` (`upsertMailerLiteSubscriber`), partilhada entre `/api/recrutamento` e `/api/quiz-report`. Verificação visual do `MobileCtaBar` em mobile ficou por confirmar — Claude-in-Chrome ficou instável após `resize_window` (mesma classe de falha já vista nesta sessão); código segue o mesmo padrão já confirmado do `ScrollProgress`, revisto mas não visto ao vivo.

## Próximos passos

1. QA responsivo (mobile/tablet), incl. confirmar visualmente o `MobileCtaBar` do `/recrutamento` em ecrã mobile real.
2. Decidir com o cliente o que fazer ao `figueira-home-portal` (trocar `anon` por `service_role`/auth própria) para poder aplicar a migração RLS de `contactos`/`imoveis` em segurança — ver "Bugs conhecidos".
3. Cliente criar no MailerLite os 5 campos custom + 4 automações do relatório de IA do quiz — ver entrada 2026-09-02 acima. Sem isto o relatório é gerado mas o email nunca chega.
4. **Plano de teste Segurança/Conversão/Marca-Autoridade/SEO/RGPD — todas as 5 secções percorridas** (ver `C:\Users\joaoa\.claude\plans\moonlit-puzzling-rocket.md`). Pendências reais: headers CSP/HSTS (Segurança), RLS bloqueada pelo portal externo (Segurança), favicon + JSON-LD por página (SEO), confirmar testemunhos da homepage com o cliente (Marca).
5. Decidir com o cliente quem implementa o opt-out "PARAR" no backend do agente WhatsApp (`Figueirahome-Agent-call`) — a política de privacidade do site promete-o mas não existe no código.
6. Conseguir um ícone standalone (só a marca casa+seta, sem o texto) do cliente/designer para gerar o favicon.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
