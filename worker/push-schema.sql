-- Web Push subscriptions. VAPID private keys belong in Worker secrets, never D1.
-- subscriber_id and subscriber_role are populated only after Worker verifies the Supabase access token.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  subscription_json TEXT NOT NULL,
  customer_key TEXT,
  subscriber_id TEXT,
  subscriber_role TEXT NOT NULL DEFAULT 'customer',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_customer ON push_subscriptions(customer_key);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions(subscriber_id, subscriber_role);
