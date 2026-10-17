-- LEOOSTORE homepage controls. Run once in Supabase SQL Editor.
create table if not exists public.store_homepage_settings (
  id smallint primary key check (id = 1),
  trending_slugs text[] not null default array['mobile-legends','free-fire']::text[],
  trending_title text not null default 'Trending',
  trending_limit integer not null default 6 check (trending_limit between 1 and 24),
  trending_enabled boolean not null default true,
  all_games_title text not null default 'All Games',
  all_games_initial_limit integer not null default 12 check (all_games_initial_limit between 1 and 200),
  all_games_enabled boolean not null default true,
  show_all_games_button boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.store_homepage_settings (id) values (1) on conflict (id) do nothing;
alter table public.store_homepage_settings enable row level security;
drop policy if exists "Homepage settings are readable by everyone" on public.store_homepage_settings;
create policy "Homepage settings are readable by everyone" on public.store_homepage_settings for select to anon, authenticated using (true);
drop policy if exists "Only LEOOSTORE admin can insert homepage settings" on public.store_homepage_settings;
create policy "Only LEOOSTORE admin can insert homepage settings" on public.store_homepage_settings for insert to authenticated with check (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid);
drop policy if exists "Only LEOOSTORE admin can update homepage settings" on public.store_homepage_settings;
create policy "Only LEOOSTORE admin can update homepage settings" on public.store_homepage_settings for update to authenticated using (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid) with check (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid);
