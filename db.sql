-- Postgres schema for offers
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  external_id VARCHAR(255),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  price NUMERIC,
  discount_pct INT,
  city VARCHAR(100),
  tags TEXT[],
  raw_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_offers_provider ON offers(provider);
CREATE INDEX IF NOT EXISTS idx_offers_city ON offers(city);
