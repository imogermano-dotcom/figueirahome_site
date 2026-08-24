# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-08-23. Manter este ficheiro abaixo de 200 linhas e substituir informação ultrapassada.

## Estado atual

- Site institucional e catálogo imobiliário em Next.js App Router, Supabase, Cloudflare Workers, contactos, recrutamento e chat AI.
- Produção: `https://figueira-home.miguel-germano.workers.dev` (Worker `figueira-home`). Último deploy validado: `ceb9ed39-0ba3-499a-8782-9a9c36938203`, em 2026-08-21.
- Branch: `teste/alteracao-cliente`. `origin` e HEAD local sincronizados em `e20b1e7`; nada por commitar/enviar.
- Servidor local: `http://localhost:3002` (`npm.cmd run dev`, Turbopack). O watcher às vezes não recompila CSS em recargas normais, só via HMR em separadores já abertos — reiniciar (`Ctrl+C` + `npm run dev`) sempre que a UI parecer desatualizada depois de editar `globals.css`.
- Produção usa `npm.cmd run deploy` (`next build --webpack` + OpenNext/Wrangler); não usar Turbopack para produção.
- Nunca expor valores de `.env.local` ou segredos Supabase, AI, MailerLite e Cloudflare.
- `property-catalogue-local.png` e `tsconfig.tsbuildinfo` são ficheiros locais fora do escopo, não commitar.

## Implementado

### Blog e conteúdo editorial

- Arquivo importado com 68 artigos completos e 190 imagens em `src/content/blog-archive.json` e `public/blog/archive/`.
- `/blog` tem destaque do artigo mais recente; `/blog/[slug]` tem capa, metadados, conteúdo semântico, imagens, listas, tabelas HTML responsivas e relacionados.
- Tabelas extraídas do PDF são reconstruídas por heurística (`mergeBlogTableBlocks`/`toBlogTable` em `src/lib/blog.ts`), a partir de linhas de texto com colunas separadas por 2+ espaços.

### Catálogo, homepage e equipa

- A fonte runtime é `imoveis`; só entram imóveis publicados, disponíveis, com referência válida e preço positivo. Dev e produção usam ambos Supabase real (ver Decisões).
- Catálogo, pesquisa e detalhe suportam `imovel_ref`. Fichas mostram galeria, certificado, preços, mapa aproximado, vídeo, plantas (imagem ou PDF) e `visita_virtual_url`.
- Quando o SSR não encontra o imóvel, `PropertyDetailBrowserFallback` recupera os dados via Supabase público no browser — espelha os campos e a UI de `page.tsx` (certificado, estado, garagem, varanda, agente responsável).
- `src/lib/team.ts` aponta os seis consultores para os retratos em `public/equipa/`.
- Hero usa até três vídeos com posters/miniaturas; embeds usam `youtube-nocookie`.

### Contactos, recrutamento e segurança

- Contactos exigem `privacy_consent: true`; recrutamento grava candidatura e sincroniza MailerLite no Worker.
- Sem credenciais Supabase válidas, imóveis/agentes usam `sample-data.ts` e leads respondem `local-fallback`.
- O mapa usa apenas zona/freguesia/concelho; nunca publica morada, número ou código-postal.
- Google Translate (pt/en/fr) traduz o DOM inteiro; valores frágeis (certificado energético, cargo do agente/equipa) usam `translate="no"` para não serem mistraduzidos — texto de prosa (ex: `Estado`) fica traduzível normalmente.

## Ficheiros principais

- `src/lib/properties.ts`: consultas, filtros, mapeamento de `imoveis`, fallback e visita virtual.
- `src/app/imoveis/[slug]/page.tsx`: ficha SSR (produção); `src/components/property-detail-browser-fallback.tsx` espelha a mesma UI para quando o SSR falha ou em dev.
- `src/components/property-gallery.tsx`: galeria de fotos/plantas; deteta `.pdf` e mostra link "Abrir planta em PDF" em vez de tentar renderizar como imagem.
- `src/components/hero-experience.tsx`: hero de vídeos; recuperação client-side via Supabase quando o SSR não tem vídeos.
- `src/components/property-card.tsx`, `src/components/property-video.tsx`: cards e vídeo.
- `src/app/page.tsx`: homepage, "Quem Somos", destaques, serviços e equipa.
- `src/lib/team.ts`: equipa, bios, aliases e caminhos das fotografias.
- `src/app/quem-somos/page.tsx`, `src/app/consultores/[slug]/page.tsx`: apresentação da empresa e perfis.
- `src/lib/blog.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`: arquivo, pesquisa, tabelas e artigos.
- `src/components/google-translate.tsx`: widget de tradução.
- `src/app/globals.css`: design tokens; classes de fonte `.hero-title`, `.property-detail h1/h2/h3`, `.property-card-title`, `.font-body-heading` (força a fonte do corpo em títulos que por defeito herdam a serifada de `h1-h4`).

## Decisões arquiteturais

- O PDF é fonte editorial local; o site publica apenas conteúdo e imagens extraídos, sem publicar o PDF.
- Não há CMS nesta fase. O blog é estático e o catálogo é runtime Supabase.
- `publicado` é a autoridade para retirar imóveis sem apagar registos.
- `imovel_ref` é a referência pública mais fiável para resolver fichas; slug continua compatível por razões de URL/indexação.
- Não existe tabela dedicada de agentes: responsáveis derivam de `angariador`/`vendedor` e são enriquecidos por `figueiraTeam`/`sampleAgents`.
- O fallback para `sample-data.ts` só acontece quando o Supabase falha (sem credenciais ou erro de rede) — dev e produção usam dados reais por omissão; deixou de haver um desvio forçado para amostra em dev.
- `translate="no"` é aplicado seletivamente (só ao valor concreto que é código/nome próprio), nunca ao contentor inteiro — proteger de mais impede traduções legítimas como o `Estado` do imóvel.
- Overrides de fonte usam classes dedicadas e scoped (`.property-detail`, `.property-card-title`, `.font-body-heading`) em vez de tocar nas regras globais `h1-h4`, que continuam serifadas de propósito no resto do site (homepage, quem somos, blog).

## Bugs conhecidos e dívida técnica

- A reconstrução de tabelas do PDF é heurística. No artigo de heranças, a tabela "Ano/Alteração/Impacto" foi corrigida (linha 2020 misturava colunas por falta de espaço no texto de origem), mas o mesmo artigo tem **várias outras tabelas com o mesmo tipo de mistura** (testamentos, aceitação de herança, impostos) ainda por validar contra o texto original ou `https://figueirahome.pt` — o mesmo problema pode existir noutros dos 68 artigos.
- Alguns artigos preservam português do Brasil e podem conter encoding antigo; rever apenas com fonte confirmada.
- Alguns imóveis na origem continuam sem fotos, áreas, WC, descrição, plantas ou vídeo completos.
- `getPropertyBySlug` ainda pode carregar uma lista e filtrar em memória quando não recebe `ref`; eliminar essa dependência quando houver slug persistido/consultável na origem.
- Perfis mostram apenas um responsável: `angariador` tem prioridade e `vendedor` é fallback. Sandra Silva ainda não tem imóveis atribuídos na origem.
- Confirmar se `message` e `property_id` são persistidos em `contactos`; schema local e migrations remotas podem divergir.
- O full lint já atingiu OOM no Windows; usar lint direcionado e validar o build de produção.
- O dev server (Turbopack) por vezes fica com o CSS servido preso por horas sem recompilar em recargas normais; só reiniciando o processo é que se garante estado fresco para testar.

## Verificação recente

- Deploy `ceb9ed39-0ba3-499a-8782-9a9c36938203` em 2026-08-21: build TS/OpenNext OK, publicado no Worker.
- QA visual em produção feito duas vezes na sessão: homepage (hero, destaques, equipa), Quem Somos, perfil de consultor, catálogo (54 imóveis), ficha completa (vídeo, visita virtual Matterport, planta PDF, agente responsável), blog (68 artigos) — sem erros de consola, sem imagens partidas reais.
- Confirmado em produção: certificado energético, estado, garagem, varanda e agente responsável voltam a aparecer na ficha; vídeos da hero não desaparecem mais ao navegar entre páginas; plantas em PDF mostram link em vez de imagem partida; Google Translate já não mistraduz certificado/cargo mas continua a traduzir `Estado`; fontes dos títulos (hero, preços, catálogo, destaques, cards, ficha) uniformizadas com o corpo do texto.

## Próximos passos

1. Validar e corrigir as restantes tabelas do artigo de heranças no blog (testamentos, aceitação, impostos); avaliar se outros dos 68 artigos têm o mesmo problema.
2. Corrigir dados incompletos em `imoveis` (fotos, áreas, WC, descrição, plantas, vídeo), atribuir imóveis à Sandra Silva, decidir suporte simultâneo a `angariador` e `vendedor`.
3. Confirmar schema de `contactos` (`message`/`property_id`), otimizar resolução por slug, avaliar uma tabela/CMS próprio para agentes e blog.
4. QA responsivo (mobile/tablet) — as verificações desta sessão foram sobretudo em desktop.
