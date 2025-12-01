# Build APK script for Windows PowerShell

Write-Host "🚀 Building ReviewTask APK..." -ForegroundColor Cyan

# Step 1: Build web app
Write-Host "📦 Building web app..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Web build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Sync with Capacitor
Write-Host "🔄 Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Capacitor sync failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Build Android APK
Write-Host "🤖 Building Android APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew.bat assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ APK built successfully!" -ForegroundColor Green
    Write-Host "📱 APK location: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Green
    Set-Location ..
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    Set-Location ..
    exit 1
}

