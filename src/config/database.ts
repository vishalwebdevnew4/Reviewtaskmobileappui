// Database configuration - determines if using PostgreSQL API or localStorage
export const DB_CONFIG = {
  // Set to true to use PostgreSQL API, false to use localStorage
  usePostgreSQL: import.meta.env.VITE_USE_POSTGRES === 'true' || import.meta.env.VITE_USE_POSTGRES === '1',
  // API URL for PostgreSQL backend
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/db',
};

