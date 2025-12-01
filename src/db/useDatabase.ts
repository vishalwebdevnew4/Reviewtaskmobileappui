import { useEffect, useState } from 'react';
import { initDatabase, getDatabase, Database } from './database';

export function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then((database) => {
        setDb(database);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error('Database initialization error:', err);
      });
  }, []);

  return { db, loading, error, isReady: db !== null };
}

