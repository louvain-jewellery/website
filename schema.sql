CREATE TABLE products (
  id TEXT PRIMARY KEY,
  collection TEXT NOT NULL,
  name TEXT,
  price TEXT,
  ring_width_wanita DECIMAL(4,2),
  ring_width_pria DECIMAL(4,2),
  gem_wanita TEXT,
  gem_pria  TEXT
)

CREATE TABLE product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
)