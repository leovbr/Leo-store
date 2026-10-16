-- LEOOSTORE: allow the public storefront and Cloudflare Worker to read the live catalog.
-- Publishable-key requests without a user session run as the anon Postgres role.
-- RLS policies still apply; this grants read access only, not writes.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON TABLE public.store_games, public.store_products TO anon, authenticated;

-- Refresh PostgREST's schema/permission cache after applying the grants.
NOTIFY pgrst, 'reload schema';
