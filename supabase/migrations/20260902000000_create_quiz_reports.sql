-- Relatório de perfil gerado por IA para o quiz de recrutamento (briefing §6.1).
-- Token gerado pela BD é o segredo efetivo (32 chars hex); leitura pública por
-- token, sem política de INSERT (só a service_role, via /api/quiz-report, escreve).

create table public.quiz_reports (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique default encode(gen_random_bytes(16), 'hex'),
  email       text not null,
  nome        text,
  pontuacao   integer,
  nivel       text,
  report_json jsonb not null,
  criado_em   timestamptz not null default now()
);

alter table public.quiz_reports enable row level security;

create policy "leitura_publica_por_token"
  on public.quiz_reports for select
  to anon, authenticated
  using (true);
