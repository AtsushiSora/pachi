-- ICHIGEKI online ranking setup
-- Supabase SQL EditorでこのSQLを実行してください。
-- 目的:
-- 1. ランキング用テーブルを作る
-- 2. 誰でも閲覧・登録はできる
-- 3. ブラウザから順位や差玉を書き換えられても、不自然な値はDB側で弾く

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

grant usage on schema public to anon;
grant select, insert on public.ranking to anon;
revoke update, delete on public.ranking from anon, authenticated;

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
  btrim(nickname) <> ''
  and char_length(nickname) <= 10
  and nickname = btrim(nickname)
  and nickname !~* 'https?:|www\.|\.com|\.net|\.jp|@|[0-9０-９]{8,}|[0-9０-９]{2,4}[-ー−][0-9０-９]{2,4}[-ー−][0-9０-９]{3,4}'
  and score >= 0
  and score <= 2000000
  and chain_count >= 0
  and chain_count <= 10000
  and spins >= 0
  and spins <= 2000000
  and used_balls >= 0
  and used_balls <= 2000000
  and diff = score - used_balls
  and created_at <= now() + interval '5 minutes'
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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ranking_nickname_has_no_contact'
      and conrelid = 'public.ranking'::regclass
  ) then
    alter table public.ranking
      add constraint ranking_nickname_has_no_contact
      check (
        nickname !~* 'https?:|www\.|\.com|\.net|\.jp|@|[0-9０-９]{8,}|[0-9０-９]{2,4}[-ー−][0-9０-９]{2,4}[-ー−][0-9０-９]{3,4}'
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ranking_nickname_is_clean'
      and conrelid = 'public.ranking'::regclass
  ) then
    alter table public.ranking
      add constraint ranking_nickname_is_clean
      check (
        btrim(nickname) <> ''
        and char_length(nickname) <= 10
        and nickname = btrim(nickname)
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ranking_values_are_reasonable'
      and conrelid = 'public.ranking'::regclass
  ) then
    alter table public.ranking
      add constraint ranking_values_are_reasonable
      check (
        score between 0 and 2000000
        and chain_count between 0 and 10000
        and spins between 0 and 2000000
        and used_balls between 0 and 2000000
      ) not valid;
  end if;
end $$;

create index if not exists ranking_score_idx
on public.ranking (score desc, created_at asc);

create index if not exists ranking_chain_idx
on public.ranking (chain_count desc, score desc);

create index if not exists ranking_spins_idx
on public.ranking (spins desc, created_at asc);

create table if not exists public.juggle_ranking (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  juggle_chain integer not null default 0,
  diff integer not null default 0,
  total_games integer not null default 0,
  investment_yen integer not null default 0,
  medals integer not null default 0,
  invested_medals integer not null default 0,
  big_count integer not null default 0,
  reg_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.juggle_ranking
  add column if not exists juggle_chain integer not null default 0,
  add column if not exists diff integer not null default 0,
  add column if not exists total_games integer not null default 0,
  add column if not exists investment_yen integer not null default 0,
  add column if not exists medals integer not null default 0,
  add column if not exists invested_medals integer not null default 0,
  add column if not exists big_count integer not null default 0,
  add column if not exists reg_count integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

alter table public.juggle_ranking enable row level security;

grant select, insert on public.juggle_ranking to anon;
revoke update, delete on public.juggle_ranking from anon, authenticated;

drop policy if exists juggle_ranking_select on public.juggle_ranking;
drop policy if exists juggle_ranking_insert on public.juggle_ranking;

create policy juggle_ranking_select
on public.juggle_ranking
for select
to anon
using (true);

create policy juggle_ranking_insert
on public.juggle_ranking
for insert
to anon
with check (
  btrim(nickname) <> ''
  and char_length(nickname) <= 10
  and nickname = btrim(nickname)
  and nickname !~* 'https?:|www\.|\.com|\.net|\.jp|@|[0-9０-９]{8,}|[0-9０-９]{2,4}[-ー−][0-9０-９]{2,4}[-ー−][0-9０-９]{3,4}'
  and juggle_chain >= 0
  and juggle_chain <= 10000
  and diff between -2000000 and 2000000
  and total_games between 0 and 2000000
  and investment_yen between 0 and 100000000
  and medals between 0 and 2000000
  and invested_medals between 0 and 2000000
  and big_count between 0 and 10000
  and reg_count between 0 and 10000
  and diff = medals - invested_medals
  and created_at <= now() + interval '5 minutes'
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'juggle_ranking_diff_matches_medals'
      and conrelid = 'public.juggle_ranking'::regclass
  ) then
    alter table public.juggle_ranking
      add constraint juggle_ranking_diff_matches_medals
      check (diff = medals - invested_medals) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'juggle_ranking_nickname_has_no_contact'
      and conrelid = 'public.juggle_ranking'::regclass
  ) then
    alter table public.juggle_ranking
      add constraint juggle_ranking_nickname_has_no_contact
      check (
        nickname !~* 'https?:|www\.|\.com|\.net|\.jp|@|[0-9０-９]{8,}|[0-9０-９]{2,4}[-ー−][0-9０-９]{2,4}[-ー−][0-9０-９]{3,4}'
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'juggle_ranking_nickname_is_clean'
      and conrelid = 'public.juggle_ranking'::regclass
  ) then
    alter table public.juggle_ranking
      add constraint juggle_ranking_nickname_is_clean
      check (
        btrim(nickname) <> ''
        and char_length(nickname) <= 10
        and nickname = btrim(nickname)
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'juggle_ranking_values_are_reasonable'
      and conrelid = 'public.juggle_ranking'::regclass
  ) then
    alter table public.juggle_ranking
      add constraint juggle_ranking_values_are_reasonable
      check (
        juggle_chain between 0 and 10000
        and diff between -2000000 and 2000000
        and total_games between 0 and 2000000
        and investment_yen between 0 and 100000000
        and medals between 0 and 2000000
        and invested_medals between 0 and 2000000
        and big_count between 0 and 10000
        and reg_count between 0 and 10000
      ) not valid;
  end if;
end $$;

create index if not exists juggle_ranking_chain_idx
on public.juggle_ranking (juggle_chain desc, diff desc, total_games asc);
