# Building Android APK

This guide will help you build an Android APK from your ReviewTask mobile app.

## Prerequisites

1. **Java Development Kit (JDK)** - Version 11 or higher
   - Download from: https://adoptium.net/
   - Set `JAVA_HOME` environment variable

2. **Android Studio** - Latest version
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API level 33 or higher)
   - Set `ANDROID_HOME` environment variable

3. **Node.js and npm** - Already installed ✓

## Build Steps

### Option 1: Using Android Studio (Recommended)

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor:**
   ```bash
   npm run cap:sync
   ```

3. **Open in Android Studio:**
   ```bash
   npm run cap:open
   ```
   Or manually: Open Android Studio → Open → Select `android` folder

4. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Or use **Build** → **Generate Signed Bundle / APK** for release APK
   - APK will be generated in `android/app/build/outputs/apk/`

### Option 2: Using Command Line (Advanced)

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor:**
   ```bash
   npm run cap:sync
   ```

3. **Build APK using Gradle:**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   (On Windows: `gradlew.bat assembleDebug`)

4. **Find the APK:**
   - Location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 3: Quick Build Script

```bash
npm run cap:run
```
This will build, sync, and attempt to run on a connected device/emulator.

## Building Release APK (For Production)

1. **Generate a keystore** (first time only):
   ```bash
   keytool -genkey -v -keystore reviewtask-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias reviewtask
   ```

2. **Create `android/key.properties`:**
   ```properties
   storePassword=your-store-password
   keyPassword=your-key-password
   keyAlias=reviewtask
   storeFile=../reviewtask-release-key.jks
   ```

3. **Update `android/app/build.gradle`:**
   Add signing config (see Android documentation)

4. **Build release APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Troubleshooting

### Issue: "Command not found: npx"
- Make sure Node.js is installed and in PATH
- Try: `npm install -g @capacitor/cli`

### Issue: "Android SDK not found"
- Install Android Studio
- Set `ANDROID_HOME` environment variable:
  - Windows: `C:\Users\YourName\AppData\Local\Android\Sdk`
  - Add to PATH: `%ANDROID_HOME%\platform-tools`

### Issue: "JAVA_HOME not set"
- Install JDK 11+
- Set `JAVA_HOME` environment variable:
  - Windows: `C:\Program Files\Java\jdk-11`
- Add to PATH: `%JAVA_HOME%\bin`

### Issue: Gradle build fails
- Open Android Studio and let it sync Gradle
- Check `android/build.gradle` and `android/app/build.gradle`
- Try: `cd android && ./gradlew clean`

## Testing the APK

1. **On Emulator:**
   - Open Android Studio
   - Create/Start an Android Virtual Device (AVD)
   - Run the app from Android Studio

2. **On Physical Device:**
   - Enable Developer Options and USB Debugging
   - Connect via USB
   - Run: `npm run cap:run` or use Android Studio

3. **Install APK directly:**
   - Transfer `app-debug.apk` to your Android device
   - Enable "Install from Unknown Sources"
   - Open and install the APK

## App Configuration

- **App ID:** `com.reviewtask.app`
- **App Name:** ReviewTask
- **Package Name:** com.reviewtask.app

To change these, edit `capacitor.config.json` and run `npm run cap:sync`.

## Notes

- The first build may take 5-10 minutes (downloading dependencies)
- Debug APKs are larger but easier to test
- Release APKs are optimized and signed for distribution
- For Google Play Store, you'll need to build an AAB (Android App Bundle) instead of APK


