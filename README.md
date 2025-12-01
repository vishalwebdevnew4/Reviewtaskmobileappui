# ReviewTask Mobile App

A comprehensive mobile application built with React, TypeScript, and Capacitor for managing review tasks, KYC verification, and earnings withdrawal. The app enables users to complete review tasks, earn rewards, and withdraw earnings after KYC verification.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Services & APIs](#services--apis)
- [Screens & Components](#screens--components)
- [Firebase Setup](#firebase-setup)
- [Building for Mobile](#building-for-mobile)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

ReviewTask is a mobile application that connects users with review tasks from various brands. Users can:

- Browse and filter available review tasks by category
- Submit detailed reviews with ratings, text, and images
- Earn rewards for approved reviews
- Complete KYC verification to enable withdrawals
- Track earnings and transaction history
- Withdraw earnings through multiple payment methods

The app supports both **user** and **company/admin** roles, with different dashboards and capabilities for each.

## ✨ Features

### Authentication
- ✅ Email/Password authentication
- ✅ Phone OTP authentication (Firebase Phone Auth)
- ✅ User registration and profile management
- ✅ Password reset functionality
- ✅ Session management with real-time state updates
- ✅ Protected routes and auto-navigation

### Task Management
- ✅ Browse available review tasks
- ✅ Filter tasks by category (Tech, Fashion, Food, etc.)
- ✅ View detailed task information
- ✅ Submit reviews with ratings, text, and images
- ✅ Track task completion status
- ✅ View personal task history

### Review System
- ✅ 5-star rating system
- ✅ Text review (minimum 50 characters)
- ✅ Image upload (minimum 2 images, max 10MB each)
- ✅ Review status tracking (pending/approved/rejected)
- ✅ Automatic reward distribution upon approval
- ✅ Review management for companies

### KYC Verification
- ✅ Basic information collection
- ✅ Document upload (Aadhaar/PAN)
- ✅ Multiple verification methods
- ✅ Status tracking (pending/approved/rejected)
- ✅ Admin approval workflow
- ✅ KYC-gated withdrawal system

### Earnings & Wallet
- ✅ Real-time earnings tracking
- ✅ Category-wise earnings breakdown
- ✅ Transaction history
- ✅ Withdrawal requests
- ✅ Multiple withdrawal methods (UPI/Bank/Paytm)
- ✅ KYC validation before withdrawal

### Admin/Company Features
- ✅ Company dashboard
- ✅ Task creation and management
- ✅ Review approval/rejection
- ✅ KYC approval/rejection
- ✅ Withdrawal approval/rejection
- ✅ Survey management

### Additional Features
- ✅ Onboarding screens
- ✅ Profile management
- ✅ Settings and preferences
- ✅ Notifications
- ✅ Help & Support
- ✅ Privacy & Security settings
- ✅ Login activity tracking

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Mobile
- **Capacitor** - Native mobile runtime
- **Android** - Native Android support

### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Cloud Functions** - Serverless backend functions

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
Reviewtaskmobileappui/
├── android/                 # Android native project
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── figma/          # Figma-specific components
│   │   └── *.tsx           # Screen components
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── services/           # Business logic services
│   │   ├── authService.ts
│   │   ├── taskService.ts
│   │   ├── reviewService.ts
│   │   ├── kycService.ts
│   │   ├── withdrawalService.ts
│   │   └── userService.ts
│   ├── config/             # Configuration files
│   │   ├── firebase.ts
│   │   ├── database.ts
│   │   └── email.ts
│   ├── db/                 # Database adapters
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── functions/              # Firebase Cloud Functions
│   └── src/
│       └── index.ts
├── backend/               # Optional backend services
├── public/                # Static assets
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore indexes
├── capacitor.config.ts    # Capacitor configuration
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Android Studio** (for mobile builds)
- **Firebase Project** (create at [Firebase Console](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Reviewtaskmobileappui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## ⚙️ Configuration

### Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Phone)
   - Enable Firestore Database
   - Enable Storage
   - Enable Cloud Functions

2. **Get Firebase Credentials**
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the configuration values to your `.env` file

3. **Deploy Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Deploy Firestore Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

5. **Deploy Cloud Functions**
   ```bash
   cd functions
   npm install
   cd ..
   firebase deploy --only functions
   ```

### Capacitor Configuration

The Capacitor configuration is in `capacitor.config.ts`:

```typescript
{
  appId: 'com.reviewtask.app',
  appName: 'ReviewTask',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
}
```

### Admin User Setup

To create an admin user:

1. Sign up through the app
2. Go to Firebase Console > Firestore
3. Find your user document in the `users` collection
4. Update the `role` field to `"admin"`

## 🏗️ Architecture

### Application Flow

```
User Authentication
    ↓
Home Screen (Browse Tasks)
    ↓
Task Details
    ↓
Submit Review
    ↓
Review Approval (Admin)
    ↓
Earnings Added
    ↓
KYC Verification (Optional)
    ↓
Withdrawal Request
    ↓
Withdrawal Approval (Admin)
```

### State Management

- **AuthContext**: Manages authentication state globally
- **Local State**: Component-level state using React hooks
- **Firestore**: Real-time data synchronization

### Service Layer

Services handle all business logic and Firebase interactions:

- `authService.ts` - Authentication operations
- `taskService.ts` - Task CRUD operations
- `reviewService.ts` - Review submission and management
- `kycService.ts` - KYC verification workflow
- `withdrawalService.ts` - Withdrawal requests
- `userService.ts` - User profile and earnings

## 🗄️ Database Schema

### Collections

#### `users`
```typescript
{
  uid: string;              // Firebase Auth UID
  email: string;
  phoneNumber?: string;
  displayName?: string;
  role: 'user' | 'admin' | 'company';
  earnings: number;
  totalEarnings: number;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `tasks`
```typescript
{
  id: string;
  title: string;
  brand: string;
  description: string;
  image: string;
  reward: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `reviews`
```typescript
{
  id: string;
  userId: string;
  taskId: string;
  rating: number;           // 1-5
  reviewText: string;
  images: string[];         // Storage URLs
  status: 'pending' | 'approved' | 'rejected';
  rewardAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `kyc_requests`
```typescript
{
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  phone: string;
  email: string;
  documentType: 'aadhaar' | 'pan';
  documentFront: string;    // Storage URL
  documentBack?: string;    // Storage URL
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
}
```

#### `withdrawals`
```typescript
{
  id: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm';
  accountDetails: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    paytmNumber?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Timestamp;
  processedAt?: Timestamp;
}
```

## 🔌 Services & APIs

### AuthService

```typescript
// Email/Password authentication
signUpWithEmail(email: string, password: string, displayName: string)
signInWithEmail(email: string, password: string)
signOut()

// Phone authentication
signInWithPhone(phoneNumber: string)
verifyOTP(verificationId: string, otp: string)

// Profile management
updateProfile(data: Partial<UserProfile>)
getUserProfile(userId: string)
```

### TaskService

```typescript
getTasks(filters?: { category?: string })
getTaskById(taskId: string)
createTask(taskData: TaskData)        // Admin only
updateTask(taskId: string, data: Partial<TaskData>)  // Admin only
deleteTask(taskId: string)           // Admin only
```

### ReviewService

```typescript
submitReview(reviewData: ReviewData)
getUserReviews(userId: string)
getReviewById(reviewId: string)
uploadReviewImages(files: File[])
```

### KYCService

```typescript
submitKYC(kycData: KYCData)
getKYCStatus(userId: string)
uploadKYCDocument(file: File, type: 'front' | 'back')
```

### WithdrawalService

```typescript
requestWithdrawal(withdrawalData: WithdrawalData)
getUserWithdrawals(userId: string)
getWithdrawalById(withdrawalId: string)
```

### UserService

```typescript
getUserEarnings(userId: string)
getEarningsByCategory(userId: string)
getTransactionHistory(userId: string)
```

## 📱 Screens & Components

### Authentication Screens
- `OnboardingScreens` - First-time user onboarding
- `LoginScreen` - Email/Phone login
- `SignupScreen` - User registration
- `OTPScreen` - OTP verification
- `ForgotPasswordScreen` - Password reset initiation
- `ResetPasswordOTPScreen` - OTP for password reset
- `ResetPasswordScreen` - New password entry

### Main Screens
- `HomeScreen` - Task browsing and filtering
- `TaskDetailsScreen` - Detailed task information
- `SubmitSurveyScreen` - Review submission
- `MyTasksScreen` - User's completed tasks
- `WalletScreen` - Earnings and transaction history
- `WithdrawScreen` - Withdrawal requests
- `ProfileScreen` - User profile
- `EditProfileScreen` - Profile editing

### KYC Screens
- `KYCBasicInfoScreen` - Basic information collection
- `KYCDocumentScreen` - Document upload
- `KYCVerificationMethodScreen` - Verification method selection
- `KYCStatusScreen` - KYC status display
- `WithdrawRestrictionScreen` - KYC requirement notice

### Settings Screens
- `SettingsScreen` - App settings
- `NotificationsScreen` - Notification preferences
- `HelpSupportScreen` - Help and support
- `TermsPrivacyScreen` - Terms and privacy policy
- `PrivacySecurityScreen` - Privacy and security settings
- `PreferencesScreen` - User preferences
- `LoginActivityScreen` - Login history

### Admin/Company Screens
- `CompanyDashboard` - Company/admin dashboard
- `SurveyManagementScreen` - Task/survey management
- `EditTaskScreen` - Task editing
- `ReviewManagementScreen` - Review management

## 🔥 Firebase Setup

### Authentication Setup

1. **Enable Email/Password Authentication**
   - Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password"

2. **Enable Phone Authentication**
   - Enable "Phone" sign-in method
   - Configure reCAPTCHA
   - Add test phone numbers for development

### Firestore Setup

1. **Create Collections**
   - Collections are created automatically on first write
   - Ensure indexes are deployed for complex queries

2. **Security Rules**
   - Rules are defined in `firestore.rules`
   - Deploy with: `firebase deploy --only firestore:rules`

### Storage Setup

1. **Storage Rules**
   - Default rules allow authenticated uploads
   - Configure in Firebase Console > Storage > Rules

2. **Storage Structure**
   ```
   /reviews/{reviewId}/{imageName}
   /kyc/{userId}/{documentType}_{side}
   ```

### Cloud Functions

Functions are located in `functions/src/index.ts`:

- `approveReview` - Approves review and adds reward
- `rejectReview` - Rejects a review
- `approveKYC` - Approves KYC request
- `rejectKYC` - Rejects KYC request
- `approveWithdrawal` - Approves withdrawal and deducts balance
- `rejectWithdrawal` - Rejects withdrawal request

## 📱 Building for Mobile

### Android Setup

1. **Build web app**
   ```bash
   npm run build
   ```

2. **Add Android platform** (if not already added)
   ```bash
   npx cap add android
   ```

3. **Sync assets**
   ```bash
   npx cap sync
   ```

4. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

5. **Build APK/AAB**
   - In Android Studio, go to Build > Build Bundle(s) / APK(s)
   - For Play Store: Build > Generate Signed Bundle / APK

### iOS Setup (Future)

```bash
npx cap add ios
npx cap sync
npx cap open ios
```

## 🚢 Deployment

### Web Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

3. **Or deploy to other platforms**
   - Netlify, Vercel, etc.
   - Upload the `build` directory

### Mobile Deployment

1. **Android**
   - Build signed APK/AAB in Android Studio
   - Upload to Google Play Console

2. **iOS** (Future)
   - Build in Xcode
   - Upload to App Store Connect

## 💻 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

### File Naming

- Components: `PascalCase.tsx`
- Services: `camelCase.ts`
- Utilities: `camelCase.ts`
- Types: `PascalCase.ts`

### Component Structure

```typescript
// Imports
import React from 'react';

// Types/Interfaces
interface ComponentProps {
  // props
}

// Component
export function Component({ prop }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return <div>...</div>;
}
```

### Error Handling

- Use try-catch blocks for async operations
- Display user-friendly error messages
- Log errors for debugging
- Use error boundaries for React errors

### Testing

- Write unit tests for services
- Test components with React Testing Library
- Test Firebase functions locally

## 🐛 Troubleshooting

### Common Issues

#### Firebase Authentication Errors

**Issue**: Phone authentication not working
- **Solution**: Ensure reCAPTCHA is configured in Firebase Console
- Check that test phone numbers are added for development

**Issue**: Email authentication fails
- **Solution**: Verify Email/Password is enabled in Firebase Console
- Check email format and password requirements

#### Firestore Errors

**Issue**: Permission denied errors
- **Solution**: Check Firestore security rules
- Ensure user is authenticated
- Verify user has correct permissions

**Issue**: Index errors
- **Solution**: Deploy indexes: `firebase deploy --only firestore:indexes`
- Check `firestore.indexes.json` for required indexes

#### Build Errors

**Issue**: TypeScript errors
- **Solution**: Run `npm run build` to see detailed errors
- Check type definitions
- Ensure all dependencies are installed

**Issue**: Capacitor sync errors
- **Solution**: Run `npx cap sync` to sync assets
- Check `capacitor.config.ts` for correct paths

#### Storage Errors

**Issue**: File upload fails
- **Solution**: Check file size limits (max 10MB)
- Verify Storage rules allow authenticated uploads
- Check network connectivity

### Debugging

1. **Check Browser Console** for JavaScript errors
2. **Check Firebase Console** for backend errors
3. **Check Cloud Functions Logs**: `firebase functions:log`
4. **Use React DevTools** for component debugging
5. **Check Network Tab** for API calls

## 📚 Additional Documentation

- [Setup Guide](./README_SETUP.md) - Detailed setup instructions
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Feature implementation status
- [Build APK Guide](./BUILD_APK.md) - Mobile app build instructions
- [Firebase Setup](./FIREBASE_PHONE_SETUP.md) - Firebase configuration
- [Auto Conversion Guide](./AUTO_CONVERSION_GUIDE.md) - Migration guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase Console for errors
3. Check Cloud Functions logs
4. Contact the development team

---

**Status**: ✅ Core functionality complete and ready for production!

**Last Updated**: 2024
