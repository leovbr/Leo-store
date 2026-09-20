-- LEOOSTORE D1 schema
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  denomination_id TEXT NOT NULL,
  denomination_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  payment_id TEXT NOT NULL,
  payment_name TEXT NOT NULL,
  total INTEGER NOT NULL,
  customer_email TEXT,
  customer_whatsapp TEXT,
  player_id TEXT,
  server TEXT,
  promo TEXT,
  status TEXT NOT NULL,
  midtrans_token TEXT,
  transaction_id TEXT,
  payment_type TEXT,
  raw_status TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  paid_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);
