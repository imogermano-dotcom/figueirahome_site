# AGENTS.md - Figueira Home

Contexto operativo desta cópia do projeto para retomar trabalho sem depender de histórico externo.

## O que este projeto é

Site institucional e catálogo imobiliário da Figueira Home em Next.js App Router, com:

- listagem e detalhe de imóveis
- pesquisa com filtros
- leads por formulário e por chat
- chat AI com pesquisa de imóveis publicados
- fallback para dados locais quando Supabase não está configurado

## Estado atual - Handoff 2026-07-10

### Resumo executivo

- a app compila e arranca localmente
- `npm run build` passou com sucesso em 2026-07-09 e 2026-07-10
- home, listagem, detalhe, `/api/leads` e `/api/chat` responderam corretamente nos smoke tests
- esta cópia continua sem `.git`, portanto não há histórico local fiável

### O que foi implementado e validado

- reconstruído um novo `AGENTS.md` para esta cópia
- confirmado que o runtime real usa Supabase com tabelas `imoveis` e `contactos`
- registado que `supabase/schema.sql` não corresponde ao modelo runtime atual
- testado o site localmente com resposta `200` nas páginas principais
- testado `POST /api/leads` com sucesso
- testado `POST /api/chat` com sucesso
- corrigidos links do footer que antes apontavam quase todos para `/imoveis`
- removido o fallback falso de área `1 m²`
- quando a área não existe, a UI agora mostra `-`
- metadata do detalhe do imóvel já não inclui área inexistente

### Ficheiros principais modificados recentemente

- `AGENTS.md`
- `src/components/video-footer.tsx`
- `src/lib/format.ts`
- `src/lib/properties.ts`
- `src/lib/types.ts`
- `src/app/imoveis/[slug]/page.tsx`

### Decisões arquiteturais em vigor

- fonte de verdade atual de leitura: tabela `imoveis`
- fonte de verdade atual de escrita de leads: tabela `contactos`
- `supabase/schema.sql` é apenas referência local e não deve ser assumido como contrato real
- sem Supabase configurado, a app deve continuar funcional com `sample-data.ts`
- só aparecem imóveis com `disponibilidade = "Disponível"` e preço > 0
- o negócio é inferido:
  - só arrendamento com preço de arrendamento -> `arrendar`
  - caso contrário -> `comprar`
- o chat deve responder em PT-PT e nunca inventar imóveis, preços ou disponibilidade
- a unidade de área deve ser sempre `m²`

### Bugs conhecidos e dívida técnica

- esta cópia não tem `.git`; não há auditoria local de alterações
- `README.md` e alguns outputs em PowerShell mostram sinais de encoding degradado
- `createLead()` continua minimalista para produção:
  - não grava claramente o corpo completo da mensagem
  - não grava `property_id`
- `supabase/schema.sql` e o runtime atual estão desalinhados
- `getPropertyBySlug()` lê um conjunto largo da tabela e filtra em memória
- `getAgents()` depende de `imoveis` em vez de uma tabela dedicada de agentes
- alguns imóveis reais vindos de Supabase continuam com dados incompletos:
  - áreas em falta
  - WC em falta
  - descrições curtas ou pobres em alguns casos
- o teste visual automático por Playwright falhou por indisponibilidade/permissão para descarregar o pacote no ambiente

### Próximos passos recomendados

1. Decidir se `contactos` deve passar a guardar `message` e `property_id`.
2. Rever qualidade dos dados vindos de `imoveis` no Supabase.
3. Validar se convém otimizar `getPropertyBySlug()` para evitar leitura ampla.
4. Corrigir encoding da documentação local se isso estiver a afetar edição.
5. Fazer uma ronda de QA visual manual no browser, já que a automação visual falhou neste ambiente.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase JS
- AI SDK (`ai`, `@ai-sdk/react`)
- Zod

Scripts disponíveis:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Estrutura relevante

```text
src/app/
  page.tsx
  imoveis/page.tsx
  imoveis/[slug]/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  contacto/page.tsx
  quem-somos/page.tsx
  empreendimentos/page.tsx
  api/chat/route.ts
  api/leads/route.ts

src/components/
  chat-widget.tsx
  contact-form.tsx
  property-card.tsx
  quick-search.tsx
  site-chrome.tsx
  video-footer.tsx

src/lib/
  properties.ts
  supabase.ts
  sample-data.ts
  types.ts
  format.ts
  property-images.ts
  assets.ts

supabase/
  schema.sql
  seed.sql
```

## Ambiente

Variáveis esperadas em `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://figueirahome.pt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_MODEL=openai/gpt-5.4
```

Comportamento atual:

- sem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`, a app usa dados locais
- `getSupabaseServiceClient()` usa `SUPABASE_SERVICE_ROLE_KEY`; se faltar, cai para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- sem cliente Supabase válido:
  - imóveis e agentes vêm de `sample-data.ts`
  - leads devolvem `{ ok: true, id: "local-fallback" }`

## Regras para futuros agentes

- não assumir que existe repositório Git nesta pasta
- não remover o fallback local sem instrução explícita
- não expor imóveis não publicados
- não mudar a unidade de área para outra diferente de `m²`
- não inventar campos de Supabase sem confirmar no código real
- ao alterar leads, rever `src/app/api/leads/route.ts` e `src/lib/properties.ts`
- ao alterar pesquisa/chat, manter coerência entre tools e páginas públicas
- antes de mexer em schema, confirmar se a fonte de verdade é `imoveis/contactos` ou apenas o `schema.sql` local
