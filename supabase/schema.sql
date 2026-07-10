create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  phone text,
  email text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  business text not null check (business in ('comprar', 'arrendar', 'trespassar')),
  type text not null,
  location text not null,
  price integer not null check (price >= 0),
  bedrooms integer,
  bathrooms integer,
  area_sqm integer not null check (area_sqm > 0),
  status text not null default 'Disponível',
  featured boolean not null default false,
  published boolean not null default false,
  agent_id uuid references agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,
  alt text not null,
  sort_order integer not null default 1,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('form', 'chat', 'property_detail')),
  name text not null,
  email text,
  phone text,
  message text not null,
  request_type text not null,
  property_id uuid references properties(id) on delete set null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint lead_contact_required check (email is not null or phone is not null)
);

create index if not exists properties_published_idx on properties (published, featured, created_at desc);
create index if not exists properties_filters_idx on properties (business, type, location, price, bedrooms, area_sqm);
create index if not exists property_images_property_idx on property_images (property_id, sort_order);
