CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL
);

CREATE TABLE carts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  items TEXT
);