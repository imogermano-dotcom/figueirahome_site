# AGENTS.md - Figueira Home

Handoff operacional atualizado em 2026-07-12.

## Projeto

Site institucional e catálogo imobiliário da Figueira Home, construído em Next.js App Router. Inclui listagem e detalhe de imóveis, pesquisa, formulários de contacto, leads por chat, chat AI com pesquisa de imóveis publicados e fallback local sem Supabase.

## Estado Atual

- `npm run build` passou após as alterações recentes.
- O repositório Git está inicializado e sincronizado com `https://github.com/imogermano-dotcom/figueirahome_site.git`, ramo `main`.
- Produção usa Cloudflare Workers com OpenNext: `https://figueira-home.miguel-germano.workers.dev`.
- Worker Cloudflare: `figueira-home`; o `SUPABASE_SERVICE_ROLE_KEY` está configurado como secret no Worker.
- O build de produção usa Webpack (`next build --webpack`). Turbopack originava falha no runtime OpenNext/Workers.
- A home mostra o vídeo `/Video/hero-web.mp4` diretamente; verificações por `fs` foram removidas porque não funcionavam no Worker.
- Os cartões Comprar, Vender e Arrendar/Trespassar usam imagens em `public/services/`.
- A página `Quem Somos` foi redesenhada com hero, história, princípios, equipa dinâmica e CTA. Usa `public/about/figueira-home-office.png`.
- Corrigidas as sequências literais de codificação na página Quem Somos e rodapé. Ao usar `\u00xx`, em texto JSX direto usar expressão JavaScript, por exemplo `{"Im\u00f3veis"}`; fora de JSX, strings JavaScript interpretam o escape normalmente.

## Stack e Operação

- Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase JS, AI SDK e Zod.
- Scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run preview`, `npm run deploy`.
- `npm run deploy` executa OpenNext e publica no Cloudflare Worker. Um push ao GitHub não publica automaticamente.
- Configuração Cloudflare em `wrangler.jsonc` e `open-next.config.ts`; manter `nodejs_compat`.
- Variáveis esperadas em `.env.local`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_MODEL`.

## Arquitetura e Regras

- Fonte de leitura runtime: tabela Supabase `imoveis`.
- Fonte de escrita de leads: tabela Supabase `contactos`.
- `supabase/schema.sql` é referência local e não é o contrato runtime atual.
- Sem cliente Supabase válido, imóveis e agentes usam `sample-data.ts`; leads devolvem `local-fallback`.
- Só expor imóveis com `disponibilidade = "Disponível"` e preço superior a zero.
- Negócio: arrendamento apenas quando há `arrendamento_preco` e não há preço de venda; caso contrário comprar.
- Chat responde em PT-PT, consulta apenas imóveis publicados e não inventa preços, disponibilidade ou imóveis.
- Área é sempre apresentada em `m²`; quando ausente, mostrar `-`.
- Não remover o fallback local sem instrução explícita.

## Ficheiros Principais

- `src/lib/properties.ts`: mapeamento Supabase, filtros, agentes e criação de leads.
- `src/app/api/leads/route.ts` e `src/app/api/chat/route.ts`: validação, persistência e ferramentas AI.
- `src/app/imoveis/page.tsx` e `src/app/imoveis/[slug]/page.tsx`: catálogo e detalhe.
- `src/app/quem-somos/page.tsx`: página institucional atualizada.
- `src/components/site-chrome.tsx` e `src/components/video-footer.tsx`: navegação e rodapé partilhados.
- `src/app/page.tsx`, `src/app/globals.css` e `public/`: home, visual e assets.

## Bugs Conhecidos e Dívida Técnica

- Há outras páginas/componentes ainda com risco de sequências de encoding incorretas. Corrigir página a página e validar o HTML publicado; atenção especial a texto JSX direto.
- `createLead()` grava apenas `nome`, `email`, `telemovel`, `tipos` e `criado_em`; `message` e `property_id` não são claramente persistidos.
- `getPropertyBySlug()` lê um conjunto amplo de `imoveis` e filtra em memória.
- `getAgents()` deriva agentes de `imoveis`, sem tabela dedicada.
- Alguns imóveis Supabase têm áreas, WC ou descrições incompletas.
- O schema local e o modelo runtime Supabase continuam desalinhados.
- QA visual automatizado não está fiável neste ambiente; validar manualmente páginas e mobile após alterações visuais.

## Próximos Passos

1. Corrigir encoding nas restantes páginas e componentes, validando sempre local e em produção.
2. Fazer ronda de QA visual responsiva: home, imóveis, detalhe, contacto, blog e rodapé.
3. Decidir e implementar persistência de `message` e `property_id` em `contactos`.
4. Rever e completar dados reais em `imoveis`.
5. Otimizar leitura de detalhe e definir uma fonte dedicada para agentes.
6. Configurar integração Cloudflare Workers Builds com GitHub se forem desejados deploys automáticos.

## Histórico Recente

- `4d5f5c9`: correção do rótulo Imóveis no rodapé.
- `b782cad`: correção de renderização de texto na página Quem Somos.
- `ca73799`: redesign da página Quem Somos.
- `6424d90`: imagens para cartões de serviços.
- `0aeab2e`: vídeo hero compatível com Cloudflare Workers.
