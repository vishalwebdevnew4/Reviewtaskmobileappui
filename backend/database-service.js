// PostgreSQL Database Service
require('dotenv').config();
const { Pool } = require('pg');

let pool = null;

// Initialize PostgreSQL connection
async function initDatabase() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionString) {
    console.warn('⚠️ No PostgreSQL connection string found.');
    console.warn('   Set DATABASE_URL or POSTGRES_URL in your .env file');
    console.warn('   Example: DATABASE_URL=postgresql://user:pass@host:port/db');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: connectionString,
      ssl: connectionString.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    });

    // Test connection
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected successfully');
      console.log('   Database time:', result.rows[0].now);
    } catch (err) {
      console.error('❌ PostgreSQL connection error:', err.message);
      pool = null;
      throw err;
    }

    return pool;
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL:', error);
    return null;
  }
}

// Create tables if they don't exist
async function createTables() {
  if (!pool) return;

  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone TEXT UNIQUE,
        email TEXT UNIQUE,
        name TEXT,
        password TEXT,
        google_id TEXT,
        auth_provider TEXT DEFAULT 'email',
        avatar_url TEXT,
        notification_settings TEXT,
        password_reset_token TEXT,
        password_reset_expires BIGINT,
        password_reset_otp TEXT,
        password_reset_otp_expires BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        brand TEXT NOT NULL,
        image TEXT,
        reward INTEGER NOT NULL,
        deadline TEXT,
        category TEXT,
        tag TEXT,
        description TEXT,
        survey_fields TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Surveys table
    await client.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER,
        survey_text TEXT,
        images TEXT,
        custom_responses TEXT,
        status TEXT DEFAULT 'pending',
        company_feedback TEXT,
        company_rating INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Wallet transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'completed',
        withdrawal_method TEXT,
        account_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // KYC info table
    await client.query(`
      CREATE TABLE IF NOT EXISTS kyc_info (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        full_name TEXT,
        date_of_birth TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        pincode TEXT,
        document_type TEXT,
        document_number TEXT,
        document_image TEXT,
        verification_method TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // User tasks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        task_id INTEGER NOT NULL,
        status TEXT DEFAULT 'assigned',
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        UNIQUE(user_id, task_id)
      )
    `);

    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  } finally {
    client.release();
  }
}

// Execute query
async function query(text, params) {
  if (!pool) {
    throw new Error('Database not initialized. Please provide DATABASE_URL or POSTGRES_URL environment variable.');
  }
  return await pool.query(text, params);
}

module.exports = {
  initDatabase,
  createTables,
  query,
  getPool: () => pool
};

