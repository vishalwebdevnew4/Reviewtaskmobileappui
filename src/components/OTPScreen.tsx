import { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft } from 'lucide-react';

interface OTPScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function OTPScreen({ onNavigate }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

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
          Enter the 6-digit code sent to<br />
          +91 98765 43210
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
              className="w-full h-14 bg-[#F6F6F9] rounded-[16px] text-center text-[#111111] outline-none focus:ring-2 focus:ring-[#6B4BFF] transition-all"
            />
          ))}
        </div>

        <Button 
          fullWidth 
          onClick={() => onNavigate('home')}
        >
          Verify & Continue
        </Button>

        <div className="text-center mt-6">
          <span className="text-[#666666]">Didn't receive code? </span>
          <button className="text-[#6B4BFF]">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
