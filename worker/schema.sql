-- LEOOSTORE D1 schema
-- Keep this schema aligned with the runtime schema in worker/src/index.js.
-- CREATE TABLE IF NOT EXISTS does not alter an existing production table.

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT,
  customer_whatsapp TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  denomination_id TEXT NOT NULL,
  denomination_name TEXT NOT NULL,
  player_id TEXT,
  server_id TEXT,
  payment_method TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  fee INTEGER NOT NULL,
  discount INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  midtrans_transaction_id TEXT,
  midtrans_status TEXT,
  snap_token TEXT,
  snap_redirect_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(midtrans_transaction_id);

 
-- Server-side promo reservations prevent concurrent checkouts from exceeding quotas.
CREATE TABLE IF NOT EXISTS promo_redemptions (
  promo_code TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  customer_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('reserved', 'paid', 'released')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (promo_code, order_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_redemptions_code_status
  ON promo_redemptions(promo_code, status);
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_customer
  ON promo_redemptions(promo_code, customer_key, status);


-- Idempotency/audit log for Resend order notifications.
CREATE TABLE IF NOT EXISTS email_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(order_id, event_type, recipient)
);


-- Web Push subscriptions. VAPID private keys belong in Worker secrets, never D1.
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  subscription_json TEXT NOT NULL,
  customer_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_customer ON push_subscriptions(customer_key);
