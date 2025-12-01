# ReviewTask Mobile App - Technical Documentation

## 📖 Table of Contents

- [API Reference](#api-reference)
- [Service Layer Details](#service-layer-details)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Firebase Integration](#firebase-integration)
- [Security Implementation](#security-implementation)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Testing Strategy](#testing-strategy)

## 🔌 API Reference

### Authentication Service (`authService.ts`)

#### `signUpWithEmail(email: string, password: string, displayName: string)`
Creates a new user account with email and password.

**Parameters:**
- `email`: User email address
- `password`: User password (min 6 characters)
- `displayName`: User's display name

**Returns:** `Promise<UserCredential>`

**Example:**
```typescript
const user = await signUpWithEmail(
  'user@example.com',
  'password123',
  'John Doe'
);
```

#### `signInWithEmail(email: string, password: string)`
Signs in an existing user with email and password.

**Parameters:**
- `email`: User email address
- `password`: User password

**Returns:** `Promise<UserCredential>`

#### `signInWithPhone(phoneNumber: string)`
Initiates phone number authentication.

**Parameters:**
- `phoneNumber`: Phone number in E.164 format (e.g., +1234567890)

**Returns:** `Promise<ConfirmationResult>`

**Example:**
```typescript
const confirmation = await signInWithPhone('+1234567890');
// Store confirmation.verificationId for OTP verification
```

#### `verifyOTP(verificationId: string, otp: string)`
Verifies the OTP code sent to the phone number.

**Parameters:**
- `verificationId`: Verification ID from `signInWithPhone`
- `otp`: 6-digit OTP code

**Returns:** `Promise<UserCredential>`

#### `signOut()`
Signs out the current user.

**Returns:** `Promise<void>`

#### `updateProfile(data: Partial<UserProfile>)`
Updates user profile information.

**Parameters:**
- `data`: Partial user profile object

**Returns:** `Promise<void>`

#### `getUserProfile(userId: string)`
Retrieves user profile from Firestore.

**Parameters:**
- `userId`: Firebase Auth UID

**Returns:** `Promise<UserProfile | null>`

### Task Service (`taskService.ts`)

#### `getTasks(filters?: TaskFilters)`
Fetches tasks from Firestore with optional filters.

**Parameters:**
```typescript
interface TaskFilters {
  category?: string;
  status?: 'active' | 'completed' | 'expired';
  limit?: number;
}
```

**Returns:** `Promise<Task[]>`

**Example:**
```typescript
// Get all active tech tasks
const tasks = await getTasks({ category: 'tech', status: 'active' });
```

#### `getTaskById(taskId: string)`
Retrieves a single task by ID.

**Parameters:**
- `taskId`: Task document ID

**Returns:** `Promise<Task | null>`

#### `createTask(taskData: TaskData)` (Admin Only)
Creates a new task.

**Parameters:**
```typescript
interface TaskData {
  title: string;
  brand: string;
  description: string;
  image: string;
  reward: number;
  deadline: string;
  category: string;
}
```

**Returns:** `Promise<string>` (task ID)

#### `updateTask(taskId: string, data: Partial<TaskData>)` (Admin Only)
Updates an existing task.

**Parameters:**
- `taskId`: Task document ID
- `data`: Partial task data to update

**Returns:** `Promise<void>`

#### `deleteTask(taskId: string)` (Admin Only)
Deletes a task.

**Parameters:**
- `taskId`: Task document ID

**Returns:** `Promise<void>`

### Review Service (`reviewService.ts`)

#### `submitReview(reviewData: ReviewData)`
Submits a new review for a task.

**Parameters:**
```typescript
interface ReviewData {
  taskId: string;
  rating: number;        // 1-5
  reviewText: string;    // min 50 characters
  images: string[];      // Storage URLs
}
```

**Returns:** `Promise<string>` (review ID)

**Example:**
```typescript
const reviewId = await submitReview({
  taskId: 'task123',
  rating: 5,
  reviewText: 'Great product! Highly recommend...',
  images: ['https://storage.../image1.jpg', 'https://storage.../image2.jpg']
});
```

#### `getUserReviews(userId: string)`
Gets all reviews submitted by a user.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<Review[]>`

#### `getReviewById(reviewId: string)`
Retrieves a single review by ID.

**Parameters:**
- `reviewId`: Review document ID

**Returns:** `Promise<Review | null>`

#### `uploadReviewImages(files: File[])`
Uploads review images to Firebase Storage.

**Parameters:**
- `files`: Array of File objects (max 10MB each, min 2 files)

**Returns:** `Promise<string[]>` (array of Storage URLs)

### KYC Service (`kycService.ts`)

#### `submitKYC(kycData: KYCData)`
Submits KYC verification request.

**Parameters:**
```typescript
interface KYCData {
  fullName: string;
  dob: string;           // Date of birth
  phone: string;
  email: string;
  documentType: 'aadhaar' | 'pan';
  documentFront: string; // Storage URL
  documentBack?: string; // Storage URL (optional)
}
```

**Returns:** `Promise<string>` (KYC request ID)

#### `getKYCStatus(userId: string)`
Gets KYC verification status for a user.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<KYCStatus | null>`

#### `uploadKYCDocument(file: File, type: 'front' | 'back')`
Uploads KYC document to Firebase Storage.

**Parameters:**
- `file`: Document file (image or PDF)
- `type`: Document side ('front' or 'back')

**Returns:** `Promise<string>` (Storage URL)

### Withdrawal Service (`withdrawalService.ts`)

#### `requestWithdrawal(withdrawalData: WithdrawalData)`
Creates a withdrawal request.

**Parameters:**
```typescript
interface WithdrawalData {
  amount: number;
  method: 'upi' | 'bank' | 'paytm';
  accountDetails: {
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    paytmNumber?: string;
  };
}
```

**Returns:** `Promise<string>` (withdrawal ID)

**Example:**
```typescript
const withdrawalId = await requestWithdrawal({
  amount: 1000,
  method: 'upi',
  accountDetails: {
    upiId: 'user@paytm'
  }
});
```

#### `getUserWithdrawals(userId: string)`
Gets all withdrawal requests for a user.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<Withdrawal[]>`

#### `getWithdrawalById(withdrawalId: string)`
Retrieves a single withdrawal by ID.

**Parameters:**
- `withdrawalId`: Withdrawal document ID

**Returns:** `Promise<Withdrawal | null>`

### User Service (`userService.ts`)

#### `getUserEarnings(userId: string)`
Gets total earnings for a user.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<{ total: number; available: number }>`

#### `getEarningsByCategory(userId: string)`
Gets earnings breakdown by category.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<Record<string, number>>`

#### `getTransactionHistory(userId: string)`
Gets transaction history for a user.

**Parameters:**
- `userId`: User ID

**Returns:** `Promise<Transaction[]>`

## 🏗️ Service Layer Details

### Service Architecture

All services follow a consistent pattern:

1. **Firebase Integration**: Direct interaction with Firebase services
2. **Error Handling**: Try-catch blocks with meaningful error messages
3. **Type Safety**: TypeScript interfaces for all data structures
4. **Validation**: Input validation before Firebase operations
5. **Logging**: Console logging for debugging (remove in production)

### Service Dependencies

```
authService
  └── Firebase Auth
  └── Firestore (users collection)

taskService
  └── Firestore (tasks collection)

reviewService
  └── Firestore (reviews collection)
  └── Firebase Storage (images)

kycService
  └── Firestore (kyc_requests collection)
  └── Firebase Storage (documents)

withdrawalService
  └── Firestore (withdrawals collection)
  └── Firestore (users collection - for balance check)

userService
  └── Firestore (users collection)
  └── Firestore (reviews collection - for earnings calculation)
```

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── App Component
│       ├── OnboardingScreens
│       ├── LoginScreen
│       ├── SignupScreen
│       ├── OTPScreen
│       ├── HomeScreen
│       │   ├── TaskCard (multiple)
│       │   └── CategoryChip (multiple)
│       ├── TaskDetailsScreen
│       ├── SubmitSurveyScreen
│       ├── MyTasksScreen
│       ├── WalletScreen
│       ├── WithdrawScreen
│       ├── ProfileScreen
│       ├── KYCBasicInfoScreen
│       ├── KYCDocumentScreen
│       ├── KYCStatusScreen
│       └── ... (other screens)
└── Toaster (Notifications)
```

### Component Patterns

#### Screen Components
- Receive `onNavigate` prop for navigation
- Handle their own state and side effects
- Use services for data operations
- Display loading and error states

#### UI Components (`src/components/ui/`)
- Reusable, generic components
- Accept props for customization
- No business logic
- Examples: Button, Input, Card, Dialog

#### Container Components
- Connect to services and contexts
- Pass data to presentational components
- Handle business logic

## 🔄 State Management

### AuthContext

The `AuthContext` provides global authentication state:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  // ... other methods
}
```

**Usage:**
```typescript
const { user, loading, signIn } = useAuth();
```

### Local State

Components use React hooks for local state:

- `useState` - Component state
- `useEffect` - Side effects and subscriptions
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values

### Firestore Real-time Updates

Components subscribe to Firestore collections for real-time updates:

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db, 'tasks'), where('status', '==', 'active')),
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasks);
    }
  );

  return () => unsubscribe();
}, []);
```

## 🔥 Firebase Integration

### Firestore Queries

#### Basic Query
```typescript
const tasksRef = collection(db, 'tasks');
const q = query(tasksRef, where('status', '==', 'active'));
const snapshot = await getDocs(q);
```

#### Pagination
```typescript
const first = query(collection(db, 'tasks'), orderBy('createdAt'), limit(10));
const snapshot = await getDocs(first);
const lastDoc = snapshot.docs[snapshot.docs.length - 1];

const next = query(
  collection(db, 'tasks'),
  orderBy('createdAt'),
  startAfter(lastDoc),
  limit(10)
);
```

#### Real-time Listener
```typescript
const unsubscribe = onSnapshot(
  query(collection(db, 'reviews'), where('userId', '==', userId)),
  (snapshot) => {
    // Handle updates
  }
);
```

### Storage Operations

#### Upload File
```typescript
const storageRef = ref(storage, `reviews/${reviewId}/${fileName}`);
const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on('state_changed',
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    // Update progress
  },
  (error) => {
    // Handle error
  },
  async () => {
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    // Use downloadURL
  }
);
```

#### Delete File
```typescript
const storageRef = ref(storage, filePath);
await deleteObject(storageRef);
```

## 🔒 Security Implementation

### Firestore Security Rules

Rules are defined in `firestore.rules`:

1. **User Data Isolation**
   - Users can only read/write their own data
   - Admins can access all user data

2. **Task Access**
   - All authenticated users can read tasks
   - Only admins can create/update/delete tasks

3. **Review Protection**
   - Users can create reviews (write-only)
   - Users can read their own reviews
   - Only admins can update reviews (approve/reject)

4. **KYC Protection**
   - Users can create their own KYC requests
   - Only admins can update KYC status

5. **Withdrawal Protection**
   - Users can create withdrawal requests
   - Only admins can process withdrawals

### Storage Security

Storage rules (configured in Firebase Console):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reviews/{reviewId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
    match /kyc/{userId}/{fileName} {
      allow read: if request.auth != null 
                  && (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

### Authentication Security

- Password requirements enforced by Firebase
- Phone verification via OTP
- Session management handled by Firebase Auth
- Token refresh automatic

## ⚡ Performance Optimization

### Code Splitting

Components are loaded on-demand:

```typescript
const LazyComponent = React.lazy(() => import('./Component'));
```

### Image Optimization

- Lazy loading for images
- Compress images before upload
- Use appropriate image formats (WebP when possible)

### Firestore Optimization

1. **Indexes**: Deploy required indexes for complex queries
2. **Pagination**: Use pagination for large collections
3. **Selective Fields**: Only fetch required fields
4. **Caching**: Use Firestore cache for offline support

### React Optimization

1. **Memoization**: Use `React.memo` for expensive components
2. **useMemo**: Memoize expensive calculations
3. **useCallback**: Memoize callback functions
4. **Virtual Scrolling**: For long lists (future implementation)

## 🛡️ Error Handling

### Service-Level Error Handling

```typescript
try {
  const result = await firebaseOperation();
  return result;
} catch (error: any) {
  console.error('Operation failed:', error);
  
  // User-friendly error messages
  if (error.code === 'permission-denied') {
    throw new Error('You do not have permission to perform this action');
  } else if (error.code === 'not-found') {
    throw new Error('Resource not found');
  } else {
    throw new Error('An error occurred. Please try again.');
  }
}
```

### Component-Level Error Handling

```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await serviceOperation();
  } catch (err: any) {
    setError(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Error Boundaries

Use React Error Boundaries for component tree errors:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 🧪 Testing Strategy

### Unit Tests

Test individual services and utilities:

```typescript
describe('authService', () => {
  it('should sign up user with email', async () => {
    const user = await signUpWithEmail('test@example.com', 'password', 'Test User');
    expect(user).toBeDefined();
  });
});
```

### Integration Tests

Test service interactions:

```typescript
describe('Review Flow', () => {
  it('should submit review and update earnings', async () => {
    // Create task
    // Submit review
    // Approve review
    // Check earnings updated
  });
});
```

### Component Tests

Test React components:

```typescript
describe('HomeScreen', () => {
  it('should display tasks', () => {
    render(<HomeScreen onNavigate={jest.fn()} />);
    // Assertions
  });
});
```

### E2E Tests

Test complete user flows (future implementation).

## 📊 Data Flow

### Review Submission Flow

```
User submits review
  ↓
SubmitReviewScreen
  ↓
uploadReviewImages() → Firebase Storage
  ↓
submitReview() → Firestore (reviews collection)
  ↓
Cloud Function triggered (onCreate)
  ↓
Admin approves via Cloud Function
  ↓
updateUserEarnings() → Firestore (users collection)
  ↓
WalletScreen updates (real-time listener)
```

### Withdrawal Flow

```
User requests withdrawal
  ↓
WithdrawScreen
  ↓
requestWithdrawal() → Firestore (withdrawals collection)
  ↓
Cloud Function validates KYC status
  ↓
Admin approves via Cloud Function
  ↓
deductBalance() → Firestore (users collection)
  ↓
updateWithdrawalStatus() → Firestore (withdrawals collection)
```

## 🔧 Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript
- Firebase
- React snippets

### Debugging

1. **React DevTools**: Component inspection
2. **Redux DevTools**: State inspection (if using Redux)
3. **Firebase Console**: Backend debugging
4. **Browser DevTools**: Network and console

### Logging

Use structured logging:

```typescript
console.log('[ServiceName]', 'Operation:', data);
console.error('[ServiceName]', 'Error:', error);
```

Remove console logs in production builds.

---

**Last Updated**: 2024

