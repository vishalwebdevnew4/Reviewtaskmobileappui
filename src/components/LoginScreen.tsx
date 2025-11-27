import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Smartphone, Mail } from 'lucide-react';
import { sendOTP, signInWithEmail, signInWithGoogle } from '../services/authService';
import { toast } from 'sonner';

interface LoginScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');
  const [loading, setLoading] = useState(false);
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);

  // Ensure reCAPTCHA container exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'none';
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        document.body.appendChild(container);
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handlePhoneLogin = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const confirmationResult = await sendOTP(phoneNumber);
      onNavigate('otp', { confirmationResult, phoneNumber });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send OTP';
      
      // If phone auth is not enabled, show detailed help
      if (errorMessage.includes('not enabled') || error.code === 'auth/operation-not-allowed') {
        toast.error('Phone Auth Not Enabled', {
          description: 'Enable it in Firebase Console. Click "Login with Email instead" below to continue.',
          duration: 8000,
          action: {
            label: 'Open Firebase Console',
            onClick: () => {
              window.open(
                'https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers',
                '_blank'
              );
            },
          },
        });
        
        // Phone auth not available, but email is already shown
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success('Login successful!');
      onNavigate('home');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Login successful!');
      onNavigate('home');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign in with Google';
      
      // Show detailed help for operation-not-allowed error
      if (error.code === 'auth/operation-not-allowed' || errorMessage.includes('not enabled')) {
        toast.error('Google Sign-In Not Enabled', {
          description: errorMessage,
          duration: 10000,
          action: {
            label: 'Open Firebase Console',
            onClick: () => {
              window.open(
                'https://console.firebase.google.com/project/tournament-app-42bf9/authentication/providers',
                '_blank'
              );
            },
          },
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* reCAPTCHA container (hidden, will be created dynamically if needed) */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>

      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="w-16 h-16 bg-[#6B4BFF] rounded-[20px] flex items-center justify-center mb-6">
          <span className="text-white text-2xl">RT</span>
        </div>
        <h1 className="text-[#111111] mb-2">Welcome Back!</h1>
        <p className="text-[#666666]">Login to start earning money</p>
      </div>

      {/* Email Login - Primary Method */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-[#111111] mb-2">Email</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <Mail className="w-5 h-5 text-[#666666]" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && email && password) {
                  handleEmailLogin();
                }
              }}
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#111111] mb-2">Password</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && email && password) {
                  handleEmailLogin();
                }
              }}
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={handleEmailLogin}
          disabled={loading || !email || !password}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {/* Phone Login Option (Collapsible) */}
        {!showPhoneLogin ? (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowPhoneLogin(true)}
              className="text-sm text-[#6B4BFF]"
            >
              Login with Phone OTP instead
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#111111]">Phone OTP Login</span>
              <button
                onClick={() => setShowPhoneLogin(false)}
                className="text-xs text-[#666666]"
              >
                Hide
              </button>
        </div>

            <div>
              <label className="block text-[#111111] mb-2 text-sm">Phone Number</label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <Smartphone className="w-5 h-5 text-[#666666]" />
                <span className="text-[#666666] font-medium">+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-transparent outline-none text-[#111111]"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-[#666666] mt-2">
                📱 OTP will be sent via SMS (requires Firebase upgrade)
              </p>
            </div>

            <Button 
              fullWidth 
              onClick={handlePhoneLogin}
              disabled={loading || phoneNumber.length !== 10}
              size="sm"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </div>
        )}
      </div>

      {/* Sign Up Link */}
      <div className="pb-8 text-center">
        <span className="text-[#666666]">Don't have an account? </span>
        <button 
          onClick={() => onNavigate('signup')}
          className="text-[#6B4BFF]"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
