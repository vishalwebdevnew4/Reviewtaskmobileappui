import initSqlJs from 'sql.js';

// Database type - using any to avoid TypeScript import issues with sql.js
// The actual Database type is available at runtime from SQL.Database
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;

let db: Database | null = null;

// Initialize the database
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem('reviewtask_db');
  
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
    // Always run migrations to add any missing columns
    createTables(db);
    saveDatabase();
  } else {
    // Create new database
    db = new SQL.Database();
    createTables(db);
    seedInitialData(db);
    saveDatabase();
  }

  return db;
}

// Create all tables
function createTables(database: Database) {
  // Users table
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE,
      email TEXT UNIQUE,
      name TEXT,
      password TEXT,
      google_id TEXT,
      auth_provider TEXT DEFAULT 'email',
      avatar_url TEXT,
      notification_settings TEXT,
      password_reset_token TEXT,
      password_reset_expires INTEGER,
      password_reset_otp TEXT,
      password_reset_otp_expires INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add password reset columns if they don't exist (for existing databases)
  try {
    database.run(`ALTER TABLE users ADD COLUMN password_reset_token TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }
  try {
    database.run(`ALTER TABLE users ADD COLUMN password_reset_expires INTEGER`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Add OTP columns if they don't exist (for existing databases)
  try {
    database.run(`ALTER TABLE users ADD COLUMN password_reset_otp TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }
  try {
    database.run(`ALTER TABLE users ADD COLUMN password_reset_otp_expires INTEGER`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Add notification_settings column if it doesn't exist (for existing databases)
  try {
    database.run(`ALTER TABLE users ADD COLUMN notification_settings TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Clean up corrupted notification_settings data
  try {
    const users = database.exec(`SELECT id, notification_settings FROM users WHERE notification_settings IS NOT NULL`);
    if (users.length > 0 && users[0].values.length > 0) {
      users[0].values.forEach((row: any) => {
        const userId = row[0];
        const settings = row[1];
        
        // Check if settings is invalid JSON
        if (settings && typeof settings === 'string') {
          const trimmed = settings.trim();
          let shouldClean = false;
          
          // Check for invalid string values
          if (trimmed === '' || 
              trimmed === 'null' || 
              trimmed === 'undefined' || 
              trimmed === 'NULL' || 
              trimmed === 'Null') {
            shouldClean = true;
          } else if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
            // Doesn't look like JSON
            shouldClean = true;
          } else {
            // Try to parse to see if it's valid JSON
            try {
              const parsed = JSON.parse(trimmed);
              // If it's not an object (could be array or other type), clean it
              if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                shouldClean = true;
              }
            } catch (e) {
              // Invalid JSON, clean it up
              shouldClean = true;
            }
          }
          
          if (shouldClean) {
            database.run(`UPDATE users SET notification_settings = NULL WHERE id = ?`, [userId]);
          }
        }
      });
      saveDatabase();
    }
  } catch (e) {
    // Ignore cleanup errors - they're not critical
  }

  // Tasks table
  database.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add survey_fields column if it doesn't exist (for existing databases)
  try {
    database.run(`ALTER TABLE tasks ADD COLUMN survey_fields TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }

  // Surveys table (migrated from reviews)
  // First, try to migrate existing reviews table to surveys if it exists
  try {
    const reviewsCheck = database.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='reviews'`);
    if (reviewsCheck.length > 0 && reviewsCheck[0].values.length > 0) {
      // Migrate reviews to surveys
      database.run(`
        CREATE TABLE IF NOT EXISTS surveys (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          rating INTEGER,
          survey_text TEXT,
          images TEXT,
          status TEXT DEFAULT 'pending',
          company_feedback TEXT,
          company_rating INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (task_id) REFERENCES tasks(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      // Copy data from reviews to surveys
      database.run(`
        INSERT INTO surveys (id, task_id, user_id, rating, survey_text, images, status, company_feedback, company_rating, created_at)
        SELECT id, task_id, user_id, rating, review_text, images, status, company_feedback, company_rating, created_at
        FROM reviews
        WHERE NOT EXISTS (SELECT 1 FROM surveys WHERE surveys.id = reviews.id)
      `);
      // Drop old reviews table
      database.run(`DROP TABLE IF EXISTS reviews`);
    }
  } catch (e) {
    // Migration failed or not needed, continue
  }

  // Create surveys table if it doesn't exist
  database.run(`
    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER,
      survey_text TEXT,
      images TEXT,
      custom_responses TEXT,
      status TEXT DEFAULT 'pending',
      company_feedback TEXT,
      company_rating INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  
  // Add custom_responses column if it doesn't exist (for existing databases)
  try {
    database.run(`ALTER TABLE surveys ADD COLUMN custom_responses TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }

  // Wallet transactions table
  database.run(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'completed',
      withdrawal_method TEXT,
      account_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // KYC information table
  database.run(`
    CREATE TABLE IF NOT EXISTS kyc_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // User tasks (many-to-many relationship)
  database.run(`
    CREATE TABLE IF NOT EXISTS user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_id INTEGER NOT NULL,
      status TEXT DEFAULT 'assigned',
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      UNIQUE(user_id, task_id)
    )
  `);
}

// Seed initial data
function seedInitialData(database: Database) {
  // Insert sample tasks
  const tasks = [
    {
      title: 'Samsung Galaxy S24 Ultra Review',
      brand: 'Samsung Electronics',
      image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 250,
      deadline: 'Due in 3 days',
      category: 'tech',
      tag: 'Hot Task'
    },
    {
      title: 'Organic Restaurant Experience',
      brand: 'Green Bistro',
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 180,
      deadline: 'Due in 5 days',
      category: 'food',
      tag: 'Quick Task'
    },
    {
      title: 'Premium Skincare Product',
      brand: 'GlowUp Beauty',
      image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 200,
      deadline: 'Due in 2 days',
      category: 'health',
      tag: 'New'
    },
    {
      title: 'Wireless Noise Cancelling Headphones',
      brand: 'SoundMax Audio',
      image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 220,
      deadline: 'Due in 4 days',
      category: 'tech'
    },
    {
      title: 'Designer Fashion Collection Review',
      brand: 'Urban Style Co.',
      image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 190,
      deadline: 'Due in 6 days',
      category: 'fashion',
      tag: 'Popular'
    },
    {
      title: 'Fitness Tracker & Health App',
      brand: 'FitLife Tech',
      image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 170,
      deadline: 'Due in 7 days',
      category: 'health'
    }
  ];

  const insertTask = database.prepare(`
    INSERT INTO tasks (title, brand, image, reward, deadline, category, tag)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  tasks.forEach(task => {
    insertTask.run([
      task.title,
      task.brand,
      task.image,
      task.reward,
      task.deadline,
      task.category,
      task.tag || null
    ]);
  });

  insertTask.free();
}

// Save database to localStorage
export function saveDatabase() {
  if (!db) return;
  
  const data = db.export();
  const buffer = Array.from(data);
  localStorage.setItem('reviewtask_db', JSON.stringify(buffer));
}

// Get database instance
export function getDatabase(): Database {
  if (!db) {
    // Try to initialize synchronously if not already initialized
    // This is a fallback for cases where database wasn't initialized yet
    const savedDb = localStorage.getItem('reviewtask_db');
    if (savedDb) {
      // Database exists in localStorage, but wasn't loaded yet
      // This shouldn't happen in normal flow, but handle it gracefully
      console.warn('Database not initialized but exists in localStorage. Please ensure initDatabase() is called first.');
    }
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Reset database (for development/testing)
export function resetDatabase() {
  if (db) {
    db.close();
    db = null;
  }
  localStorage.removeItem('reviewtask_db');
}

