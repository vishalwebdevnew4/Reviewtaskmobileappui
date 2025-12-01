# PostgreSQL Database Setup

This app now supports PostgreSQL database for production use. You can use a live PostgreSQL database (like from Supabase, Railway, Render, or any PostgreSQL provider) instead of localStorage.

## Setup Instructions

### 1. Get a PostgreSQL Database

You can use any PostgreSQL provider:
- **Supabase** (Free tier available): https://supabase.com
- **Railway** (Free tier available): https://railway.app
- **Render** (Free tier available): https://render.com
- **Neon** (Free tier available): https://neon.tech
- **Your own PostgreSQL server**

### 2. Get Your Connection String

Your PostgreSQL connection string will look like:
```
postgresql://username:password@host:port/database
```

Or:
```
postgres://username:password@host:port/database?sslmode=require
```

### 3. Configure Backend

1. Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
```

Or use `POSTGRES_URL` instead:
```env
POSTGRES_URL=postgresql://username:password@host:port/database
PORT=3001
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install the `pg` (PostgreSQL) package.

### 5. Start Backend Server

```bash
npm start
```

The server will:
- Connect to PostgreSQL
- Create all necessary tables automatically
- Start the API server on port 3001

### 6. Configure Frontend

Create a `.env` file in the root directory:
```env
VITE_USE_POSTGRES=true
VITE_API_URL=http://localhost:3001/api/db
```

For production, update `VITE_API_URL` to your backend server URL:
```env
VITE_USE_POSTGRES=true
VITE_API_URL=https://your-backend-server.com/api/db
```

### 7. Build and Run

The app will automatically use PostgreSQL when `VITE_USE_POSTGRES=true` is set.

**For Web:**
```bash
npm run dev
```

**For APK:**
```bash
npm run build
npm run cap:sync
npm run apk:build
```

## How It Works

- **When `VITE_USE_POSTGRES=false` or not set**: Uses localStorage (sql.js) - data stored in browser
- **When `VITE_USE_POSTGRES=true`**: Uses PostgreSQL API - data stored in cloud database

The app automatically switches between the two based on your configuration.

## Database Schema

The backend automatically creates these tables:
- `users` - User accounts
- `tasks` - Survey tasks
- `surveys` - User survey submissions
- `wallet_transactions` - Wallet history
- `kyc_info` - KYC verification data
- `user_tasks` - Task assignments

## API Endpoints

All database operations are available via REST API:
- `GET /api/db/users/:id` - Get user
- `POST /api/db/users` - Create/update user
- `GET /api/db/tasks` - Get all tasks
- `POST /api/db/tasks` - Create task
- `PUT /api/db/tasks/:id` - Update task
- `DELETE /api/db/tasks/:id` - Delete task
- And more...

## Migration from localStorage

If you have existing data in localStorage and want to migrate to PostgreSQL:

1. Export your data from localStorage (you may need to write a script)
2. Import it into PostgreSQL using the API endpoints
3. Switch to PostgreSQL mode

## Troubleshooting

**Connection Error:**
- Check your `DATABASE_URL` is correct
- Ensure your database allows connections from your server IP
- Check SSL settings if required

**Tables Not Created:**
- Check backend logs for errors
- Manually run the table creation SQL if needed

**API Not Working:**
- Ensure backend server is running
- Check `VITE_API_URL` matches your backend URL
- Check CORS settings if accessing from different domain

