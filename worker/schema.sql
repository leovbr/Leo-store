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
