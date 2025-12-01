// Test PostgreSQL connection
require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testing PostgreSQL connection...');
console.log('Connection string (masked):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@') || 'Not set');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW() as current_time, current_database() as database_name, current_user as user_name')
  .then(result => {
    console.log('\n✅ Connection successful!');
    console.log('   Database:', result.rows[0].database_name);
    console.log('   User:', result.rows[0].user_name);
    console.log('   Server time:', result.rows[0].current_time);
    pool.end();
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check if PostgreSQL is running');
    console.log('   2. Verify the password is correct');
    console.log('   3. Check if the database "salesreviewer" exists');
    console.log('   4. Verify user "postgres" has access');
    console.log('\n   Try connecting manually with:');
    console.log('   psql -U postgres -d salesreviewer');
    pool.end();
    process.exit(1);
  });

