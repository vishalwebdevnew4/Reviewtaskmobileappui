# ReviewTask Mobile App - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password and Phone)
   - Firestore Database
   - Storage
   - Cloud Functions
3. Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

4. Update `.env` with your Firebase project credentials from:
   - Firebase Console > Project Settings > General > Your apps

### 3. Firestore Setup

1. Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

2. Deploy Firestore indexes:
```bash
firebase deploy --only firestore:indexes
```

### 4. Cloud Functions Setup

1. Install Functions dependencies:
```bash
cd functions
npm install
cd ..
```

2. Deploy Cloud Functions:
```bash
firebase deploy --only functions
```

### 5. Run Development Server

```bash
npm run dev
```

### 6. Build for Production

```bash
npm run build
```

## 📱 Mobile App Build (Capacitor)

### Android Setup

1. Add Android platform:
```bash
npm run cap:add:android
```

2. Sync web assets:
```bash
npm run cap:sync
```

3. Open in Android Studio:
```bash
npm run cap:open:android
```

4. Build APK/AAB in Android Studio for Play Store

## 🔐 Admin Setup

To create an admin user:

1. Create a user account through the app
2. In Firebase Console > Firestore, go to `users` collection
3. Find your user document
4. Update the `role` field to `"admin"`

## 📋 Database Collections

The app uses the following Firestore collections:

- **users**: User profiles and earnings
- **tasks**: Available review tasks
- **reviews**: User-submitted reviews
- **kyc_requests**: KYC verification requests
- **withdrawals**: Withdrawal requests
- **app_settings**: App configuration (optional)

## 🔒 Security Rules

Firestore security rules are configured in `firestore.rules`:
- Users can only read/write their own data
- KYC and withdrawals only modifiable by admin
- Tasks readable by all authenticated users
- Reviews write-only for the user who completes them

## 📝 Cloud Functions

Cloud Functions handle:
- `approveReview`: Approves review and adds reward to user earnings
- `rejectReview`: Rejects a review
- `approveKYC`: Approves KYC request
- `rejectKYC`: Rejects KYC request
- `approveWithdrawal`: Approves withdrawal and deducts from balance
- `rejectWithdrawal`: Rejects withdrawal request

All functions require admin authentication.

## 🎨 Features

✅ Email + Phone OTP Authentication
✅ Task Listing and Details
✅ Review Submission with Image Upload
✅ KYC Verification Flow
✅ Earnings Tracking
✅ Withdrawal System (KYC-gated)
✅ Admin Panel Integration
✅ Real-time Data Sync

## 🐛 Troubleshooting

### Firebase Auth Phone Number
- Ensure reCAPTCHA is properly configured in Firebase Console
- For testing, add test phone numbers in Firebase Console > Authentication > Sign-in method > Phone

### Firestore Indexes
- If you see index errors, deploy indexes: `firebase deploy --only firestore:indexes`

### Cloud Functions
- Ensure you have billing enabled on Firebase project
- Check function logs: `firebase functions:log`

## 📚 Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Documentation](https://react.dev)

