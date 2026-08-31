-- ════════════════════════════════════════════════
-- Migration — RLS em `contactos` e `imoveis`
-- ════════════════════════════════════════════════
-- ⚠ NÃO APLICAR AINDA (2026-08-31). Este SQL parte o
-- https://github.com/imogermano-dotcom/figueira-home-portal: essa
-- ferramenta interna de corretores usa a MESMA chave `anon` (mesmo role
-- Postgres, mesmo projeto zphasvfopnbzwnaidsnw) diretamente do browser
-- para pesquisar `contactos` por telefone/email/nome, e para ler
-- `imoveis` incluindo `morada`/`proprietario` (relatório de imóvel).
-- RLS distingue por role, não por aplicação — como o site público e o
-- portal partilham o role `anon`, não há como restringir um sem partir
-- o outro. Correção real: o portal passar a usar `service_role` (ou
-- autenticação própria) em vez de `anon` — mudança nesse outro repo,
-- por decidir com o cliente antes de aplicar isto. Ver AGENTS.md.
--
-- Achado 2026-08-31: nenhuma das duas tabelas tinha RLS ativo. A chave
-- `anon` (publica, embutida no JS do site) conseguia ler `contactos` na
-- integra — 28.261 linhas com nome/email/telefone/data de nascimento/
-- consentimentos RGPD — e `imoveis` na integra — 4.464 linhas, incluindo
-- os ~4.410 nao publicados e colunas internas (proprietario, comissoes).
--
-- `recrutamento` ja estava correctamente bloqueada (RLS activo, sem
-- politicas para anon/authenticated) mas essa migracao nunca ficou
-- registada neste repo — aplicada directamente no dashboard. Esta
-- migracao traz `contactos`/`imoveis` ao mesmo nivel e fica commitada.
--
-- `service_role` (usado so server-side em src/lib/properties.ts e nas
-- rotas /api/leads, /api/recrutamento, /api/chat) contorna RLS sempre —
-- nada muda no fluxo normal do site.

-- ── contactos: bloqueio total para anon/authenticated ──────────────────
-- Sem uso client-side em lado nenhum do codigo (confirmado via grep);
-- so e escrito via createLead() em src/lib/properties.ts, que usa
-- getSupabaseServiceClient(). Sem politicas = acesso negado por omissao.
alter table contactos enable row level security;

-- ── imoveis: leitura publica so aos imoveis publicados+disponiveis ─────
-- src/components/property-detail-browser-fallback.tsx (browser, chave
-- anon) e o fallback em src/lib/properties.ts (SSR, mesma chave quando
-- o service client falha) fazem exactamente este filtro hoje a nivel de
-- query — a policy torna-o obrigatorio mesmo por acesso directo a API.
alter table imoveis enable row level security;

create policy "anon_le_imoveis_publicados" on imoveis
  for select
  to anon, authenticated
  using (publicado = true and disponibilidade = 'Disponível');

-- RLS e so ao nivel da linha — sem isto, um imovel publicado continuaria
-- a expor proprietario/comissoes/morada a quem chamasse a API directamente
-- com select=*. Restringe a exactamente as colunas que o codigo usa hoje
-- (ImovelRow em src/lib/properties.ts + ImovelDetailRow no fallback).
revoke select on imoveis from anon, authenticated;
grant select (
  imovel_ref, publicado, natureza, disponibilidade, estado, angariador,
  vendedor, titulo, quartos, area_util, area_bruta, area_terreno,
  venda_preco, arrendamento_preco, concelho, freguesia, zona,
  data_criacao, data_alteracao, descricao, casas_banho,
  certificacao_energetica, garagem, varanda, foto_principal, fotos,
  plantas, video_url, visita_virtual_url, destaque
) on imoveis to anon, authenticated;

-- ── VERIFICAÇÃO ──────────────────────────────────────────────────────────
-- Com a chave anon (NEXT_PUBLIC_SUPABASE_ANON_KEY):
--   select * from contactos limit 1;          -- deve devolver 0 linhas
--   select * from imoveis limit 5;             -- so publicado=true+Disponível
--   select proprietario from imoveis limit 1;  -- deve dar erro de coluna
-- Com a chave service_role: tudo continua a funcionar sem alteracoes.
