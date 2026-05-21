const { Pool } = require('pg');
require('dotenv').config();

// Pool reuses connections across requests rather than opening a new one each time
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Supabase
});

// Without this handler, a dropped idle connection would emit an unhandled 'error'
// event and crash the entire Node process.
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

module.exports = pool;
