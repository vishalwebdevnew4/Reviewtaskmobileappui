import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Key } from 'lucide-react';
import { Button } from './Button';
import { verifyPasswordResetOTP } from '../services/auth';

interface ResetPasswordOTPScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  email: string;
}

export function ResetPasswordOTPScreen({ onNavigate, onBack, email }: ResetPasswordOTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isPastingRef = useRef(false);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    console.log('🔵 handleOtpChange:', { index, value, isPasting: isPastingRef.current, currentOtp: otp });
    
    // Ignore onChange if we're in the middle of a paste operation
    if (isPastingRef.current) {
      console.log('⏸️ Ignoring onChange - paste in progress');
      return;
    }
    
    // Ignore if value is empty (handled by backspace)
    if (value === '') {
      console.log('🔙 Clearing digit at index:', index);
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }
    
    // Handle single digit input
    if (value.length === 1 && /^\d$/.test(value)) {
      console.log('✅ Valid single digit input:', value);
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');
      
      // Auto-focus next input
      if (index < 5) {
        setTimeout(() => {
          console.log('➡️ Auto-focusing next input:', index + 1);
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
      
      // Auto-submit when all 6 digits are entered
      const updatedOtp = [...newOtp];
      if (updatedOtp.every(d => d !== '') && updatedOtp.length === 6) {
        console.log('🎯 All digits entered, auto-verifying:', updatedOtp.join(''));
        setTimeout(() => {
          handleVerifyWithOTP(updatedOtp.join(''));
        }, 150);
      }
    } else {
      console.log('⚠️ Invalid input:', { value, length: value.length, isDigit: /^\d$/.test(value) });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('⌨️ KeyDown:', { index, key: e.key, currentValue: otp[index] });
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      console.log('🔙 Backspace on empty field, moving to previous');
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    console.log('📋 Paste event triggered');
    e.preventDefault();
    e.stopPropagation();
    
    // Set flag to prevent onChange from interfering
    isPastingRef.current = true;
    console.log('🔒 Paste flag set to true');
    
    const pastedData = e.clipboardData.getData('text').trim().replace(/\s/g, '');
    console.log('📥 Pasted data:', pastedData);
    
    // Extract only digits
    const digits = pastedData.split('').filter(d => /^\d$/.test(d)).slice(0, 6);
    console.log('🔢 Extracted digits:', digits, 'Length:', digits.length);
    
    if (digits.length === 6) {
      console.log('✅ Full 6-digit paste detected');
      // Fill all 6 inputs with pasted digits
      const newOtp = [...digits];
      console.log('💾 Setting OTP state:', newOtp);
      setOtp(newOtp);
      setError('');
      
      // Update all input values directly and immediately
      newOtp.forEach((digit, idx) => {
        if (inputRefs.current[idx]) {
          console.log(`✏️ Setting input[${idx}] value to:`, digit);
          inputRefs.current[idx]!.value = digit;
        }
      });
      
      // Clear the paste flag after a short delay
      setTimeout(() => {
        isPastingRef.current = false;
        console.log('🔓 Paste flag cleared');
        
        // Focus last input
        inputRefs.current[5]?.focus();
        console.log('👁️ Focused last input');
        
        // Auto-verify after ensuring state is set
        setTimeout(() => {
          console.log('🚀 Auto-verifying with OTP:', digits.join(''));
          handleVerifyWithOTP(digits.join(''));
        }, 100);
      }, 50);
    } else if (digits.length > 0) {
      console.log('⚠️ Partial paste detected:', digits.length, 'digits');
      // Partial paste - fill what we can starting from current index
      const targetIndex = parseInt((e.currentTarget as HTMLInputElement).id.replace('otp-', '')) || 0;
      console.log('📍 Target index:', targetIndex);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        const pos = targetIndex + i;
        if (pos < 6) {
          newOtp[pos] = digit;
          // Update input value directly
          if (inputRefs.current[pos]) {
            inputRefs.current[pos]!.value = digit;
          }
        }
      });
      console.log('💾 Setting partial OTP state:', newOtp);
      setOtp(newOtp);
      setError('');
      
      setTimeout(() => {
        isPastingRef.current = false;
        console.log('🔓 Paste flag cleared (partial)');
        const nextIndex = Math.min(targetIndex + digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      }, 50);
    } else {
      console.log('❌ No valid digits found in paste');
      // No valid digits, clear flag immediately
      isPastingRef.current = false;
    }
  };

  const handleVerifyWithOTP = async (otpString: string) => {
    console.log('🔍 handleVerifyWithOTP called with:', otpString, 'Length:', otpString.length);
    console.log('📊 Current OTP state:', otp);
    
    if (otpString.length !== 6) {
      console.log('❌ OTP length invalid:', otpString.length);
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    // Don't verify if already loading
    if (loading) {
      console.log('⏸️ Already verifying, skipping');
      return;
    }

    console.log('🔄 Starting verification...');
    setLoading(true);
    setError('');

    try {
      console.log('📧 Verifying OTP for email:', email);
      const result = await verifyPasswordResetOTP(email, otpString);
      console.log('📥 Verification result:', result);
      
      if (result.success && result.userId) {
        console.log('✅ OTP verified successfully, userId:', result.userId);
        // Navigate to reset password screen with userId
        onNavigate('resetPassword', { userId: result.userId, email });
      } else {
        console.log('❌ OTP verification failed:', result.error);
        setError(result.error || 'Invalid OTP. Please try again.');
        // Don't clear OTP on error - let user see what they entered
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 0);
      }
    } catch (err: any) {
      console.error('💥 Verification error:', err);
      setError(err.message || 'Failed to verify OTP. Please try again.');
      // Don't clear OTP on error - let user see what they entered
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    } finally {
      console.log('🏁 Verification complete');
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    await handleVerifyWithOTP(otpString);

    setLoading(true);
    setError('');

    try {
      const result = await verifyPasswordResetOTP(email, otpString);
      
      if (result.success && result.userId) {
        // Navigate to reset password screen with userId
        onNavigate('resetPassword', { userId: result.userId, email });
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(60); // 60 second cooldown
    setError('');
    
    try {
      const { requestPasswordResetOTP } = await import('../services/auth');
      const result = await requestPasswordResetOTP(email);
      
      if (result.success) {
        // Show success message briefly
        setError('');
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-8 pb-6">
        <button onClick={onBack} className="mb-6">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Enter OTP</h1>
        <p className="text-[#666666]">
          We've sent a 6-digit code to<br />
          <strong>{email}</strong>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[12px]">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex-1">
        <div className="flex gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const value = e.target.value;
                console.log('📝 Input onChange:', { index, value, length: value.length, isPasting: isPastingRef.current });
                // Ignore multi-character input (paste is handled separately)
                if (value.length <= 1) {
                  handleOtpChange(index, value);
                } else {
                  console.log('⚠️ Multi-character input ignored (paste should handle this)');
                }
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-full h-14 bg-[#F6F6F9] rounded-[16px] text-center text-[#111111] text-xl font-semibold outline-none focus:ring-2 focus:ring-[#6B4BFF] transition-all"
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <Button 
          fullWidth 
          onClick={handleVerify}
          disabled={loading || otp.some(d => d === '')}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="text-center mt-6">
          <span className="text-[#666666]">Didn't receive code? </span>
          {resendCooldown > 0 ? (
            <span className="text-[#999999]">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button 
              onClick={handleResend}
              className="text-[#6B4BFF] hover:underline"
              disabled={loading}
            >
              Resend OTP
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="text-sm text-[#666666] hover:text-[#111111]"
          >
            Back to Forgot Password
          </button>
        </div>
      </div>
    </div>
  );
}

