-- NFC Manager - execute este arquivo no SQL Editor do seu projeto Supabase.
create extension if not exists pgcrypto;

create table if not exists public.nfc_cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('pix', 'wifi')),
  -- Slug é gerado uma única vez no cadastro e não deve ser alterado em edições.
  slug text not null unique check (length(slug) >= 12),
  business_name text not null,
  pix_holder text,
  pix_key text,
  pix_key_type text check (pix_key_type is null or pix_key_type in ('cpf','cnpj','telefone','email','aleatoria')),
  pix_copy_paste text,
  wifi_ssid text,
  wifi_password text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pix_required_fields check (type <> 'pix' or (pix_copy_paste is not null and length(trim(pix_copy_paste)) > 0)),
  constraint wifi_required_fields check (type <> 'wifi' or (wifi_ssid is not null and length(trim(wifi_ssid)) > 0 and wifi_password is not null and length(wifi_password) > 0))
);

create index if not exists nfc_cards_owner_created_idx on public.nfc_cards(owner_id, created_at desc);
create index if not exists nfc_cards_slug_idx on public.nfc_cards(slug);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists nfc_cards_updated_at on public.nfc_cards;
create trigger nfc_cards_updated_at before update on public.nfc_cards
for each row execute function public.set_updated_at();

alter table public.nfc_cards enable row level security;

-- O painel só pode consultar e alterar os próprios registros autenticados.
drop policy if exists "Owners can view their cards" on public.nfc_cards;
create policy "Owners can view their cards" on public.nfc_cards
for select to authenticated using (auth.uid() = owner_id);

drop policy if exists "Owners can create their cards" on public.nfc_cards;
create policy "Owners can create their cards" on public.nfc_cards
for insert to authenticated with check (auth.uid() = owner_id);

drop policy if exists "Owners can update their cards" on public.nfc_cards;
create policy "Owners can update their cards" on public.nfc_cards
for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "Owners can delete their cards" on public.nfc_cards;
create policy "Owners can delete their cards" on public.nfc_cards
for delete to authenticated using (auth.uid() = owner_id);

-- Não crie políticas de leitura pública/anon para esta tabela.
-- As páginas públicas consultam os dados no servidor usando a SERVICE ROLE KEY,
-- que nunca é enviada ao navegador. O slug aleatório funciona como identificador não adivinhável.
