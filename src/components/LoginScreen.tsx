import { Button } from './Button';
import { Smartphone, Mail } from 'lucide-react';

interface LoginScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="w-16 h-16 bg-[#6B4BFF] rounded-[20px] flex items-center justify-center mb-6">
          <span className="text-white text-2xl">RT</span>
        </div>
        <h1 className="text-[#111111] mb-2">Welcome Back!</h1>
        <p className="text-[#666666]">Login to start earning money</p>
      </div>

      {/* Phone Input */}
      <div className="flex-1">
        <div className="mb-6">
          <label className="block text-[#111111] mb-2">Phone Number</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <Smartphone className="w-5 h-5 text-[#666666]" />
            <span className="text-[#666666]">+91</span>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 bg-transparent outline-none text-[#111111]"
              maxLength={10}
            />
          </div>
        </div>

        <Button 
          fullWidth 
          onClick={() => onNavigate('otp')}
        >
          Continue
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[#666666] text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <button className="w-full bg-white border-2 border-gray-200 rounded-[16px] px-6 py-4 flex items-center justify-center gap-3 hover:border-[#6B4BFF] transition-all">
          <Mail className="w-5 h-5 text-[#666666]" />
          <span className="text-[#111111]">Continue with Google</span>
        </button>
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
