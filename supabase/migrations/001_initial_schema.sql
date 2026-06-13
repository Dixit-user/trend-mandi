create extension if not exists pgcrypto;

create table if not exists public.users_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  instagram_handle text,
  niche text,
  tone text,
  language text,
  audience_type text,
  content_style text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.content_samples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  caption text not null,
  hashtags text[] default '{}',
  posted_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  niche text not null,
  description text not null,
  format text not null,
  freshness_label text not null check (freshness_label in ('Fresh', 'Peaking', 'Overused')),
  source text not null,
  first_seen_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.trend_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid not null references public.trends(id) on delete cascade,
  score int not null check (score between 0 and 100),
  reason text not null,
  created_at timestamptz default now()
);

create table if not exists public.generated_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid references public.trends(id) on delete set null,
  type text not null check (type in ('hook', 'caption', 'script')),
  output jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_used text not null,
  tokens_estimated int,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text default 'free',
  status text default 'active',
  razorpay_sub_id text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create index if not exists users_profile_user_id_idx on public.users_profile(user_id);
create index if not exists content_samples_user_id_idx on public.content_samples(user_id);
create index if not exists trend_scores_user_id_idx on public.trend_scores(user_id);
create index if not exists generated_assets_user_id_idx on public.generated_assets(user_id);
create index if not exists usage_logs_user_feature_created_idx on public.usage_logs(user_id, feature_used, created_at);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists trends_niche_idx on public.trends(niche);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_profile_updated_at on public.users_profile;
create trigger set_users_profile_updated_at
before update on public.users_profile
for each row execute function public.set_updated_at();

alter table public.users_profile enable row level security;
alter table public.content_samples enable row level security;
alter table public.trends enable row level security;
alter table public.trend_scores enable row level security;
alter table public.generated_assets enable row level security;
alter table public.usage_logs enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "Users can read own profiles" on public.users_profile;
create policy "Users can read own profiles"
on public.users_profile for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own profiles" on public.users_profile;
create policy "Users can insert own profiles"
on public.users_profile for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own profiles" on public.users_profile;
create policy "Users can update own profiles"
on public.users_profile for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own samples" on public.content_samples;
create policy "Users can read own samples"
on public.content_samples for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own samples" on public.content_samples;
create policy "Users can insert own samples"
on public.content_samples for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own samples" on public.content_samples;
create policy "Users can update own samples"
on public.content_samples for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Trends are public read" on public.trends;
create policy "Trends are public read"
on public.trends for select
using (true);

drop policy if exists "Users can read own trend scores" on public.trend_scores;
create policy "Users can read own trend scores"
on public.trend_scores for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own trend scores" on public.trend_scores;
create policy "Users can insert own trend scores"
on public.trend_scores for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own trend scores" on public.trend_scores;
create policy "Users can update own trend scores"
on public.trend_scores for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own generated assets" on public.generated_assets;
create policy "Users can read own generated assets"
on public.generated_assets for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own generated assets" on public.generated_assets;
create policy "Users can insert own generated assets"
on public.generated_assets for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own generated assets" on public.generated_assets;
create policy "Users can update own generated assets"
on public.generated_assets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own usage logs" on public.usage_logs;
create policy "Users can read own usage logs"
on public.usage_logs for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage logs" on public.usage_logs;
create policy "Users can insert own usage logs"
on public.usage_logs for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own usage logs" on public.usage_logs;
create policy "Users can update own usage logs"
on public.usage_logs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscriptions" on public.subscriptions;
create policy "Users can insert own subscriptions"
on public.subscriptions for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscriptions" on public.subscriptions;
create policy "Users can update own subscriptions"
on public.subscriptions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
