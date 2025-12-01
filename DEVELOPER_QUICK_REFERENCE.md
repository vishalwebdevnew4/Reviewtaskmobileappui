# Developer Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy Firebase rules
firebase deploy --only firestore:rules

# Deploy Firebase indexes
firebase deploy --only firestore:indexes

# Deploy Cloud Functions
firebase deploy --only functions

# Sync Capacitor
npx cap sync

# Open Android Studio
npx cap open android
```

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app component with routing |
| `src/main.tsx` | Application entry point |
| `src/contexts/AuthContext.tsx` | Authentication state management |
| `src/services/*.ts` | Business logic services |
| `src/config/firebase.ts` | Firebase configuration |
| `firestore.rules` | Database security rules |
| `firestore.indexes.json` | Database indexes |
| `capacitor.config.ts` | Mobile app configuration |
| `.env` | Environment variables |

## 🔑 Environment Variables

Required variables in `.env`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 🎯 Common Tasks

### Add a New Screen

1. Create component in `src/components/`
2. Add import in `src/App.tsx`
3. Add route in `App.tsx` navigation logic
4. Add to screens array for dev navigation

```typescript
// In App.tsx
import { NewScreen } from './components/NewScreen';

// Add to screens array
{ id: 'newScreen', name: 'X. New Screen' }

// Add route
{currentScreen === 'newScreen' && <NewScreen onNavigate={navigateTo} />}
```

### Add a New Service Method

1. Open relevant service file in `src/services/`
2. Add method following existing patterns
3. Export method
4. Use in components

```typescript
// In service file
export async function newMethod(params: ParamsType): Promise<ReturnType> {
  try {
    // Implementation
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Add a New Firestore Collection

1. Add collection to Firestore
2. Update `firestore.rules` with security rules
3. Add indexes to `firestore.indexes.json` if needed
4. Deploy rules and indexes

### Add a New Cloud Function

1. Add function in `functions/src/index.ts`
2. Build functions: `cd functions && npm run build`
3. Deploy: `firebase deploy --only functions`

## 🔍 Debugging Tips

### Check Firebase Connection
```typescript
import { db } from './config/firebase';
console.log('Firestore:', db);
```

### Check Auth State
```typescript
const { user, loading } = useAuth();
console.log('User:', user, 'Loading:', loading);
```

### Monitor Firestore Queries
```typescript
const unsubscribe = onSnapshot(queryRef, (snapshot) => {
  console.log('Data:', snapshot.docs.map(doc => doc.data()));
});
```

### Check Storage Upload
```typescript
uploadTask.on('state_changed',
  (snapshot) => {
    console.log('Progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  }
);
```

## 🐛 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Permission denied` | Check Firestore rules, ensure user is authenticated |
| `Index not found` | Deploy indexes: `firebase deploy --only firestore:indexes` |
| `reCAPTCHA error` | Ensure reCAPTCHA container exists, check Firebase Console config |
| `Storage upload failed` | Check file size (max 10MB), verify Storage rules |
| `TypeScript errors` | Run `npm run build` to see detailed errors |
| `Capacitor sync failed` | Check `capacitor.config.ts`, ensure `build` directory exists |

## 📝 Code Snippets

### Create Firestore Document
```typescript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const docRef = await addDoc(collection(db, 'collectionName'), {
  field1: 'value1',
  field2: 'value2',
  createdAt: serverTimestamp()
});
```

### Read Firestore Document
```typescript
import { doc, getDoc } from 'firebase/firestore';

const docRef = doc(db, 'collectionName', 'documentId');
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log(docSnap.data());
}
```

### Update Firestore Document
```typescript
import { doc, updateDoc } from 'firebase/firestore';

const docRef = doc(db, 'collectionName', 'documentId');
await updateDoc(docRef, {
  field: 'newValue',
  updatedAt: serverTimestamp()
});
```

### Query Firestore Collection
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

const q = query(
  collection(db, 'collectionName'),
  where('field', '==', 'value')
);
const snapshot = await getDocs(q);
const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Upload to Storage
```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config/firebase';

const storageRef = ref(storage, `path/to/file.jpg`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);
```

### Real-time Listener
```typescript
import { onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setState(data);
  });

  return () => unsubscribe();
}, []);
```

## 🎨 Component Patterns

### Screen Component Template
```typescript
import React, { useState, useEffect } from 'react';

interface ScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Screen({ onNavigate }: ScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    try {
      // Action
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Form Component Template
```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  field1: string;
  field2: number;
}

export function FormComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('field1', { required: true })} />
      {errors.field1 && <span>Required</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔐 Security Checklist

- [ ] Firestore rules deployed
- [ ] Storage rules configured
- [ ] Environment variables secured
- [ ] Admin routes protected
- [ ] User data isolated
- [ ] Input validation implemented
- [ ] File size limits enforced
- [ ] Error messages don't leak sensitive info

## 📦 Build Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Environment variables set
- [ ] Firebase rules deployed
- [ ] Firebase indexes deployed
- [ ] Cloud Functions deployed
- [ ] Build succeeds: `npm run build`
- [ ] Capacitor sync: `npx cap sync`
- [ ] Test on device/emulator

## 🚢 Deployment Checklist

### Web Deployment
- [ ] Build production: `npm run build`
- [ ] Test build locally
- [ ] Deploy to Firebase Hosting: `firebase deploy --only hosting`
- [ ] Verify deployment

### Mobile Deployment
- [ ] Build production: `npm run build`
- [ ] Sync Capacitor: `npx cap sync`
- [ ] Open in Android Studio: `npx cap open android`
- [ ] Update version in `android/app/build.gradle`
- [ ] Build signed APK/AAB
- [ ] Test on device
- [ ] Upload to Play Store

## 📚 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🔗 Internal Documentation

- [README.md](./README.md) - Main documentation
- [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) - Technical details
- [README_SETUP.md](./README_SETUP.md) - Setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature status
- [BUILD_APK.md](./BUILD_APK.md) - Mobile build guide

---

**Quick Tip**: Use the screen selector button (top-right in web dev mode) to quickly navigate between screens during development!

