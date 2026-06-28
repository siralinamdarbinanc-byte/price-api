CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT,
  name TEXT NOT NULL,
  brand TEXT,
  car TEXT,
  category TEXT,
  price INTEGER,
  stock INTEGER DEFAULT 0,
  keywords TEXT,
  normalized_name TEXT,
  search_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_car ON products(car);

CREATE TABLE IF NOT EXISTS search_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT,
  result_count INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS typo_dictionary (
  wrong TEXT PRIMARY KEY,
  correct TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS aliases (
  alias TEXT PRIMARY KEY,
  original TEXT NOT NULL
);
