# AGENTS.md — Figueira Home

Handoff operacional atualizado em 2026-07-30. Manter este ficheiro abaixo de 200 linhas e substituir informação ultrapassada em vez de a acumular.

## Projeto e estado atual

- Site institucional e catálogo imobiliário da Figueira Home em Next.js App Router, com Supabase, contactos, recrutamento, chat AI e fallback local.
- Produção atual: `https://figueira-home.miguel-germano.workers.dev` (Cloudflare Worker `figueira-home`). Nenhuma alteração do ramo de teste foi publicada.
- Ramo ativo: `teste/alteracao-cliente`; não há commits nem deploys novos desta sessão.
- `npm.cmd run build` (Webpack) passou neste ramo após as alterações de hero e consultores. O lint dos ficheiros alterados também passou.
- O servidor local esteve disponível em `http://localhost:3000` durante a validação visual; confirmar a porta antes de reutilizar.
- Não expor valores de `.env.local` nem secrets de Supabase, AI ou MailerLite.

### Estado do worktree

- Alterações intencionais ainda não versionadas: hero experimental, perfis de consultores, dados da equipa, sitemap, `public/equipa/sandra-silva.png` e este handoff.
- `supabase/.temp/` é estado local: nunca incluir em commits.
- `public/ideia site.png` é a referência visual fornecida pelo cliente; manter fora do deploy/commit salvo instrução contrária.
- Existem várias capturas locais `hero-*.png`, `visual-hero-*.png` e `consultant-*.png` na raiz. São artefactos de QA e devem ser removidos ou ignorados antes do commit, após confirmação do utilizador.

## Implementado

### Catálogo, detalhe e pesquisa

- A fonte runtime é a tabela Supabase `imoveis`. Só aparecem imóveis com `publicado = true`, `disponibilidade = "Disponível"`, `imovel_ref` válido e preço positivo.
- Catálogo, detalhe e pesquisa rápida suportam referência `imovel_ref`.
- O detalhe reúne `foto_principal` e `fotos` sem duplicados; tem galeria, modal, teclado, certificado energético, cartões condicionais, mapa aproximado e vídeo quando existe `video_url`.
- Vídeos suportam YouTube, Vimeo e URL direta; `videoSourceFromUrl()` é exportado por `src/components/property-video.tsx` para reutilização.
- Arrendamento só é apresentado quando existe `arrendamento_preco` positivo e não existe venda válida.
- Destaques: imóveis com vista de mar/praia, piscina ou terraço; se faltarem, usa os disponíveis mais recentes.

### Homepage e hero experimental

- A homepage mantém destaques antes dos serviços e inclui a equipa.
- A hero foi substituída por `HeroExperience`: texto e CTAs à esquerda, quatro provas de valor com ícones, divisor vertical e vitrine à direita.
- A vitrine usa exclusivamente até três imóveis publicados com `video_url` válido. O reel principal e as miniaturas laterais são vídeos de imóveis; não usa imagens estáticas nem o vídeo institucional nessa vitrine.
- As miniaturas de vídeos verticais são recortadas ao centro para evitar margens escuras. O vídeo de fundo geral da hero permanece separado.
- Foi acrescentado sublinhado dourado sob “Figueira da Foz.” e o texto de apoio sobre transparência e resultados.
- Layout responsivo específico para hero e vitrine em mobile.

### Equipa e páginas de consultores

- Equipa atual: Sofia Monteiro, Miguel Germano, Alexandra Santos, Giulia Almeida, Alexsandra Ferreira e Sandra Silva.
- Alexandra Santos e Alexsandra Ferreira têm biografias completas extraídas do ficheiro ODT do cliente; Sandra Silva tem perfil completo e retrato local.
- Cada cartão da equipa, na home e em `/quem-somos`, liga para `/consultores/[slug]`.
- Cada perfil mostra fotografia, função, descrição, contactos disponíveis e imóveis associados, com links para os detalhes.
- A associação é automática pelos dados de `angariador` ou, na ausência deste, `vendedor`. Alexandra Santos reconhece também o alias legado “Alexandra”.
- As rotas dos consultores estão incluídas no sitemap. Imóveis associados surgem apenas quando publicados/disponíveis através de `getProperties()`.

### Contactos, recrutamento e comunicação

- O formulário de contacto exige consentimento RGPD; a API rejeita pedidos sem `privacy_consent: true`.
- `/recrutamento` tem questionário, candidatura e rodapé próprio. Candidaturas são gravadas e sincronizadas com os grupos MailerLite configurados no Worker.
- Leads normais escrevem em `contactos`. Sem Supabase válido, imóveis e agentes usam `sample-data.ts` e leads devolvem `local-fallback`.
- Contactos e políticas indicam legalmente o custo de chamada.

## Ficheiros principais

- `src/components/hero-experience.tsx`: hero experimental, seleção e interação dos vídeos de imóveis.
- `src/app/page.tsx` e `src/app/globals.css`: integração e estilo responsivo da hero; grelha de equipa em três colunas desktop.
- `src/components/property-video.tsx`: resolução de fontes YouTube/Vimeo/diretas.
- `src/app/consultores/[slug]/page.tsx`: perfil individual e imóveis associados.
- `src/lib/team.ts`: membros, aliases, bios curtas e completas, incluindo Sandra Silva.
- `src/lib/properties.ts`: mapeamento Supabase, filtros e reconhecimento de membros/aliases.
- `src/app/quem-somos/page.tsx` e `src/app/sitemap.ts`: links para perfis e indexação.
- `public/equipa/sandra-silva.png`: retrato da Sandra.
- Também relevantes: `src/app/imoveis/page.tsx`, `src/app/imoveis/[slug]/page.tsx`, `src/components/quick-search.tsx`, `property-card.tsx`, `property-gallery.tsx`, `contact-form.tsx`, `src/app/api/leads/route.ts`, recrutamento e `video-footer.tsx`.

## Decisões arquiteturais

- `publicado` é a autoridade para retirar um imóvel do site sem apagar o registo.
- O mapa usa só zona/freguesia/concelho, nunca morada, número ou código-postal.
- Não há tabela dedicada de agentes: os responsáveis são derivados de `angariador`/`vendedor` e enriquecidos a partir de `figueiraTeam`/`sampleAgents`.
- O fallback local é deliberado e não deve ser removido sem instrução explícita.
- O chat responde em PT-PT, consulta apenas imóveis publicados e não inventa preços, disponibilidade ou imóveis.
- Build de produção deve manter `next build --webpack`; Turbopack não é compatível com o runtime OpenNext/Cloudflare atual.
- `npm.cmd run deploy` executa OpenNext e publica no Worker; manter `nodejs_compat` em `wrangler.jsonc`.

## Bugs conhecidos e dívida técnica

- Alguns imóveis reais têm fotos, áreas, WC, descrições ou vídeos incompletos; corrigir na origem.
- A página do consultor considera apenas um responsável por imóvel: `angariador` tem prioridade e `vendedor` é fallback. Não mostra ambos quando existem.
- Sandra Silva ainda não tem imóveis atribuídos na origem; o perfil mostra corretamente o estado vazio.
- `getPropertyBySlug()` carrega até 500 imóveis e filtra em memória; substituir por consulta direta por referência/slug.
- Confirmar/implementar persistência de `message` e `property_id` em `contactos`.
- `supabase/schema.sql` e migrations remotas podem divergir do runtime; usar `supabase db push` com cautela.
- A galeria de imóveis ainda carrega todas as miniaturas; avaliar carregamento progressivo/lazy.
- Validar HTML publicado para possíveis sequências antigas de encoding incorreto.

## Próximos passos recomendados

1. Fazer QA responsivo completo: hero de vídeos (desktop/mobile), perfis de todos os consultores, catálogo, detalhe, contacto, recrutamento, blog e rodapés.
2. Atualizar `imoveis` com dados completos e atribuir imóveis à Sandra; decidir se cada imóvel deve suportar simultaneamente angariador e vendedor nas páginas de perfil.
3. Rever a hero com o cliente e, se aprovada, remover as capturas de QA, preparar um commit seletivo e só depois pedir autorização para deploy.
4. Confirmar a estrutura de `contactos` e persistir mensagem e referência de imóvel.
5. Otimizar `getPropertyBySlug()` e avaliar tabela própria para agentes.
6. Validar uma candidatura ponta a ponta num ambiente controlado e avaliar miniaturas progressivas/CI de Cloudflare.
