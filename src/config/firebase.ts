// Firebase Configuration
// Replace these values with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAJKRmTazJPcJglONkHjckTG_6kKzxoqUQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tournament-app-42bf9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tournament-app-42bf9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tournament-app-42bf9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "401788002919",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:401788002919:web:19bfd01cae0b75ed7ceac2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize reCAPTCHA verifier for phone authentication
export const initializeRecaptcha = () => {
  if (typeof window === 'undefined') {
    throw new Error('reCAPTCHA can only be initialized in browser environment');
  }

  // Clean up existing verifier if it exists
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      // Ignore cleanup errors
      console.warn('Error clearing reCAPTCHA verifier:', e);
    }
    window.recaptchaVerifier = undefined;
  }

  // Ensure container exists
  let container = document.getElementById('recaptcha-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'recaptcha-container';
    container.style.display = 'none';
    container.style.position = 'fixed';
    container.style.top = '-9999px';
    document.body.appendChild(container);
  }

  // Create new verifier
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
        console.log('reCAPTCHA verified successfully');
      },
      'expired-callback': () => {
        // reCAPTCHA expired
        console.log('reCAPTCHA expired');
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {
            // Ignore cleanup errors
          }
          window.recaptchaVerifier = undefined;
        }
      },
    });
  } catch (error: any) {
    console.error('Error creating reCAPTCHA verifier:', error);
    throw new Error('Failed to initialize reCAPTCHA: ' + error.message);
  }

  return window.recaptchaVerifier;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default app;

