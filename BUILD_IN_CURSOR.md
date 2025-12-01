# Building APK in Cursor AI

Yes! You can build your Android APK directly in Cursor using the terminal. Here's how:

## Quick Build (One Command)

Simply run this in Cursor's terminal:

```bash
npm run apk:build
```

This will:
1. Build your web app
2. Sync with Capacitor
3. Build the Android APK

The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Prerequisites

Before building, make sure you have:

1. **Java JDK 11+** installed
   - Check: `java -version`
   - Download: https://adoptium.net/

2. **Android SDK** installed
   - Usually comes with Android Studio
   - Set `ANDROID_HOME` environment variable if needed

## Step-by-Step Build Process

### Option 1: Using npm script (Easiest)

```bash
npm run apk:build
```

### Option 2: Manual steps

```bash
# 1. Build web app
npm run build

# 2. Sync with Capacitor
npm run cap:sync

# 3. Build APK
cd android
gradlew.bat assembleDebug
```

## Build Release APK

For a release (production) APK:

```bash
npm run apk:release
```

**Note:** Release APK requires signing. See `BUILD_APK.md` for signing setup.

## Troubleshooting

### Error: "gradlew.bat is not recognized"

Make sure you're in the `android` directory:
```bash
cd android
gradlew.bat assembleDebug
```

### Error: "JAVA_HOME not set"

1. Install JDK 11 or higher
2. Set environment variable:
   - Windows: Add `JAVA_HOME` pointing to JDK folder
   - Example: `C:\Program Files\Java\jdk-11`

### Error: "Android SDK not found"

1. Install Android Studio
2. Install Android SDK (API 33+)
3. Set `ANDROID_HOME` environment variable:
   - Windows: `C:\Users\YourName\AppData\Local\Android\Sdk`

### Error: "Gradle build failed"

First time builds may need Android Studio to sync:
1. Open Android Studio
2. Open the `android` folder
3. Wait for Gradle sync to complete
4. Then try building again in Cursor

## Finding Your APK

After successful build, your APK is located at:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Testing the APK

1. **Transfer to phone:**
   - Copy `app-debug.apk` to your Android device
   - Enable "Install from Unknown Sources" in settings
   - Tap the APK file to install

2. **Install via ADB:**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Tips

- First build may take 5-10 minutes (downloading dependencies)
- Subsequent builds are much faster
- Debug APKs are larger but easier to test
- Use `npm run apk:build` for quick builds during development

## What Gets Built

- **Debug APK**: For testing (larger file, includes debug symbols)
- **Release APK**: For production (smaller, optimized, requires signing)

## Next Steps

After building:
1. Test the APK on your device
2. For production, set up signing (see `BUILD_APK.md`)
3. Consider building an AAB (Android App Bundle) for Google Play Store

