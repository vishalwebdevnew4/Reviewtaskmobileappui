import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from './Button';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(email, password, name);
    
    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.error || 'Sign up failed');
    }
    
    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        // Create a mock Google user object
        const googleUser = {
          getBasicProfile: () => ({
            getEmail: () => userInfo.email,
            getName: () => userInfo.name,
            getId: () => userInfo.sub,
            getImageUrl: () => userInfo.picture,
          }),
        };

        const result = await loginWithGoogle(googleUser);
        
        if (result.success) {
          onNavigate('home');
        } else {
          setError(result.error || 'Google sign up failed');
        }
      } catch (err: any) {
        setError('Google sign up failed. Please try again.');
      }
    },
    onError: () => {
      setError('Google sign up failed. Please try again.');
    },
  });

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="w-16 h-16 bg-[#6B4BFF] rounded-[20px] flex items-center justify-center mb-6">
          <span className="text-white text-2xl">RT</span>
        </div>
        <h1 className="text-[#111111] mb-2">Create Account</h1>
        <p className="text-[#666666]">Start your earning journey today</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px]">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        <div>
          <label className="block text-[#111111] mb-2">Full Name *</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <User className="w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Enter your name"
              className="flex-1 bg-transparent outline-none text-[#111111]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[#111111] mb-2">Email *</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <Mail className="w-5 h-5 text-[#666666]" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-[#111111]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-form-type="other"
                onKeyDown={(e) => {
                  // Prevent autofill on backspace/delete
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.stopPropagation();
                  }
                }}
              />
          </div>
        </div>

        <div>
          <label className="block text-[#111111] mb-2">Password *</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <Lock className="w-5 h-5 text-[#666666]" />
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              className="flex-1 bg-transparent outline-none text-[#111111]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[#111111] mb-2">Confirm Password *</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <Lock className="w-5 h-5 text-[#666666]" />
            <input
              type="password"
              placeholder="Confirm your password"
              className="flex-1 bg-transparent outline-none text-[#111111]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSignup()}
            />
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <p className="text-xs text-[#666666] text-center px-4">
          By signing up, you agree to our Terms & Privacy Policy
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[#666666] text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Sign Up */}
        <button 
          onClick={() => googleLogin()}
          className="w-full bg-white border-2 border-gray-200 rounded-[16px] px-6 py-4 flex items-center justify-center gap-3 hover:border-[#6B4BFF] transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#111111]">Continue with Google</span>
        </button>
      </div>

      {/* Login Link */}
      <div className="pb-8 text-center pt-4">
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
