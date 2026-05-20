CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL        PRIMARY KEY,
  name                VARCHAR(100)  NOT NULL,
  email               VARCHAR(255)  UNIQUE NOT NULL,
  password_hash       VARCHAR(255)  NOT NULL,
  address             TEXT,
  profile_picture_url TEXT,
  created_at          TIMESTAMP     DEFAULT NOW(),
  updated_at          TIMESTAMP     DEFAULT NOW()
);
