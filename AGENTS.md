# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-08-18. Manter este ficheiro abaixo de 200 linhas e substituir informação ultrapassada.

## Estado atual

- Site institucional e catálogo imobiliário em Next.js App Router, Supabase, Cloudflare Workers, contactos, recrutamento e chat AI.
- Produção: `https://figueira-home.miguel-germano.workers.dev` (Worker `figueira-home`). Último deploy validado: `6998f869-2b36-43ad-9b43-85d2a8f46d54`, em 2026-08-18.
- Branch: `teste/alteracao-cliente`. `origin` está em `724c01c`; HEAD local está em `2f79c08` e ainda falta enviar este commit.
- O worktree contém alterações não commitadas para a imagem “Quem Somos” e os novos retratos da equipa. `property-catalogue-local.png`, o ZIP em `public/equipa/` e `public/equipa/old/` são ficheiros locais fora do escopo e não devem ser publicados sem decisão explícita.
- Servidor local habitual: `http://localhost:3002`. Produção usa `npm.cmd run deploy`, com `next build --webpack`; não usar Turbopack para produção.
- Nunca expor valores de `.env.local` ou segredos Supabase, AI, MailerLite e Cloudflare. A `SUPABASE_SERVICE_ROLE_KEY` existe como secret do Worker; o valor local está vazio.

## Implementado

### Blog e conteúdo editorial

- Arquivo importado com 68 artigos completos e 190 imagens em `src/content/blog-archive.json` e `public/blog/archive/`.
- `/blog` tem destaque do artigo mais recente; `/blog/[slug]` tem capa, metadados, conteúdo semântico, imagens, listas, tabelas HTML responsivas e relacionados.
- Tabelas extraídas do PDF são reconstruídas por heurística (`mergeBlogTableBlocks`/`toBlogTable`); a primeira tabela de heranças foi corrigida manualmente com valores confirmados no site antigo.
- “Empreendimentos” foi retirado do menu, mantendo rota e rodapé.

### Catálogo, homepage e equipa

- A fonte runtime é `imoveis`; só entram imóveis publicados, disponíveis, com referência válida e preço positivo.
- Catálogo, pesquisa e detalhe suportam `imovel_ref`. Links de cards usam `?ref=...`; a ficha faz consulta direta por referência, junta fotos sem duplicados e mostra galeria, certificado, preços, mapa aproximado, vídeo, plantas e `visita_virtual_url`.
- Quando o SSR não encontra o imóvel, `PropertyDetailBrowserFallback` recupera os dados através do cliente Supabase público no browser. O desenvolvimento local usa fallback/sample data quando o Supabase não responde.
- Homepage: `src/app/page.tsx` já usa a fotografia `public/about/quem-somos.png` na área “Quem Somos”.
- `src/lib/team.ts` aponta os seis consultores para os novos retratos com espaços em `public/equipa/`; as mesmas referências alimentam homepage, “Quem Somos” e perfis.
- Hero usa até três vídeos com posters/miniaturas; embeds usam `youtube-nocookie` e não carregam iframe antes da reprodução.

### Contactos, recrutamento e segurança

- Contactos exigem `privacy_consent: true`; recrutamento grava candidatura e sincroniza MailerLite no Worker.
- Sem credenciais Supabase válidas, imóveis/agentes usam `sample-data.ts` e leads respondem `local-fallback`.
- O mapa usa apenas zona/freguesia/concelho; nunca publica morada, número ou código-postal.

## Ficheiros principais

- `src/lib/properties.ts`: consultas, filtros, mapeamento de `imoveis`, fallback e visita virtual.
- `src/app/imoveis/[slug]/page.tsx`: metadata, detalhe e parâmetros `ref`.
- `src/components/property-detail-browser-fallback.tsx`: recuperação pública no browser.
- `src/components/property-card.tsx`, `src/components/hero-experience.tsx`, `src/components/property-video.tsx`: cards, hero e vídeo.
- `src/app/page.tsx`: homepage, área “Quem Somos”, serviços e equipa.
- `src/lib/team.ts`: equipa, bios, aliases e caminhos das fotografias.
- `src/app/quem-somos/page.tsx`, `src/app/consultores/[slug]/page.tsx`: apresentação da empresa e perfis.
- `src/lib/blog.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`: arquivo, pesquisa, tabelas e artigos.
- `src/components/site-chrome.tsx`, `src/app/sitemap.ts`: navegação e indexação.

## Decisões arquiteturais

- O PDF é fonte editorial local; o site publica apenas conteúdo e imagens extraídos, sem publicar o PDF.
- Não há CMS nesta fase. O blog é estático e o catálogo é runtime Supabase.
- `publicado` é a autoridade para retirar imóveis sem apagar registos.
- `imovel_ref` é a referência pública mais fiável para resolver fichas; slug continua compatível por razões de URL/indexação.
- Não existe tabela dedicada de agentes: responsáveis derivam de `angariador`/`vendedor` e são enriquecidos por `figueiraTeam`/`sampleAgents`.
- O fallback local é deliberado. O chat responde em PT-PT e não inventa imóveis, preços ou disponibilidade.

## Bugs conhecidos e dívida técnica

- A reconstrução de tabelas do PDF é heurística; validar lotes importantes contra `https://figueirahome.pt`, começando por heranças.
- Alguns artigos preservam português do Brasil e podem conter encoding antigo; rever apenas com fonte confirmada.
- Alguns imóveis na origem continuam sem fotos, áreas, WC, descrição, plantas ou vídeo completos.
- `getPropertyBySlug` ainda pode carregar uma lista e filtrar em memória quando não recebe `ref`; eliminar essa dependência quando houver slug persistido/consultável na origem.
- Perfis mostram apenas um responsável: `angariador` tem prioridade e `vendedor` é fallback. Sandra Silva ainda não tem imóveis atribuídos na origem.
- Confirmar se `message` e `property_id` são persistidos em `contactos`; schema local e migrations remotas podem divergir.
- O full lint já atingiu OOM no Windows; usar lint direcionado e validar o build de produção.

## Verificação recente

- `npm.cmd run deploy` concluiu com build TypeScript/OpenNext e publicou o Worker na versão indicada acima.
- Lint direcionado passou para os ficheiros de imóveis, fallback, homepage e equipa; `git diff --check` passou.
- Os seis novos retratos respondem `200` no servidor local `:3002`.
- Ainda falta validar visualmente em produção após publicar as imagens novas; o deploy atual não contém as alterações recentes da homepage/equipa.

## Próximos passos

1. Rever e decidir o conjunto de ficheiros novos em `public/equipa/`; excluir ZIP/`old/` e confirmar se os seis ficheiros antigos devem ser removidos.
2. Commitar as alterações da homepage, novos retratos e `AGENTS.md`; depois fazer push para `origin/teste/alteracao-cliente`.
3. Fazer novo deploy e QA responsivo em produção: homepage, equipa, “Quem Somos”, perfis, catálogo, fichas, plantas e visita virtual.
4. Fazer QA do blog, sobretudo tabelas, imagens, listas e encoding.
5. Corrigir dados incompletos em `imoveis`, atribuir imóveis à Sandra e decidir suporte simultâneo a `angariador` e `vendedor`.
6. Confirmar schema de `contactos`, otimizar resolução por slug e avaliar uma tabela/CMS próprio para agentes e blog.
