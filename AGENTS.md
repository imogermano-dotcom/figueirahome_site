# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-07-20.

## Projeto

Site institucional e catálogo imobiliário da Figueira Home, construído em Next.js App Router. Inclui catálogo e detalhe de imóveis, contactos, recrutamento, chat AI e fallback local quando o Supabase não está disponível.

## Estado atual

- Produção: `https://figueira-home.miguel-germano.workers.dev`, Cloudflare Worker `figueira-home`.
- Último deploy confirmado: versão `f1417c48-cd1f-49c3-8b82-29a9011d68f6`.
- O build de produção (`npm.cmd run build`, com Webpack) e o lint dos ficheiros de imóveis passaram antes do último deploy.
- O repositório usa o ramo `main` e está ligado a `https://github.com/imogermano-dotcom/figueirahome_site.git`. Um push para GitHub não faz deploy automático.
- Há alterações locais não commitadas, incluindo recrutamento, políticas, contactos, galeria e o mapeamento de imóveis. Preservá-las ao trabalhar no repositório.
- O servidor de desenvolvimento não deve ser presumido como ativo; confirmar o processo/porta antes de o usar.

## Implementado recentemente

- Página `/recrutamento` integrada, com questionário, candidatura, rodapé próprio e sem mensagens comerciais sobre imóveis.
- Candidaturas validadas são persistidas em `contactos` e `recrutamento`, classificadas e sincronizadas com o grupo MailerLite correspondente. Os secrets e quatro grupos já estão configurados no Worker.
- Políticas `/politica-privacidade` e `/politica-cookies` atualizadas; contactos mostram a indicação legal do custo de chamada.
- Catálogo e detalhe apresentam a referência `imovel_ref`.
- Detalhe de imóvel com galeria completa: miniaturas, setas, imagem ampliada e controlo por teclado; validada em produção num imóvel com 79 fotografias.
- Detalhe de imóvel apresenta o certificado energético exatamente como vem de `certificacao_energetica`, quando preenchido (inclui, por exemplo, `A+`, `B` ou `Isento`). Não são inventadas classes energéticas.
- Detalhe de imóvel apresenta cartões de `Garagem` e `Varanda` apenas quando os campos Supabase respetivos são verdadeiros.
- Detalhe mostra um mapa Google da zona aproximada. A pesquisa do mapa usa apenas `zona`, `freguesia` e `concelho`; nunca a morada, número ou código-postal. O interface informa explicitamente esta aproximação.

## Stack e operação

- Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase JS, AI SDK e Zod.
- Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run preview`, `npm run deploy`.
- Em PowerShell, se `npm` falhar por política de execução, usar `npm.cmd` (por exemplo, `npm.cmd run build` e `npm.cmd run deploy`).
- O build de produção usa `next build --webpack`; não trocar para Turbopack, que falhava no runtime OpenNext/Workers.
- `npm run deploy` executa OpenNext e publica no Worker. Manter `nodejs_compat` em `wrangler.jsonc`.
- Variáveis locais: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_MODEL`, `MAILERLITE_API_KEY` e IDs dos grupos de recrutamento. Nunca expor valores de secrets.

## Decisões arquiteturais

- A fonte runtime é a tabela Supabase `imoveis`. Só são publicados registos com `disponibilidade = "Disponível"`, referência válida e preço superior a zero.
- Arrendamento é usado apenas com `arrendamento_preco` superior a zero e sem preço de venda; nos restantes casos o negócio é compra.
- A página inicial considera destaque um imóvel com `vista_mar`, `vista_praia`, `piscina` ou `terraco`; se não houver nenhum, apresenta os imóveis disponíveis mais recentes.
- `foto_principal` e `fotos` são combinadas sem duplicados por `imagesFromImovel()`; o detalhe consome a lista completa em `PropertyGallery`.
- O mapeamento de Supabase para `Property` expõe `energy_certificate`, `has_garage`, `has_balcony` e `map_location`. Valores `false`/ausentes de garagem e varanda não criam cartões no detalhe.
- Sem cliente Supabase válido, imóveis e agentes usam `sample-data.ts`; leads devolvem `local-fallback`. Não remover este fallback sem instrução explícita.
- Os agentes são derivados de `angariador`/`vendedor`; nomes conhecidos reutilizam contacto, email e fotografia de `sampleAgents`.
- Leads normais escrevem em `contactos`. Candidaturas usam `/api/recrutamento`, com persistência dupla antes da sincronização MailerLite.
- O chat responde em PT-PT, consulta apenas imóveis publicados e não inventa preços, disponibilidade ou imóveis.

## Ficheiros principais

- `src/lib/properties.ts`: leitura/mapeamento Supabase, regras de publicação, imagens, filtros, agentes, certificado, mapa, garagem e varanda.
- `src/lib/types.ts`: tipo `Property`, incluindo dados energéticos, mapa e características booleanas.
- `src/app/imoveis/page.tsx` e `src/app/imoveis/[slug]/page.tsx`: catálogo e detalhe, incluindo mapa e cartões de características.
- `src/components/property-card.tsx` e `src/components/property-gallery.tsx`: cartões e galeria do imóvel.
- `src/app/recrutamento/page.tsx`, `src/components/recruitment-form.tsx`, `src/lib/recruitment.ts` e `src/app/api/recrutamento/route.ts`: candidatura e integração MailerLite/Supabase.
- `src/app/politica-privacidade/page.tsx`, `src/app/politica-cookies/page.tsx`, `src/lib/contact-details.ts` e `src/app/contacto/page.tsx`: políticas e contactos.
- `src/components/site-chrome.tsx` e `src/components/video-footer.tsx`: navegação e rodapés.
- `supabase/recrutamento.sql` e `supabase/migrations/20260714000000_create_recrutamento.sql`: referência da estrutura de recrutamento.

## Bugs conhecidos e dívida técnica

- Alguns imóveis não têm fotografias; o detalhe mostra o bloco de substituição. Completar os dados na origem.
- Existem áreas, WC e descrições incompletos em dados reais.
- `createLead()` só persiste comprovadamente `nome`, `email`, `telemovel`, `tipos` e `criado_em`; `message` e `property_id` ainda não estão confirmados na tabela `contactos`.
- `getPropertyBySlug()` carrega até 500 imóveis e filtra em memória; deve passar a uma consulta direta por referência/slug.
- Não existe uma tabela dedicada de agentes.
- `supabase/schema.sql` e o histórico remoto de migrations não estão alinhados com o runtime. Tratar `supabase db push` com cuidado.
- Podem subsistir sequências de encoding incorretas em páginas antigas. Corrigir página a página e validar o HTML publicado, especialmente texto JSX direto.
- A galeria carrega todas as miniaturas em imóveis com muitas fotos; avaliar carregamento progressivo/lazy se houver impacto.
- O mapa depende do embed Google e indica deliberadamente uma zona, não uma localização exata.

## Próximos passos recomendados

1. Fazer QA responsivo real (desktop e mobile) de home, catálogo, detalhe com galeria/mapa, contacto, recrutamento, blog e rodapés; validar também certificado, garagem e varanda em dados reais.
2. Completar dados de `imoveis`, começando por imóveis sem fotografia e por campos de área, WC e descrição.
3. Decidir e implementar a persistência de `message` e `property_id` em `contactos`.
4. Otimizar `getPropertyBySlug()` e definir uma fonte/tabela dedicada para agentes.
5. Validar uma candidatura ponta a ponta num ambiente controlado, sem poluir os grupos MailerLite de produção.
6. Avaliar miniaturas progressivas e, se desejado, configurar Cloudflare Workers Builds com GitHub para deploy automático.
