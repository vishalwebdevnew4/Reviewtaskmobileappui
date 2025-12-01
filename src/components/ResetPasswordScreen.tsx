import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { userQueries } from '../db/queries';
import { useAuth } from '../contexts/AuthContext';

interface ResetPasswordScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  resetToken?: string;
  userId?: number;
  email?: string;
}

export function ResetPasswordScreen({ onNavigate, onBack, resetToken, userId, email }: ResetPasswordScreenProps) {
  const { refreshUser } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // If userId is provided (from OTP flow), skip token validation
    if (userId) {
      setTokenValid(true);
      return;
    }
    
    // Validate token on mount (legacy token flow)
    if (resetToken) {
      validateToken();
    } else {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    }
  }, [resetToken, userId]);

  const validateToken = async () => {
    try {
      const db = (await import('../db/database')).getDatabase();
      const result = db.exec(
        `SELECT id, password_reset_expires FROM users WHERE password_reset_token = '${resetToken?.replace(/'/g, "''")}'`
      );

      if (result.length === 0 || result[0].values.length === 0) {
        setTokenValid(false);
        setError('Invalid or expired reset token');
        return;
      }

      const user = result[0].values[0];
      const expires = user[1] as number;

      if (Date.now() > expires) {
        setTokenValid(false);
        setError('Reset token has expired. Please request a new one.');
        return;
      }

      setTokenValid(true);
    } catch (err) {
      setTokenValid(false);
      setError('Failed to validate reset token');
    }
  };

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let targetUserId = userId;

      // If userId not provided, try to get from token (legacy support)
      if (!targetUserId && resetToken) {
        const db = (await import('../db/database')).getDatabase();
        const result = db.exec(
          `SELECT id FROM users WHERE password_reset_token = '${resetToken.replace(/'/g, "''")}'`
        );

        if (result.length === 0 || result[0].values.length === 0) {
          setError('Invalid reset token');
          setLoading(false);
          return;
        }

        targetUserId = result[0].values[0][0] as number;
      }

      if (!targetUserId) {
        setError('Invalid reset session. Please request a new password reset.');
        setLoading(false);
        return;
      }

      // Use OTP-based reset function
      const { resetPasswordWithOTP } = await import('../services/auth');
      const result = await resetPasswordWithOTP(targetUserId, password);

      if (!result.success) {
        setError(result.error || 'Failed to reset password');
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Navigate to login after 2 seconds
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="h-full flex flex-col bg-white px-6 items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#666666] mt-4">Validating reset token...</p>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="h-full flex flex-col bg-white px-6">
        <div className="pt-8 pb-6">
          <button onClick={onBack} className="mb-6">
            <ArrowLeft className="w-6 h-6 text-[#111111]" />
          </button>
          <h1 className="text-[#111111] mb-2">Invalid Reset Link</h1>
          <p className="text-[#666666]">
            This password reset link is invalid or has expired.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <Button 
            fullWidth 
            onClick={() => onNavigate('forgotPassword')}
          >
            Request New Reset Link
          </Button>
          <div className="text-center mt-4">
            <button
              onClick={onBack}
              className="text-sm text-[#666666] hover:text-[#111111]"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-8 pb-6">
        <button onClick={onBack} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Reset Password</h1>
        <p className="text-[#666666]">
          Enter your new password below.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px]">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[12px]">
          <p className="text-green-600 text-sm">
            ✓ Password reset successfully! Redirecting to login...
          </p>
        </div>
      )}

      {/* Form */}
      {!success ? (
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-[#111111] mb-2">New Password</label>
            <div className="relative flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <Lock className="w-5 h-5 text-[#666666]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password (min 6 characters)"
                className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999] pr-10"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#666666] hover:text-[#111111]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[#111111] mb-2">Confirm New Password</label>
            <div className="relative flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <Lock className="w-5 h-5 text-[#666666]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            fullWidth 
            onClick={handleSubmit}
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-[#111111] mb-2">Password Reset Successful!</p>
            <p className="text-[#666666] text-sm">
              You can now login with your new password.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

