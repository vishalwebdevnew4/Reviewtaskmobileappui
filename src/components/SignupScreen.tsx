import { useState, useEffect } from 'react';
import { Button } from './Button';
import { User, Smartphone, Mail } from 'lucide-react';
import { sendOTP, signUpWithEmail, signInWithGoogle } from '../services/authService';
import { toast } from 'sonner';

interface SignupScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email'>('email');
  const [loading, setLoading] = useState(false);
  const [showPhoneSignup, setShowPhoneSignup] = useState(false);

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

  const handlePhoneSignup = async () => {
    if (!fullName || !phoneNumber || phoneNumber.length !== 10) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setLoading(true);
    try {
      const confirmationResult = await sendOTP(phoneNumber);
      onNavigate('otp', { confirmationResult, phoneNumber, fullName, isSignup: true });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send OTP';
      
      // If phone auth is not enabled, show detailed help
      if (errorMessage.includes('not enabled') || error.code === 'auth/operation-not-allowed') {
        toast.error('Phone Auth Not Enabled', {
          description: 'Enable it in Firebase Console. Click "Sign up with Email instead" below to continue.',
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

  const handleEmailSignup = async () => {
    if (!fullName || !email || !password || password.length < 6) {
      toast.error('Please fill all fields. Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, fullName);
      toast.success('Account created successfully!');
      onNavigate('home');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      onNavigate('home');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sign up with Google';
      
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
        <h1 className="text-[#111111] mb-2">Create Account</h1>
        <p className="text-[#666666]">Start your earning journey today</p>
      </div>

      {/* Email Signup - Primary Method */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-[#111111] mb-2">Full Name</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <User className="w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && fullName && email && password) {
                  handleEmailSignup();
                }
              }}
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

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
                if (e.key === 'Enter' && fullName && email && password) {
                  handleEmailSignup();
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
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && fullName && email && password) {
                  handleEmailSignup();
                }
              }}
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={handleEmailSignup}
          disabled={loading || !fullName || !email || !password || password.length < 6}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        {/* Phone Signup Option (Collapsible) */}
        {!showPhoneSignup ? (
          <div className="text-center">
            <button
              onClick={() => setShowPhoneSignup(true)}
              className="text-sm text-[#6B4BFF]"
            >
              Sign up with Phone OTP instead
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#111111]">Phone OTP Signup</span>
              <button
                onClick={() => setShowPhoneSignup(false)}
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
              onClick={handlePhoneSignup}
              disabled={loading || !fullName || phoneNumber.length !== 10}
              size="sm"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </div>
        )}

        <p className="text-xs text-[#666666] text-center px-4">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>

      {/* Login Link */}
      <div className="pb-8 text-center">
        <span className="text-[#666666]">Already have an account? </span>
        <button 
          onClick={() => onNavigate('login')}
          className="text-[#6B4BFF]"
        >
          Login
        </button>
      </div>
    </div>
  );
}
