CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL        PRIMARY KEY,
  name                VARCHAR(100)  NOT NULL,
  email               VARCHAR(255)  UNIQUE NOT NULL,
  password_hash       VARCHAR(255)  NOT NULL,
  address             TEXT,
  profile_picture_url TEXT,
  is_admin            BOOLEAN       DEFAULT FALSE,
  created_at          TIMESTAMP     DEFAULT NOW(),
  updated_at          TIMESTAMP     DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         SERIAL      PRIMARY KEY,
  user_id    INTEGER     REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
