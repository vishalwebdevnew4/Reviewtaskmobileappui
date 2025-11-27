// Authentication Service
// Handles email and phone OTP authentication
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, initializeRecaptcha } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin' | 'company';
  earnings: number;
  totalEarnings: number;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
}

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName || user.displayName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      earnings: 0,
      totalEarnings: 0,
      kycStatus: 'not_submitted',
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  try {
    // Ensure container exists before initializing
    if (typeof window !== 'undefined') {
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      }
    }

    const appVerifier = initializeRecaptcha();
    if (!appVerifier) {
      throw new Error('Failed to initialize reCAPTCHA');
    }

    // Format phone number with country code
    // Ensure phone number starts with + and country code
    let formattedPhone = phoneNumber.trim();
    
    // If phone doesn't start with +, add +91 (India) as default
    if (!formattedPhone.startsWith('+')) {
      // Remove any leading zeros or spaces
      formattedPhone = formattedPhone.replace(/^0+/, '');
      formattedPhone = `+91${formattedPhone}`;
    }
    
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formattedPhone)) {
      throw new Error('Invalid phone number format. Please include country code (e.g., +91 for India)');
    }
    
    console.log('Sending OTP to:', formattedPhone);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    console.log('OTP sent successfully');
    return confirmationResult;
  } catch (error: any) {
    // Clean up on error
    if (typeof window !== 'undefined' && window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        // Ignore cleanup errors
      }
      window.recaptchaVerifier = undefined;
    }
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to send OTP';
    if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Phone authentication is not enabled. Please contact support or use email login.';
    } else if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number. Please enter a valid 10-digit number.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please contact support.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> => {
  try {
    const userCredential = await confirmationResult.confirm(code);
    const user = userCredential.user;

    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        phoneNumber: user.phoneNumber || '',
        displayName: user.displayName || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        earnings: 0,
        totalEarnings: 0,
        kycStatus: 'not_submitted',
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Invalid OTP code');
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Reset password via email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    // Request additional scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists, create if not
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        earnings: 0,
        totalEarnings: 0,
        kycStatus: 'not_submitted',
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
    } else {
      // Update existing profile with Google info if needed
      const existingData = userDoc.data();
      if (!existingData.displayName && user.displayName) {
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          photoURL: user.photoURL || existingData.photoURL,
          updatedAt: new Date(),
        });
      }
    }

    return user;
  } catch (error: any) {
    // Provide detailed error messages for common issues
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Google Sign-In is not enabled. Please enable it in Firebase Console: ' +
        'Authentication > Sign-in method > Google > Enable > Save. ' +
        'Also verify OAuth consent screen in Google Cloud Console.'
      );
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups and try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized. Please add it in Firebase Console: Authentication > Settings > Authorized domains.');
    }
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

