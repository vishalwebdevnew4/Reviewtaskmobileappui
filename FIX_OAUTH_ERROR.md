# Fix OAuth Error 401: invalid_client

## Error: "The OAuth client was not found"

This error means Google can't find your OAuth client. Here's how to fix it:

## ✅ Solution Steps

### 1. Restart Dev Server (IMPORTANT!)

Vite only reads `.env` files when the server starts. You **must restart** after creating/updating `.env`:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Verify .env File

Make sure `.env` file exists in the **root directory** (same level as `package.json`):

```env
VITE_GOOGLE_CLIENT_ID=401788002919-h667labjnm38m9jff9rja95rkm4d0kdq.apps.googleusercontent.com
```

**Important:**
- No spaces around `=`
- No quotes needed
- Must start with `VITE_`

### 3. Check Browser Console

After restarting, open browser console (F12) and look for:
```
🔑 Google Client ID loaded: ✅ Yes
```

If you see `❌ No` or the default ID, the `.env` file isn't being read.

### 4. Verify Client ID in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `tournament-app-42bf9`
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Verify it matches: `401788002919-h667labjnm38m9jff9rja95rkm4d0kdq.apps.googleusercontent.com`

### 5. Check Authorized JavaScript Origins

In Google Cloud Console, make sure these are added:
- `http://localhost:3000`
- `http://localhost`
- `http://localhost:5000`

### 6. Check Authorized Redirect URIs

Make sure these are added:
- `http://localhost:3000`
- `https://tournament-app-42bf9.firebaseapp.com/__/auth/handler`

## 🔍 Debugging

### Check if .env is being read:

1. **Add this to `src/main.tsx` temporarily:**
```typescript
console.log('Environment:', import.meta.env);
console.log('Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

2. **Check browser console** - you should see the Client ID

### Common Issues:

1. **.env file in wrong location**
   - Must be in root: `E:\Reviewtaskmobileappui\.env`
   - Not in `src/` folder

2. **Server not restarted**
   - Vite caches .env on startup
   - Always restart after .env changes

3. **Typo in variable name**
   - Must be exactly: `VITE_GOOGLE_CLIENT_ID`
   - Case-sensitive

4. **Client ID mismatch**
   - Verify in Google Cloud Console
   - Make sure it's the Web Client ID (not Android/iOS)

## ✅ Quick Fix Checklist

- [ ] `.env` file exists in root directory
- [ ] `.env` has correct Client ID (no spaces, no quotes)
- [ ] Dev server restarted after creating `.env`
- [ ] Browser console shows "✅ Yes" for Client ID
- [ ] Google Cloud Console has correct origins
- [ ] Using correct Client ID (Web application type)

## 🚀 After Fixing

1. Restart dev server: `npm run dev`
2. Hard refresh browser: `Ctrl+Shift+R`
3. Try Google login again
4. Check console for any errors

The error should be resolved! 🎉

