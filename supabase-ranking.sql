-- ICHIGEKI online ranking setup
-- Supabase SQL EditorでこのSQLを実行してください。

create extension if not exists pgcrypto;

create table if not exists public.ranking (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  score integer not null default 0,
  chain_count integer not null default 0,
  spins integer not null default 0,
  diff integer not null default 0,
  used_balls integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.ranking
  add column if not exists chain_count integer not null default 0,
  add column if not exists spins integer not null default 0,
  add column if not exists diff integer not null default 0,
  add column if not exists used_balls integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

alter table public.ranking enable row level security;

drop policy if exists ranking_select on public.ranking;
drop policy if exists ranking_insert on public.ranking;

create policy ranking_select
on public.ranking
for select
to anon
using (true);

create policy ranking_insert
on public.ranking
for insert
to anon
with check (
  nickname <> ''
  and char_length(nickname) <= 10
  and score >= 0
  and chain_count >= 0
  and spins >= 0
  and used_balls >= 0
  and diff = score - used_balls
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ranking_diff_matches_score'
      and conrelid = 'public.ranking'::regclass
  ) then
    alter table public.ranking
      add constraint ranking_diff_matches_score
      check (diff = score - used_balls) not valid;
  end if;
end $$;

create index if not exists ranking_score_idx
on public.ranking (score desc, created_at asc);

create index if not exists ranking_chain_idx
on public.ranking (chain_count desc, score desc);

create index if not exists ranking_spins_idx
on public.ranking (spins desc, created_at asc);
