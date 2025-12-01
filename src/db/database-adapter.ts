// Database adapter that works for both web and native
import { Capacitor } from '@capacitor/core';

// This adapter will automatically use the right database implementation
// For web: uses sql.js with localStorage
// For native: uses @capacitor-community/sqlite (to be implemented)

export async function initDatabaseAdapter() {
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    // Use native SQLite plugin
    return await initNativeDatabase();
  } else {
    // Use web SQLite (sql.js)
    const { initDatabase } = await import('./database');
    return await initDatabase();
  }
}

async function initNativeDatabase() {
  // TODO: Implement native SQLite using @capacitor-community/sqlite
  // For now, fallback to web version
  const { initDatabase } = await import('./database');
  return await initDatabase();
}

