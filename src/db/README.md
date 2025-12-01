# Database Setup

This project uses SQLite via `sql.js` for browser-based database storage.

## Database File

The database is stored in the browser's `localStorage` as a JSON array. The database file is automatically saved after each write operation.

## Schema

### Tables

1. **users** - User accounts
   - id, phone, email, name, created_at

2. **tasks** - Review tasks
   - id, title, brand, image, reward, deadline, category, tag, description, status, created_at

3. **reviews** - User reviews for tasks
   - id, task_id, user_id, rating, review_text, images, status, created_at

4. **wallet_transactions** - Wallet transaction history
   - id, user_id, amount, type, description, created_at

5. **kyc_info** - KYC verification information
   - id, user_id, full_name, date_of_birth, address, city, state, pincode, document_type, document_number, document_image, verification_method, status, created_at

6. **user_tasks** - Many-to-many relationship between users and tasks
   - id, user_id, task_id, status, assigned_at, completed_at

## Usage

### Initialize Database

The database is automatically initialized when the app starts (see `src/main.tsx`).

### Using Queries

```typescript
import { taskQueries, userQueries, walletQueries } from './db/queries';

// Get all tasks
const tasks = taskQueries.getAllTasks('tech');

// Create user
const user = userQueries.createOrGetUser('+911234567890', 'user@example.com', 'John Doe');

// Get wallet balance
const balance = walletQueries.getBalance(userId);
```

### Using the Hook

```typescript
import { useDatabase } from './db/useDatabase';

function MyComponent() {
  const { db, loading, error, isReady } = useDatabase();
  
  if (loading) return <div>Loading database...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  // Use database queries here
}
```

## Database Location

The database is stored in `localStorage` with the key `reviewtask_db`. To reset the database:

```typescript
import { resetDatabase } from './db/database';
resetDatabase();
```

## Notes

- The database persists across browser sessions via localStorage
- Maximum localStorage size is typically 5-10MB
- For production, consider using IndexedDB for larger storage capacity
- All write operations automatically save the database

