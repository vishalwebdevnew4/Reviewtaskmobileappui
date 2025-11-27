import { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';
import { verifyOTP, sendOTP, ConfirmationResult } from '../services/authService';
import { toast } from 'sonner';

interface OTPScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  confirmationResult?: ConfirmationResult;
  phoneNumber?: string;
  isSignup?: boolean;
  fullName?: string;
}

export function OTPScreen({ onNavigate, confirmationResult, phoneNumber, isSignup, fullName }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | undefined>(confirmationResult);

  useEffect(() => {
    setConfirmation(confirmationResult);
  }, [confirmationResult]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-verify when all 6 digits are entered
      if (newOtp.every(d => d !== '') && newOtp.length === 6) {
        handleVerify(newOtp.join(''));
      }
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    if (!confirmation) {
      toast.error('OTP session expired. Please request a new OTP.');
      onNavigate('login');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOTP(confirmation, otpCode);
      
      // If signup, update user profile with name
      if (isSignup && fullName && user) {
        const { updateUserProfile } = await import('../services/authService');
        await updateUserProfile(user.uid, { displayName: fullName });
      }
      
      toast.success('Verification successful!');
      onNavigate('home');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP code');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) {
      toast.error('Phone number not found');
      return;
    }

    setResendLoading(true);
    try {
      // Clean up old confirmation
      setConfirmation(undefined);
      
      // Clean up reCAPTCHA verifier before resending
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      const newConfirmation = await sendOTP(phoneNumber);
      setConfirmation(newConfirmation);
      toast.success('OTP resent successfully!');
      setOtp(['', '', '', '', '', '']);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-8 pb-8">
        <button 
          onClick={() => onNavigate('login')}
          className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Verify OTP</h1>
        <p className="text-[#666666]">
          Enter the 6-digit code sent via SMS to<br />
          <span className="font-semibold text-[#111111]">
            {phoneNumber ? `+91 ${phoneNumber}` : '+91 XXXXX XXXXX'}
          </span>
        </p>
        <p className="text-xs text-[#666666] mt-2">
          📱 Check your SMS messages for the verification code
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex-1">
        <div className="flex gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-full h-14 bg-[#F6F6F9] rounded-[16px] text-center text-[#111111] outline-none focus:ring-2 focus:ring-[#6B4BFF] transition-all text-xl font-semibold"
            />
          ))}
        </div>

        <Button 
          fullWidth 
          onClick={() => handleVerify()}
          disabled={loading || otp.some(d => !d)}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>

        <div className="text-center mt-6">
          <span className="text-[#666666]">Didn't receive code? </span>
          <button 
            className="text-[#6B4BFF]"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading ? 'Sending...' : 'Resend'}
          </button>
        </div>
      </div>
    </div>
  );
}
