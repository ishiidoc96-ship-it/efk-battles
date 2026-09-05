-- =============================================================
-- EFK Battles - Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Tournaments
create table if not exists public.tournaments (
  id           uuid primary key default gen_random_uuid(),
  name         text not null default 'EFK Battle',
  status       text not null default 'open' check (status in ('open','active','complete')),
  champion_id  uuid,
  champion_tag text,
  created_at   timestamptz not null default now()
);

-- 2. Players
create table if not exists public.players (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  gamer_tag     text not null,
  ef_id         text not null,
  whatsapp      text not null,
  mpesa         text not null,
  status        text not null default 'registered' check (status in ('registered','paid','playing','waitlisted')),
  transaction_id text,
  waitlisted    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_players_tournament on public.players(tournament_id);
create index if not exists idx_players_status on public.players(status);

-- 3. Matches (tournament bracket)
create table if not exists public.matches (
  id                  uuid primary key default gen_random_uuid(),
  tournament_id       uuid not null references public.tournaments(id) on delete cascade,
  round               int not null check (round between 1 and 5),
  round_label         text not null default 'R32',
  pos                 int not null default 0,
  player_a_player_id  uuid references public.players(id),
  player_b_player_id  uuid references public.players(id),
  player_a_tag        text,
  player_b_tag        text,
  winner_player_id    uuid references public.players(id),
  status              text not null default 'waiting' check (status in ('waiting','pending','approved','disputed')),
  room_code           text not null default '00000000',
  fixture_time        timestamptz,
  -- scores (from each player's perspective)
  a_scored            int,
  a_conceded          int,
  b_scored            int,
  b_conceded          int,
  -- uploads
  upload_a_url        text,
  upload_b_url        text,
  upload_a_at         timestamptz,
  upload_b_at         timestamptz,
  recording_a_url     text,
  recording_b_url     text,
  final_score         text,
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_matches_tournament on public.matches(tournament_id);
create index if not exists idx_matches_round on public.matches(round);
create index if not exists idx_matches_status on public.matches(status);

-- 4. Transactions (M-Pesa via Lipana)
create table if not exists public.transactions (
  id             text primary key,          -- Lipana transaction id
  player_id      uuid not null references public.players(id),
  amount         int not null default 100,
  phone          text,
  status         text not null default 'pending' check (status in ('pending','success','failed','cancelled')),
  mpesa_receipt  text,
  raw            jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists idx_transactions_player on public.transactions(player_id);

-- 5. Storage bucket for result screenshots
-- Run this if the bucket doesn't exist yet.
insert into storage.buckets (id, name, public)
  values ('screenshots', 'screenshots', true)
  on conflict (id) do nothing;

-- Optional: set a 5MB file size limit on the bucket (Supabase dashboard is easier for this)
-- Dashboard > Storage > screenshots > Settings > Max file size = 5MB

-- =============================================================
-- NOTES:
-- 1. RLS is NOT enabled so the anon key can read/write directly.
--    For production, enable RLS and create policies.
-- 2. The anon key is safe to expose in the browser for public reads.
-- 3. Admin mutations go through /api/admin/action with password check.
-- 4. To reset a tournament, DELETE FROM matches WHERE tournament_id = X,
--    then UPDATE players SET status = 'paid' WHERE tournament_id = X,
--    then UPDATE tournaments SET status = 'open' WHERE id = X.
--    Or use the admin panel "Reset" button.
-- =============================================================