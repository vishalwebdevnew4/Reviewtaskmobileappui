// Database module - Now using Firebase only
// This file is kept for backward compatibility but all operations should use Firebase services

// Database type - kept for compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;

let db: Database | null = null;

// Initialize the database - No-op for Firebase
export async function initDatabase(): Promise<Database> {
  // Return a mock database object for compatibility
  // All actual operations should use Firebase services
  if (!db) {
    db = {
      exec: () => [],
      run: () => {},
      close: () => {},
    };
  }
  return db;
}

// Save database - No-op for Firebase
export function saveDatabase() {
  // No-op: Firebase handles persistence automatically
  console.warn('saveDatabase() called but using Firebase. Data is automatically persisted.');
}

// Get database instance - Returns mock for compatibility
export function getDatabase(): Database {
  if (!db) {
    db = {
      exec: () => [],
      run: () => {},
      close: () => {},
    };
  }
  return db;
}

// Reset database - No-op for Firebase
export function resetDatabase() {
  db = null;
  localStorage.removeItem('reviewtask_db');
  console.warn('resetDatabase() called but using Firebase. Use Firebase Console to manage data.');
}
