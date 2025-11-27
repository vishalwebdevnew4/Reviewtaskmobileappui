# Enable Email/Password Authentication

## Quick Setup (30 seconds)

### Step 1: Enable Email/Password in Firebase

1. **Open Firebase Console:**
   https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers

2. **Click on "Email/Password"** in the providers list

3. **Toggle "Enable" to ON**

4. **Click "Save"**

That's it! Email/Password authentication is now enabled.

## ✅ What's Changed in Your App

- **Email/Password is now the PRIMARY login method**
- Phone OTP is available as a secondary option (hidden by default)
- Users can click "Login with Phone OTP instead" if they want to use phone

## 🎯 Current Setup

### Login Screen:
- Shows Email and Password fields first
- Phone OTP option is hidden (click to show)

### Signup Screen:
- Shows Full Name, Email, and Password fields first
- Phone OTP option is hidden (click to show)

## 📱 Future: Enable Phone OTP

When you're ready to enable Phone OTP:
1. Upgrade to Blaze Plan
2. Enable Phone provider in Firebase
3. Phone OTP will work automatically

## ✨ Benefits of Email/Password

- ✅ Works immediately (no upgrade needed)
- ✅ Free to use
- ✅ No SMS costs
- ✅ Works on all devices
- ✅ Users can reset passwords via email

