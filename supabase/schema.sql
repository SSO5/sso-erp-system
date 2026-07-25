create table if not exists public.job_orders (
  id text primary key,
  joNumber text not null,
  client text not null default '',
  projectName text not null default '',
  value integer not null default 0,
  startDate text,
  deadline text,
  pic text,
  status text not null default 'Draft',
  created_at timestamptz not null default now()
);

create table if not exists public.numbering_records (
  id text primary key,
  docNumber text not null,
  category text not null default 'SURAT',
  description text not null default '',
  date text,
  pic text,
  client text not null default '-',
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  name text not null,
  folderId text not null,
  subfolder text not null,
  size integer not null default 0,
  date text,
  uploader text not null default 'User',
  type text not null default 'application/octet-stream',
  created_at timestamptz not null default now()
);

alter table public.job_orders enable row level security;
alter table public.numbering_records enable row level security;
alter table public.documents enable row level security;

create policy if not exists "Allow anon read/write on job_orders"
  on public.job_orders for all
  using (true)
  with check (true);

create policy if not exists "Allow anon read/write on numbering_records"
  on public.numbering_records for all
  using (true)
  with check (true);

create policy if not exists "Allow anon read/write on documents"
  on public.documents for all
  using (true)
  with check (true);
