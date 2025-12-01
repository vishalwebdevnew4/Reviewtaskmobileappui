// Detailed PostgreSQL connection test
require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Detailed PostgreSQL Connection Test\n');
console.log('='.repeat(50));

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  console.log('\n💡 Create backend/.env with:');
  console.log('   DATABASE_URL=postgresql://postgres:password@localhost:5432/salesreviewer');
  process.exit(1);
}

// Parse connection string (masked for security)
const url = process.env.DATABASE_URL;
const masked = url.replace(/:[^:@]+@/, ':****@');
console.log('Connection string (masked):', masked);
console.log('Connection string length:', url.length);

// Extract components for debugging
try {
  const urlObj = new URL(url);
  console.log('\n📋 Connection Details:');
  console.log('   Protocol:', urlObj.protocol);
  console.log('   Host:', urlObj.hostname);
  console.log('   Port:', urlObj.port || '5432 (default)');
  console.log('   Database:', urlObj.pathname.substring(1));
  console.log('   Username:', urlObj.username);
  console.log('   Password:', urlObj.password ? '***' + urlObj.password.substring(urlObj.password.length - 2) : 'Not set');
} catch (e) {
  console.log('⚠️  Could not parse URL:', e.message);
}

console.log('\n' + '='.repeat(50));
console.log('🔌 Attempting connection...\n');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.query('SELECT NOW() as current_time, current_database() as database_name, current_user as user_name, version() as pg_version')
  .then(result => {
    console.log('✅ Connection successful!\n');
    console.log('📊 Database Information:');
    console.log('   Database:', result.rows[0].database_name);
    console.log('   User:', result.rows[0].user_name);
    console.log('   Server time:', result.rows[0].current_time);
    console.log('   PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    
    // Test table creation
    console.log('\n' + '='.repeat(50));
    console.log('🧪 Testing table creation...\n');
    
    return pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
  })
  .then(result => {
    if (result.rows.length > 0) {
      console.log('📋 Existing tables:', result.rows.map(r => r.table_name).join(', '));
    } else {
      console.log('📋 No tables found (database is empty)');
    }
    
    console.log('\n✅ All tests passed!');
    console.log('🚀 You can now start the backend server with: npm start');
    pool.end();
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    console.log('\n' + '='.repeat(50));
    console.log('💡 Troubleshooting Steps:\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('1. ❌ PostgreSQL is not running');
      console.log('   → Start PostgreSQL service');
      console.log('   → Windows: Check Services (services.msc)');
      console.log('   → Look for "postgresql" service and start it\n');
    } else if (error.code === '28P01' || error.message.includes('password authentication')) {
      console.log('1. ❌ Password authentication failed');
      console.log('   → Verify the password is correct');
      console.log('   → Test manually: psql -U postgres -d salesreviewer');
      console.log('   → If password has special characters, ensure they are URL-encoded\n');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('1. ❌ Database does not exist');
      console.log('   → Create database: CREATE DATABASE salesreviewer;');
      console.log('   → Or update DATABASE_URL to use an existing database\n');
    } else if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
      console.log('1. ❌ Host not found');
      console.log('   → Check if hostname in DATABASE_URL is correct');
      console.log('   → For localhost, ensure PostgreSQL is running\n');
    } else {
      console.log('1. Check PostgreSQL is installed and running');
      console.log('2. Verify DATABASE_URL in backend/.env is correct');
      console.log('3. Test connection manually: psql -U postgres -d salesreviewer');
      console.log('4. Check PostgreSQL logs for more details\n');
    }
    
    console.log('📖 For more help, see: backend/SETUP_INSTRUCTIONS.md\n');
    
    pool.end();
    process.exit(1);
  });

