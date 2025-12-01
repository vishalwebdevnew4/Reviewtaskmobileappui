#!/bin/bash
# Build APK script for Windows (PowerShell compatible)

echo "🚀 Building ReviewTask APK..."

# Step 1: Build web app
echo "📦 Building web app..."
npm run build

# Step 2: Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync

# Step 3: Build Android APK
echo "🤖 Building Android APK..."
cd android
./gradlew.bat assembleDebug

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    echo "📱 APK location: android/app/build/outputs/apk/debug/app-debug.apk"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

