import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from './Button';
import { userQueries } from '../db/queries';
import { emailService } from '../config/email';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function ForgotPasswordScreen({ onNavigate, onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const lastClearedValue = useRef<string>('');

  // Debug: Component mount
  useEffect(() => {
    console.log('🔵 ForgotPasswordScreen mounted');
    return () => {
      console.log('🔴 ForgotPasswordScreen unmounted');
    };
  }, []);

  // Debug: State changes
  useEffect(() => {
    console.log('📊 State updated:', { email, loading, error, success, isGoogleAccount });
  }, [email, loading, error, success, isGoogleAccount]);

  // Prevent autofill from refilling the field
  useEffect(() => {
    const input = emailInputRef.current;
    if (!input) {
      console.log('⚠️ Email input ref not available');
      return;
    }

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const targetValue = target.value;
      
      console.log('🔍 Autofill check:', { 
        targetValue, 
        targetValueLength: targetValue.length,
        emailState: email, 
        emailStateLength: email.length,
        lastCleared: lastClearedValue.current 
      });
      
      // Check if the value looks suspicious (too long, contains UI text, etc.)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isSuspicious = targetValue.length > 50 || 
                          targetValue.includes('Forgot Password') ||
                          targetValue.includes('Enter your email') ||
                          targetValue.includes('Send Reset Link') ||
                          targetValue.includes('Back to Login') ||
                          (!emailRegex.test(targetValue) && targetValue.length > 30);
      
      // Only clear if content is actually suspicious
      // Don't clear on normal typing (single character changes are normal)
      if (isSuspicious) {
        console.log('🚫 Suspicious content detected, clearing field', { 
          isSuspicious,
          targetLength: targetValue.length,
          emailLength: email.length
        });
        // Clear it again
        setTimeout(() => {
          if (target.value) {
            target.value = '';
            setEmail('');
            lastClearedValue.current = '';
            console.log('✅ Field cleared after suspicious content');
          }
        }, 0);
      } else {
        console.log('✅ Input looks normal, allowing');
      }
    };

    input.addEventListener('input', handleInput);
    return () => input.removeEventListener('input', handleInput);
  }, [email]);

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit called with email:', email);
    
    if (!email) {
      console.log('❌ Email is empty');
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      setError('Please enter a valid email address');
      return;
    }

    console.log('✅ Email validation passed');
    setLoading(true);
    setError('');
    setSuccess(false);
    setIsGoogleAccount(false);

    try {
      console.log('🔍 Checking if user exists in database...');
      // Check if user exists
      const user = userQueries.getUserByEmail(email);
      console.log('👤 User lookup result:', user ? {
        id: user.id,
        email: user.email,
        auth_provider: user.auth_provider
      } : 'User not found');
      
      if (!user) {
        console.log('🔒 User not found (security: showing success anyway)');
        // Don't reveal if user exists or not for security
        setSuccess(true);
        setLoading(false);
        return;
      }

      // Check if user has email/password auth (not Google OAuth)
      if (user.auth_provider === 'google') {
        console.log('🔵 Google account detected for:', email);
        setIsGoogleAccount(true);
        setError('This email is associated with a Google account. Please use Google login or contact support.');
        setLoading(false);
        return;
      }

      console.log('📧 Requesting OTP for password reset...');
      // Request OTP for password reset
      const { requestPasswordResetOTP } = await import('../services/auth');
      const result = await requestPasswordResetOTP(email);
      console.log('📥 OTP request result:', result);
      
      if (!result.success) {
        // Check if it's a backend connection error
        if (result.error?.includes('Email server is not running') || result.error?.includes('backend')) {
          console.error('❌ Backend connection error:', result.error);
          setError(result.error);
          setLoading(false);
          return;
        }
        // For other errors, still show success for security (don't reveal if email exists)
        console.warn('⚠️ OTP request failed (security: showing success anyway):', result.error);
      } else {
        console.log('✅ OTP request successful');
      }
      
      console.log('🧭 Navigating to OTP verification screen with email:', email);
      // Navigate to OTP verification screen
      onNavigate('resetPasswordOTP', { email });
    } catch (err: any) {
      console.error('💥 Password reset error:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      // Check if it's a network/backend error
      if (err.message?.includes('fetch') || err.message?.includes('Failed to fetch') || err.message?.includes('backend')) {
        console.error('❌ Network/backend error detected');
        setError('Email server is not running. Please start the backend server with: npm run email:server');
        setLoading(false);
        return;
      }
      // Still show success for security (don't reveal if email exists)
      console.log('🔒 Showing success for security (error hidden from user)');
      setSuccess(true);
    } finally {
      console.log('🏁 handleSubmit complete, setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-8 pb-6">
        <button onClick={onBack} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Forgot Password?</h1>
        <p className="text-[#666666]">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`mb-4 p-4 rounded-[12px] ${
          isGoogleAccount 
            ? 'bg-blue-50 border border-blue-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm mb-2 ${
            isGoogleAccount ? 'text-blue-700' : 'text-red-600'
          }`}>
            {error}
          </p>
          {isGoogleAccount && (
            <div className="mt-3 space-y-2">
              <button
                onClick={() => onNavigate('login')}
                className="w-full bg-[#6B4BFF] text-white py-2 px-4 rounded-[12px] text-sm font-medium hover:bg-[#5a3edb] transition-colors"
              >
                Go to Login
              </button>
              <p className="text-blue-600 text-xs text-center">
                Use the "Continue with Google" button on the login screen
              </p>
            </div>
          )}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
          <p className="text-green-600 text-sm mb-2">
            ✓ Password reset link sent!
          </p>
          <p className="text-green-600 text-xs">
            If an account exists with this email, you'll receive a password reset link. Please check your inbox and spam folder.
          </p>
        </div>
      )}

      {/* Form */}
      {!success && !isGoogleAccount ? (
        <div className="flex-1">
          <div className="mb-6">
            <label className="block text-[#111111] mb-2">Email</label>
            <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <Mail className="w-5 h-5 text-[#666666]" />
              <input
                ref={emailInputRef}
                type="text"
                inputMode="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                value={email}
                onChange={(e) => {
                  const newValue = e.target.value;
                  console.log('📝 Email input changed:', { 
                    oldValue: email, 
                    newValue, 
                    length: newValue.length 
                  });
                  
                  // Check for suspicious content (UI text, too long, etc.)
                  const isSuspicious = newValue.length > 100 || 
                                     newValue.includes('Forgot Password') ||
                                     newValue.includes('Enter your email') ||
                                     newValue.includes('Send Reset Link') ||
                                     newValue.includes('Back to Login') ||
                                     (newValue.length > 50 && !newValue.includes('@'));
                  
                  if (isSuspicious) {
                    console.log('🚫 Suspicious content detected in onChange, clearing');
                    e.target.value = '';
                    setEmail('');
                    lastClearedValue.current = '';
                    return;
                  }
                  
                  // Allow normal email input (up to 100 chars, can contain @, ., etc.)
                  if (newValue.length <= 100) {
                    setEmail(newValue);
                    setError('');
                    setIsGoogleAccount(false);
                    lastClearedValue.current = newValue;
                  } else {
                    console.log('⚠️ Input too long, truncating');
                    const truncated = newValue.substring(0, 100);
                    e.target.value = truncated;
                    setEmail(truncated);
                    lastClearedValue.current = truncated;
                  }
                }}
                onKeyPress={(e) => {
                  console.log('⌨️ Key pressed:', e.key);
                  if (e.key === 'Enter') {
                    console.log('⏎ Enter key pressed, submitting form');
                    handleSubmit();
                  }
                }}
                onKeyDown={(e) => {
                  // Prevent autofill on backspace/delete
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    console.log('🔙 Backspace/Delete pressed, clearing lastClearedValue');
                    lastClearedValue.current = '';
                    e.stopPropagation();
                  }
                }}
                onFocus={(e) => {
                  console.log('👁️ Email input focused');
                  // Select all text on focus to make it easy to clear
                  e.target.select();
                }}
                onPaste={(e) => {
                  const pastedData = e.clipboardData.getData('text').trim();
                  console.log('📋 Paste detected in email field:', pastedData);
                  
                  // Only allow paste if it looks like an email or is short (likely an email)
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const isLikelyEmail = emailRegex.test(pastedData) || (pastedData.length < 100 && pastedData.includes('@'));
                  
                  if (!isLikelyEmail) {
                    console.log('🚫 Rejecting paste - does not look like an email');
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  
                  // If it's a valid email, let it paste normally
                  console.log('✅ Allowing email paste');
                  // Don't prevent default - let the normal paste happen
                  e.stopPropagation();
                }}
                disabled={loading}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
              />
            </div>
          </div>

          <Button 
            fullWidth 
            onClick={() => {
              console.log('🔘 Send Reset Link button clicked');
              handleSubmit();
            }}
            disabled={loading || !email}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="text-center mt-6">
            <button
              onClick={onBack}
              className="text-sm text-[#666666] hover:text-[#111111]"
            >
              Back to Login
            </button>
          </div>
        </div>
      ) : isGoogleAccount ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <p className="text-[#111111] mb-2 font-medium">Google Account Detected</p>
            <p className="text-[#666666] text-sm mb-6">
              This email is linked to a Google account. Please use Google login to access your account.
            </p>
            <Button 
              fullWidth 
              onClick={() => onNavigate('login')}
            >
              Go to Login
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-[#111111] mb-2">Check your email</p>
            <p className="text-[#666666] text-sm mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Button 
              fullWidth 
              onClick={onBack}
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

