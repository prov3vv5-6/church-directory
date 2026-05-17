const { Pool } = require('pg');
require('dotenv').config();

// Pool reuses connections across requests rather than opening a new one each time
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

module.exports = pool;
