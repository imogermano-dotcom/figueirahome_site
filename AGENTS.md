# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-08-18. Manter este ficheiro abaixo de 200 linhas; substituir informação ultrapassada em vez de a acumular.

## Projeto e estado atual

- Site institucional e catálogo imobiliário da Figueira Home, em Next.js App Router, Supabase, contactos, recrutamento, chat AI e fallback local.
- Produção: `https://figueira-home.miguel-germano.workers.dev` (Cloudflare Worker `figueira-home`). Último deploy validado: versão `e029b7ad-64b7-4dac-9cc3-d9c385cd47fb`, em 2026-08-18.
- Ramo ativo: `teste/alteracao-cliente`. Último commit local: `1231edc Corrigir estrutura e tabelas do blog`; este commit ainda não foi enviado para `origin`. O último commit já enviado foi `a56908d Publicar arquivo completo do blog`.
- Produção usa `next build --webpack`; `npm.cmd run deploy` executa OpenNext e publica no Worker. Não usar Turbopack para produção. O OpenNext apresenta avisos no Windows; se houver falhas imprevisíveis, preferir WSL sem alterar o runtime.
- Não expor valores de `.env.local` nem segredos de Supabase, AI, MailerLite ou Cloudflare.

### Estado do worktree

- `AGENTS.md` está modificado por este handoff e deve ser incluído apenas no próximo commit intencional.
- `property-catalogue-local.png` é um ficheiro local não relacionado: não versionar nem remover.
- `client-reference/` está ignorado; contém a referência do cliente e o PDF do blog. Não publicar nem versionar esse diretório.
- `supabase/.temp/` é estado local ignorado e nunca deve entrar em commits.

## Implementado

### Blog e arquivo editorial

- Foram importados 68 artigos completos do blog antigo, com 190 imagens extraídas do PDF de referência. O conteúdo está em `src/content/blog-archive.json` e as imagens em `public/blog/archive/`; ambos já estão versionados.
- `/blog` mostra o artigo mais recente por data como destaque editorial: imagem, título numa faixa azul, até dois parágrafos reais e botão “Ler mais”. Os restantes artigos mantêm a lista editorial.
- O título “Guias para tomar decisões com mais confiança.” foi reduzido para caber numa linha em desktop, permitindo que o destaque seja visível no primeiro ecrã.
- As páginas `/blog/[slug]` usam uma imagem de capa, título sobre faixa azul, autor/data e conteúdo semântico (parágrafos, títulos, listas, tabelas e imagens). O texto inicia na margem esquerda da imagem; o link “Todos os artigos” fica acima do artigo e não cria coluna lateral.
- As tabelas passaram de texto pré-formatado para tabelas HTML responsivas. Blocos consecutivos extraídos do PDF são agrupados e linhas partidas são reunidas por heurística. A primeira tabela do artigo de heranças foi corrigida manualmente: `2022` para a revisão do Código Civil e `2020` para as alterações fiscais, confirmados no site antigo.
- O item “Empreendimentos” foi ocultado do menu principal. A rota e o link no rodapé permanecem disponíveis.

### Catálogo, homepage e equipa

- A fonte runtime é a tabela Supabase `imoveis`. Só aparecem imóveis com `publicado = true`, `disponibilidade = "Disponível"`, `imovel_ref` válido e preço positivo.
- Catálogo, detalhe e pesquisa rápida suportam `imovel_ref`. A ficha junta `foto_principal` e `fotos` sem duplicados, inclui galeria/modal/teclado, certificado energético, cartões condicionais, mapa aproximado, vídeo e plantas quando existem.
- Arrendamento só é apresentado quando existe `arrendamento_preco` positivo e não existe venda válida. Destaques usam primeiro `destaque = true`, ordenados por data recente, com fallback para imóveis publicados recentes.
- `HeroExperience` tem CTAs e vitrine de até três imóveis com vídeo válido. Usa posters e miniaturas, sem iframes YouTube antes da reprodução; embeds usam `youtube-nocookie`, `cc_load_policy=0` e `iv_load_policy=3`.
- Equipa atual: Sofia Monteiro, Miguel Germano, Alexandra Santos, Giulia Almeida, Alexsandra Ferreira e Sandra Silva. Cartões ligam para `/consultores/[slug]`; os imóveis são associados por `angariador`, com `vendedor` como fallback.

### Contactos e recrutamento

- O formulário de contacto exige consentimento RGPD; a API rejeita pedidos sem `privacy_consent: true`.
- `/recrutamento` grava candidaturas e sincroniza os grupos MailerLite configurados no Worker.
- Sem Supabase válido, imóveis e agentes usam `sample-data.ts`; leads devolvem `local-fallback`.

## Ficheiros principais

- `src/content/blog-archive.json`: arquivo estático dos 68 artigos; contém o conteúdo, datas, imagens e blocos semânticos.
- `public/blog/archive/`: imagens do arquivo do blog, servidas localmente pelo site.
- `src/lib/blog.ts`: tipos do blog, pesquisa/relacionados, formatação de data e reconstrução de tabelas (`mergeBlogTableBlocks()` e `toBlogTable()`).
- `src/app/blog/page.tsx`: índice, destaque do artigo mais recente e lista dos restantes.
- `src/app/blog/[slug]/page.tsx`: página de artigo, renderização de blocos, tabelas, galeria e relacionados.
- `src/components/site-chrome.tsx`: navegação principal; “Empreendimentos” está removido daqui.
- `src/lib/properties.ts`, `src/app/imoveis/[slug]/page.tsx`, `src/components/hero-experience.tsx` e `src/components/property-video.tsx`: catálogo, detalhe e hero.
- `src/app/consultores/[slug]/page.tsx`, `src/lib/team.ts`, `src/app/quem-somos/page.tsx` e `src/app/sitemap.ts`: perfis e indexação.

## Decisões arquiteturais

- O PDF é apenas fonte editorial local; o site publica dados e imagens já extraídos, nunca o PDF.
- Não há CMS nesta fase: o arquivo do blog é estático e pode ser migrado mais tarde para um CMS.
- `publicado` é a autoridade para retirar um imóvel do site sem apagar o registo.
- O mapa usa apenas zona/freguesia/concelho, nunca morada, número ou código-postal.
- Não existe tabela dedicada de agentes: responsáveis derivam de `angariador`/`vendedor` e são enriquecidos por `figueiraTeam`/`sampleAgents`.
- O fallback local é deliberado. O chat responde em PT-PT, consulta apenas imóveis publicados e não inventa preços, disponibilidade ou imóveis.
- Para tabelas do blog, preferir correcções manuais verificadas no site antigo sempre que a extração do PDF não fornecer células completas; não inventar valores.

## Bugs conhecidos e dívida técnica

- A extração do PDF perdeu ou reordenou células em várias tabelas. A reconstrução HTML resolve a apresentação, mas é uma heurística; comparar as tabelas relevantes com `https://figueirahome.pt` antes de as considerar editorialmente validadas.
- Alguns artigos mantêm texto originalmente publicado em português do Brasil; foi preservado por se tratar de arquivo histórico.
- Alguns imóveis reais têm fotos, áreas, WC, descrições, plantas ou vídeos incompletos; corrigir na origem.
- A página do consultor considera apenas um responsável: `angariador` tem prioridade e `vendedor` é fallback; não mostra ambos quando coexistem. Sandra Silva ainda não tem imóveis atribuídos na origem.
- `getPropertyBySlug()` carrega até 500 imóveis e filtra em memória; substituir por consulta direta por referência/slug.
- Confirmar se `message` e `property_id` são persistidos em `contactos`. `supabase/schema.sql` e migrations remotas podem divergir; usar `supabase db push` com cautela.
- Validar HTML publicado para sequências antigas de encoding incorreto e avaliar carregamento progressivo na galeria.

## Próximos passos recomendados

1. Enviar o commit `1231edc` para `origin/teste/alteracao-cliente` quando for pedido, pois já está publicado em produção mas ainda não foi feito push.
2. Fazer QA responsivo em produção do blog: índice, destaque, páginas de artigo, imagens, listas e principalmente tabelas.
3. Validar e corrigir manualmente, por lotes, as tabelas dos artigos mais relevantes comparando com o blog antigo; começar por heranças e os artigos que apresentam colunas/células em falta.
4. Fazer QA completo de hero, perfis, catálogo, detalhe/plantas, contacto, recrutamento e rodapés em produção.
5. Atualizar `imoveis` na origem com dados completos, plantas e imóveis atribuídos à Sandra; decidir se cada imóvel deve suportar simultaneamente `angariador` e `vendedor` nos perfis.
6. Confirmar a estrutura de `contactos`, otimizar `getPropertyBySlug()` e avaliar uma tabela própria para agentes/CMS do blog.
