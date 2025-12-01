# Debugging Blank White Screen

## Common Causes & Solutions

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors:
- Red errors in Console tab
- Network tab for failed requests
- Check if `sql.js` is loading from CDN

### 2. Database Initialization
The app shows a loading spinner while initializing. If it stays blank:
- Check browser console for database errors
- Check if `localStorage` is enabled
- Try clearing browser cache/localStorage

### 3. Network Issues
If `sql.js` fails to load:
- Check internet connection
- The CDN might be blocked
- Check browser console for CORS errors

### 4. React Errors
- Check for component errors in console
- Error boundary should catch and display errors
- Check if all imports are correct

## Quick Fixes

### Clear Browser Data
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Check if Root Element Exists
The app needs `<div id="root"></div>` in `index.html`

### Verify Environment Variables
Make sure `.env` file exists with:
```
VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Debug Steps

1. **Open Browser Console** (F12)
2. **Check for errors** - Look for red error messages
3. **Check Network tab** - See if files are loading
4. **Check Application tab** - Verify localStorage
5. **Try incognito mode** - Rule out cache issues

## What I Added

1. ✅ **Error Boundary** - Catches React errors and shows message
2. ✅ **Loading State** - Shows spinner while initializing
3. ✅ **Better Error Logging** - Console logs for debugging
4. ✅ **React Import** - Fixed missing React import in HomeScreen

## If Still Blank

1. Check browser console for specific errors
2. Try hard refresh (Ctrl+Shift+R)
3. Clear browser cache
4. Check if port 3000 is available
5. Verify all dependencies are installed: `npm install`

