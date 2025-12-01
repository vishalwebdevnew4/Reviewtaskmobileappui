# PostgreSQL Setup Instructions

## ✅ What's Been Configured

1. ✅ Backend `.env` file created with your connection string
2. ✅ `dotenv` package installed
3. ✅ PostgreSQL driver (`pg`) installed
4. ✅ Database service configured
5. ✅ API endpoints ready

## 🔍 Current Connection String

```
postgresql://postgres:jbyD$@es289@Ex2o@localhost:5432/salesreviewer
```

**Note:** The password contains special characters (`$@`) which have been URL-encoded in the `.env` file as:
- `$` → `%24`
- `@` → `%40`

## 🧪 Test Your Connection

### Option 1: Use the test script
```bash
cd backend
node test-connection.js
```

### Option 2: Test manually with psql
```bash
psql -U postgres -d salesreviewer
```

### Option 3: Test with pgAdmin or another PostgreSQL client

## ❌ If Connection Fails

Check these common issues:

1. **PostgreSQL is not running**
   ```bash
   # Windows: Check services
   services.msc
   # Look for "postgresql" service
   ```

2. **Password is incorrect**
   - Verify the password: `jbyD$@es289@Ex2o`
   - Try connecting manually with psql to confirm

3. **Database doesn't exist**
   ```sql
   -- Connect as postgres user
   psql -U postgres
   
   -- Create database if needed
   CREATE DATABASE salesreviewer;
   ```

4. **User permissions**
   - Ensure `postgres` user has access to the database
   - Check `pg_hba.conf` for authentication settings

5. **Port 5432 is blocked**
   - Check if PostgreSQL is listening on port 5432
   - Verify firewall settings

## 🔧 Fix Connection String

If you need to update the password in `.env`:

1. **For passwords with special characters**, URL-encode them:
   - `$` → `%24`
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`

2. **Example:**
   ```
   Original password: jbyD$@es289@Ex2o
   Encoded: jbyD%24%40es289%40Ex2o
   ```

3. **Full connection string:**
   ```
   DATABASE_URL=postgresql://postgres:jbyD%24%40es289%40Ex2o@localhost:5432/salesreviewer
   ```

## 🚀 Once Connected

After the connection works:

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **The server will:**
   - ✅ Connect to PostgreSQL
   - ✅ Create all tables automatically
   - ✅ Start API on port 3001

3. **Configure frontend:**
   Create `.env` in root directory:
   ```env
   VITE_USE_POSTGRES=true
   VITE_API_URL=http://localhost:3001/api/db
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

## 📝 Current .env File

Your current `backend/.env` file contains:
```
DATABASE_URL=postgresql://postgres:jbyD%24%40es289%40Ex2o@localhost:5432/salesreviewer
PORT=3001
```

If the connection still fails, please:
1. Verify PostgreSQL is running
2. Test the connection manually with psql
3. Confirm the password is correct
4. Check if the database exists

