-- LEOOSTORE.id article CMS
-- Run in Supabase SQL Editor for project tvdbrqskvuukxvqaqjom.
create table if not exists public.store_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  category text not null default 'Panduan',
  thumbnail_url text,
  source_url text,
  content text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists store_articles_publication_idx
  on public.store_articles(status, published_at desc);
alter table public.store_articles enable row level security;
grant select on public.store_articles to anon, authenticated;
grant insert, update, delete on public.store_articles to authenticated;
drop policy if exists "Published articles are public" on public.store_articles;
create policy "Published articles are public"
  on public.store_articles for select to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());
drop policy if exists "Authors can view their own articles" on public.store_articles;
create policy "Authors can view their own articles"
  on public.store_articles for select to authenticated
  using (auth.uid() = author_id);
-- NOTE: The management policies below permit authenticated Supabase users to manage
-- articles. If the project has multiple user accounts, restrict these policies to
-- the owner's verified auth.uid() or an admin allowlist before enabling public signup.
drop policy if exists "Authenticated users can create articles" on public.store_articles;
create policy "Authenticated users can create articles"
  on public.store_articles for insert to authenticated
  with check (auth.uid() = author_id);
drop policy if exists "Authenticated users can update articles" on public.store_articles;
create policy "Authenticated users can update articles"
  on public.store_articles for update to authenticated
  using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists "Authenticated users can delete articles" on public.store_articles;
create policy "Authenticated users can delete articles"
  on public.store_articles for delete to authenticated
  using (auth.uid() = author_id);

-- Safe upgrade for an existing article table.
alter table public.store_articles add column if not exists source_url text;
