-- ════════════════════════════════════════════════
-- Migration — corrigir constraint de preferencia_contacto em `recrutamento`
-- ════════════════════════════════════════════════
-- Achado 2026-09-01, a testar o funil de conversão: a constraint original
-- (migration 20260714000000) só aceitava 'telefone'/'email'/'whatsapp',
-- mas o formulário real (src/components/recruitment-form.tsx) e o Zod em
-- src/app/api/recrutamento/route.ts pedem preferência de HORÁRIO, não de
-- canal — "Manhã (9h-13h)"/"Tarde (14h-18h)"/"Fim de dia (após 18h)"/
-- "Qualquer horário" (default do <select>). O schema do formulário mudou
-- em algum momento e esta migração nunca acompanhou — resultado: TODA
-- candidatura de recrutamento real estava a falhar com "new row for
-- relation recrutamento violates check constraint
-- recrutamento_preferencia_contacto_check", confirmado via insert direto
-- com service_role reproduzindo o payload exato do formulário.

alter table recrutamento drop constraint if exists recrutamento_preferencia_contacto_check;

alter table recrutamento add constraint recrutamento_preferencia_contacto_check
  check (preferencia_contacto in ('Manhã (9h-13h)', 'Tarde (14h-18h)', 'Fim de dia (após 18h)', 'Qualquer horário'));

-- ── VERIFICAÇÃO ──────────────────────────────────────────────────────────
-- insert into recrutamento (nome, email, telemovel, localidade,
--   situacao_profissional, motivacao, preferencia_contacto, aceita_whatsapp,
--   quiz_respostas, pontuacao, nivel, consentimento_privacidade_em)
-- values ('teste', 'teste@teste.pt', '900000000', 'Figueira da Foz', 'x',
--   'xxxxxxxxxxxx', 'Qualquer horário', true, '[]', 20, 'bom_potencial', now());
-- -- deve inserir sem erro; apagar a seguir.
