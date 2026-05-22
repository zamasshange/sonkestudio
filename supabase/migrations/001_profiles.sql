-- Run in Supabase SQL editor to store SONKE user preferences synced from Clerk.

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  persona text not null check (
    persona in ('student', 'creator', 'business', 'developer', 'everyday')
  ),
  tool_categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_clerk_user_id_idx on public.profiles (clerk_user_id);

alter table public.profiles enable row level security;

-- Server sync uses SUPABASE_SECRET_KEY (sb_secret_...) via the API route.
-- Clerk publicMetadata still stores preferences if Supabase sync is unavailable.
