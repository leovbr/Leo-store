-- LEOOSTORE promo-code fields. Run once in Supabase SQL Editor.
ALTER TABLE public.store_promos
  ADD COLUMN IF NOT EXISTS code text,
  ADD COLUMN IF NOT EXISTS usage_limit integer,
  ADD COLUMN IF NOT EXISTS usage_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS per_user_limit integer,
  ADD COLUMN IF NOT EXISTS min_purchase bigint NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS store_promos_code_unique
  ON public.store_promos (upper(code)) WHERE code IS NOT NULL;

GRANT SELECT ON TABLE public.store_promos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.store_promos TO authenticated;

-- Usage limits in this UI are not secure until the payment Worker atomically validates
-- and increments usage_count and checks per-customer redemption history server-side.
