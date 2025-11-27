# Android OAuth Client ID Setup for Google Sign-In

## ✅ Do You Need to Create OAuth Client ID?

**For Web App:** ❌ NO - Firebase creates it automatically  
**For Android App:** ✅ YES - You need to create it manually with SHA-1 fingerprint

Since you're using Capacitor (mobile app), you need to create OAuth client IDs for Android.

## 🚀 Step-by-Step: Create OAuth Client ID for Android

### Step 1: Get Your SHA-1 Fingerprint

#### For Debug Build (Development):
```bash
# On Windows (using Git Bash or PowerShell)
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android

# On Mac/Linux
cd android/app
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### For Release Build (Production):
```bash
# If you have a release keystore
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

**Copy the SHA-1 fingerprint** (looks like: `AA:BB:CC:DD:EE:FF:...`)

### Step 2: Create OAuth Client ID in Google Cloud Console

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/apis/credentials?project=tournament-app-42bf9

2. **Click "Create Credentials" → "OAuth client ID"**

3. **If prompted, configure OAuth consent screen first:**
   - Follow the steps in `ENABLE_GOOGLE_AUTH.md` Step 2
   - Then come back to create OAuth client ID

4. **Select Application Type:**
   - Choose **"Android"**

5. **Fill in Details:**
   - **Name:** `ReviewTask Android App` (or any name)
   - **Package name:** `com.reviewtask.app` (from `capacitor.config.ts`)
   - **SHA-1 certificate fingerprint:** Paste your SHA-1 fingerprint from Step 1

6. **Click "Create"**

7. **Save the Client ID:**
   - You'll see a Client ID (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
   - You don't need to add this to your code - Firebase handles it automatically
   - Just make sure it's created in the same Google Cloud project

### Step 3: Verify in Firebase Console

1. **Go to Firebase Console:**
   https://console.firebase.google.com/project/tournament-app-42bf9/settings/general

2. **Scroll to "Your apps" section**

3. **Find your Android app** (or add it if not present):
   - Click "Add app" → Android
   - Package name: `com.reviewtask.app`
   - App nickname: `ReviewTask Android`
   - Click "Register app"

4. **Add SHA-1 fingerprint:**
   - In the Android app settings, find "SHA certificate fingerprints"
   - Click "Add fingerprint"
   - Paste your SHA-1 fingerprint
   - Click "Save"

### Step 4: Download google-services.json (if needed)

1. **In Firebase Console:**
   - Go to Project Settings → Your apps → Android app
   - Download `google-services.json`
   - Place it in: `android/app/google-services.json`

## 📝 Important Notes

1. **You need separate OAuth clients for:**
   - ✅ Web (auto-created by Firebase)
   - ✅ Android Debug (with debug SHA-1)
   - ✅ Android Release (with release SHA-1)

2. **SHA-1 Fingerprints:**
   - Debug and Release builds have different SHA-1 fingerprints
   - You need to add both if you want Google Sign-In to work in both

3. **Package Name Must Match:**
   - OAuth client package name: `com.reviewtask.app`
   - Must match `appId` in `capacitor.config.ts`

4. **Firebase Project:**
   - Make sure OAuth client is created in project: `tournament-app-42bf9`
   - Same project as your Firebase config

## ✅ Verification Checklist

After creating OAuth client ID:

- [ ] OAuth consent screen is configured
- [ ] OAuth client ID created for Android
- [ ] SHA-1 fingerprint added to OAuth client
- [ ] SHA-1 fingerprint added to Firebase Android app settings
- [ ] Package name matches: `com.reviewtask.app`
- [ ] `google-services.json` downloaded (if needed)

## 🔍 Quick Links

- **Google Cloud Credentials:** https://console.cloud.google.com/apis/credentials?project=tournament-app-42bf9
- **Firebase Project Settings:** https://console.firebase.google.com/project/tournament-app-42bf9/settings/general
- **OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent?project=tournament-app-42bf9

## 🚨 Common Issues

### "OAuth client not found"
- Make sure OAuth client is created in the same Google Cloud project
- Verify package name matches exactly

### "SHA-1 fingerprint mismatch"
- Make sure you're using the correct SHA-1 for debug vs release
- Re-check the fingerprint you added

### "Package name mismatch"
- Verify `appId` in `capacitor.config.ts` matches OAuth client package name

## 💡 Pro Tip

For development, you can use the debug SHA-1. For production, you'll need the release SHA-1 from your production keystore.

