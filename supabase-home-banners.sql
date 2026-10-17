-- Jalankan sekali di Supabase SQL Editor sebelum mengelola banner dinamis.
create table if not exists public.store_home_banners (
 slot integer primary key check (slot between 1 and 3),
 title text not null default '',
 subtitle text not null default 'TOP UP SEKARANG',
 image_url text not null default '',
 target_url text not null default '',
 is_active boolean not null default true,
 updated_at timestamptz not null default now()
);
alter table public.store_home_banners enable row level security;
grant select on public.store_home_banners to anon, authenticated;
grant insert, update, delete on public.store_home_banners to authenticated;
drop policy if exists "Public can read active homepage banners" on public.store_home_banners;
create policy "Public can read active homepage banners" on public.store_home_banners for select to anon, authenticated using (is_active = true);
drop policy if exists "Authenticated admins can manage homepage banners" on public.store_home_banners;
create policy "Authenticated admins can manage homepage banners" on public.store_home_banners for all to authenticated using (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid) with check (auth.uid() = '3939553f-ef8d-4295-8f2f-39c86ce9ed20'::uuid);
