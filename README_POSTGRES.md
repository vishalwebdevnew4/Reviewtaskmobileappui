# PostgreSQL Database Setup Guide

## Quick Start

### 1. Get PostgreSQL Connection String

Get your PostgreSQL connection string from your provider. It looks like:
```
postgresql://username:password@host:port/database
```

**Free PostgreSQL Providers:**
- **Supabase**: https://supabase.com (Free tier: 500MB)
- **Railway**: https://railway.app (Free tier: $5 credit/month)
- **Render**: https://render.com (Free tier available)
- **Neon**: https://neon.tech (Free tier: 3GB)

### 2. Configure Backend

Create `backend/.env` file:
```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3001
```

### 3. Install & Start Backend

```bash
cd backend
npm install
npm start
```

The backend will:
- ✅ Connect to PostgreSQL
- ✅ Create all tables automatically
- ✅ Start API server on port 3001

### 4. Configure Frontend

Create `.env` file in root directory:
```env
VITE_USE_POSTGRES=true
VITE_API_URL=http://localhost:3001/api/db
```

### 5. Run App

```bash
npm run dev
```

## For Production/APK

1. Deploy backend to a server (Railway, Render, Heroku, etc.)
2. Update `VITE_API_URL` in `.env` to your deployed backend URL
3. Build the app:
   ```bash
   npm run build
   npm run cap:sync
   npm run apk:build
   ```

## How It Works

- **localStorage mode** (default): Data stored in browser, lost on clear cache
- **PostgreSQL mode**: Data stored in cloud database, persists across devices

The app automatically switches based on `VITE_USE_POSTGRES` setting.

## Database Schema

Tables are created automatically:
- `users` - User accounts
- `tasks` - Survey tasks  
- `surveys` - Survey submissions
- `wallet_transactions` - Wallet history
- `kyc_info` - KYC data
- `user_tasks` - Task assignments

## Troubleshooting

**"No PostgreSQL connection string found"**
- Check `backend/.env` file exists
- Verify `DATABASE_URL` is set correctly

**"Connection refused"**
- Check your database allows external connections
- Verify connection string is correct
- Check firewall/security settings

**"Tables not created"**
- Check backend logs for errors
- Verify database user has CREATE TABLE permissions

**"API not working"**
- Ensure backend server is running (`npm start` in backend folder)
- Check `VITE_API_URL` matches backend URL
- Check CORS settings if accessing from different domain

## Migration from localStorage

Currently, there's no automatic migration. To migrate:
1. Export data from localStorage (write a script)
2. Import via API endpoints
3. Switch to PostgreSQL mode

## Support

If you need help:
1. Check backend logs: `cd backend && npm start`
2. Check browser console for API errors
3. Verify environment variables are set correctly

