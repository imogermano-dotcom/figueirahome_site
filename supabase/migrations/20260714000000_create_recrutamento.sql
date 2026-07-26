create table if not exists recrutamento (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  telemovel text not null,
  localidade text not null,
  situacao_profissional text not null,
  motivacao text not null,
  preferencia_contacto text not null check (preferencia_contacto in ('telefone', 'email', 'whatsapp')),
  aceita_whatsapp boolean not null default false,
  quiz_respostas jsonb not null,
  pontuacao smallint not null check (pontuacao between 10 and 30),
  nivel text not null check (nivel in ('muito_alinhado', 'bom_potencial', 'potencial_com_reservas', 'menos_alinhado')),
  consentimento_privacidade_em timestamptz not null,
  mailerlite_estado text not null default 'pendente' check (mailerlite_estado in ('pendente', 'sincronizado', 'erro')),
  mailerlite_erro text,
  mailerlite_sincronizado_em timestamptz,
  criado_em timestamptz not null default now()
);

create index if not exists recrutamento_nivel_criado_em_idx on recrutamento (nivel, criado_em desc);
