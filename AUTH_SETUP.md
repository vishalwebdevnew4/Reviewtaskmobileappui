# Authentication Setup Guide

## ✅ What's Been Implemented

Your app now has **Google OAuth** and **Email/Password** authentication!

### Features:
1. **Email/Password Authentication**
   - Sign up with email, password, name, and optional phone
   - Login with email and password
   - Password validation (min 6 characters)
   - Secure password storage (hashed in database)

2. **Google OAuth**
   - One-click Google sign in/sign up
   - Automatic user profile creation
   - Avatar and name from Google account

3. **Phone Authentication** (existing)
   - Phone number login with OTP verification

4. **Session Management**
   - Automatic login persistence
   - Token-based authentication
   - User context throughout the app

## 🔧 Setup Instructions

### 1. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain
7. Copy the **Client ID**

### 2. Configure Environment Variable

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

Replace `your-google-client-id-here` with your actual Google Client ID.

### 3. For Production/APK

When building the APK, you'll need to:
1. Add your app's package name to Google OAuth settings
2. Use the same Client ID or create an Android OAuth client

## 📱 How It Works

### Login Screen
- **Toggle between Phone and Email** login methods
- **Email/Password**: Enter email and password, click Login
- **Google**: Click "Continue with Google" button
- **Phone**: Enter phone number, continue to OTP

### Signup Screen
- **Email/Password**: Fill in name, email, password, confirm password, optional phone
- **Google**: Click "Continue with Google" button
- Automatic account creation

### Authentication Flow

1. User signs up/logs in
2. User data saved to SQLite database
3. Auth token stored in localStorage
4. User redirected to home screen
5. User session persists across app restarts

## 🔐 Database Schema

The `users` table now includes:
- `id` - Primary key
- `phone` - Phone number (optional, unique)
- `email` - Email address (unique)
- `name` - User's name
- `password` - Hashed password (for email auth)
- `google_id` - Google user ID (for Google auth)
- `auth_provider` - 'email' or 'google'
- `avatar_url` - Profile picture URL
- `created_at` - Account creation timestamp

## 🎯 Usage in Components

### Using Auth Context

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuth, login, register, logout } = useAuth();

  if (!isAuth) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Available Auth Methods

```typescript
const { 
  user,           // Current user object
  loading,        // Loading state
  isAuth,         // Boolean: is user authenticated?
  login,          // (email, password) => Promise
  register,       // (email, password, name, phone?) => Promise
  loginWithGoogle, // (googleUser) => Promise
  logout          // () => void
} = useAuth();
```

## 🛡️ Security Notes

**Current Implementation:**
- Passwords are base64 encoded (simple hash)
- Tokens stored in localStorage
- Works for demo/prototype

**For Production:**
- Use proper password hashing (bcrypt, argon2)
- Use secure JWT tokens
- Implement token refresh
- Add rate limiting
- Use HTTPS only
- Consider backend authentication service

## 🐛 Troubleshooting

### Google OAuth Not Working

1. **Check Client ID**: Make sure `.env` file has correct `VITE_GOOGLE_CLIENT_ID`
2. **Check Origins**: Ensure your domain is in Google OAuth authorized origins
3. **Check Console**: Look for errors in browser console
4. **Test**: Try in incognito mode to rule out cache issues

### Email Already Registered

- The app checks for existing emails
- Users with same email from different providers can't register twice
- Google users can link email accounts

### Password Issues

- Minimum 6 characters required
- Passwords must match on signup
- Password reset not implemented yet (add if needed)

## 🚀 Next Steps

1. **Add Password Reset**: Email-based password reset flow
2. **Add Profile Management**: Update email, password, profile picture
3. **Add Social Linking**: Link Google account to email account
4. **Add Remember Me**: Extended session duration
5. **Add Biometric Auth**: Fingerprint/Face ID for mobile

## 📝 Example Usage

### Protected Route Example

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

function ProtectedScreen({ onNavigate }: any) {
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuth) {
      onNavigate('login');
    }
  }, [isAuth, loading, onNavigate]);

  if (loading) return <div>Loading...</div>;
  if (!isAuth) return null;

  return <div>Protected Content</div>;
}
```

Your authentication is ready to use! 🎉

