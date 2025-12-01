# Google Sign-In Troubleshooting Guide

## Error: `auth/operation-not-allowed`

This error means Google Sign-In is not properly enabled or configured. Follow these steps:

## ✅ Step-by-Step Fix

### Step 1: Enable Google Provider in Firebase Console

1. **Go to Firebase Console:**
   - Open: https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers
   - Or navigate: Project → Authentication → Sign-in method

2. **Enable Google Provider:**
   - Find **"Google"** in the providers list
   - Click on **"Google"**
   - Toggle **"Enable"** to **ON** (green)
   - **Project support email:** Enter `vdvishalwebdev@gmail.com` (or your email)
   - Click **"Save"**

3. **Verify it's enabled:**
   - You should see "Enabled" status next to Google provider
   - Status should be green/active

### Step 2: Configure OAuth Consent Screen in Google Cloud Console

This is **CRITICAL** and often missed!

1. **Go to Google Cloud Console:**
   - Open: https://console.cloud.google.com/apis/credentials/consent?project=tournament-app-42bf9
   - Or: https://console.cloud.google.com → Select project `tournament-app-42bf9` → APIs & Services → OAuth consent screen

2. **Configure OAuth Consent Screen:**
   - **User Type:** Select "External" (unless you have Google Workspace)
   - Click **"Create"**

3. **Fill in App Information:**
   - **App name:** `Tournament App` (or your app name)
   - **User support email:** `vdvishalwebdev@gmail.com`
   - **Developer contact information:** `vdvishalwebdev@gmail.com`
   - Click **"Save and Continue"**

4. **Scopes (Optional):**
   - Click **"Save and Continue"** (default scopes are fine)

5. **Test Users (if External):**
   - Add your email: `vdvishalwebdev@gmail.com`
   - Click **"Save and Continue"**

6. **Summary:**
   - Review and click **"Back to Dashboard"**

### Step 3: Verify Authorized Domains

1. **In Firebase Console:**
   - Go to: Authentication → Settings → Authorized domains
   - Make sure your domain is listed:
     - `localhost` (for development)
     - Your production domain (if deployed)
     - `tournament-app-42bf9.firebaseapp.com` (should be auto-added)

2. **If testing locally:**
   - `localhost` should already be there
   - If not, click "Add domain" and add `localhost`

### Step 4: Verify Project Settings Match

Check that your Firebase config matches:

- **Project ID:** `tournament-app-42bf9`
- **Project Number:** `401788002919`
- **Support Email:** `vdvishalwebdev@gmail.com`

### Step 5: Create OAuth Client ID (For Android Apps)

**If you're using this app on Android (Capacitor), you need to create OAuth client ID:**

1. **Get SHA-1 fingerprint:**
   ```bash
   # Debug keystore
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

2. **Create OAuth Client ID:**
   - Go to: https://console.cloud.google.com/apis/credentials?project=tournament-app-42bf9
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Android"
   - Package name: `com.reviewtask.app`
   - SHA-1: Paste your fingerprint
   - Click "Create"

3. **Add SHA-1 to Firebase:**
   - Go to Firebase Console → Project Settings → Your apps → Android app
   - Add SHA-1 fingerprint in "SHA certificate fingerprints"

**See detailed guide:** [ANDROID_OAUTH_SETUP.md](./ANDROID_OAUTH_SETUP.md)

### Step 6: Wait for Propagation

- Changes can take **2-5 minutes** to propagate
- Clear browser cache and try again
- Try in incognito/private window

## 🔍 Verification Checklist

After completing the steps above, verify:

- [ ] Google provider shows "Enabled" in Firebase Console
- [ ] OAuth consent screen is configured in Google Cloud Console
- [ ] Support email is set in both Firebase and Google Cloud Console
- [ ] Authorized domains include `localhost` (for local testing)
- [ ] Waited 2-5 minutes after making changes
- [ ] Cleared browser cache

## 🚨 Common Issues

### Issue 1: "OAuth client not found"
**Solution:** Make sure OAuth consent screen is configured in Google Cloud Console (Step 2)

### Issue 2: "Unauthorized domain"
**Solution:** Add your domain in Firebase Console → Authentication → Settings → Authorized domains

### Issue 3: "Popup blocked"
**Solution:** Allow popups in your browser settings

### Issue 4: Still getting error after enabling
**Solutions:**
1. Wait 5 minutes for changes to propagate
2. Clear browser cache completely
3. Try in incognito mode
4. Check browser console for detailed error
5. Verify you're using the correct Firebase project

## 🔗 Quick Links

- **Firebase Authentication:** https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent?project=tournament-app-42bf9
- **Authorized Domains:** https://console.firebase.google.com/project/tournament-app-42bf9/authentication/settings

## 📝 Important Notes

1. **Project ID must match:** Make sure you're configuring `tournament-app-42bf9` (not a different project)
2. **OAuth Consent Screen is required:** This is often the missing step!
3. **Support email:** Use the same email (`vdvishalwebdev@gmail.com`) in both places
4. **For production:** You'll need to add your production domain to authorized domains

## ✅ After Fixing

Once enabled:
1. Try Google Sign-In again
2. You should see Google account picker popup
3. After selecting account, you'll be logged in automatically

If you still get errors after following all steps, check the browser console for the exact error code and message.

