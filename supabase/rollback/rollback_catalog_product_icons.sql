-- Rollback for the catalog icon feature.
-- Run only if reverting the feature and after deploying the previous frontend code.
-- Existing product/game data is preserved; these columns only store optional image URLs.

ALTER TABLE public.store_products DROP COLUMN IF EXISTS icon_url;
ALTER TABLE public.store_games DROP COLUMN IF EXISTS currency_icon_url;
