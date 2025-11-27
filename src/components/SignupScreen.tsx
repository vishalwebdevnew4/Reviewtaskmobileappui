import { Button } from './Button';
import { User, Smartphone, Mail } from 'lucide-react';

interface SignupScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
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

      {/* Form */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-[#111111] mb-2">Full Name</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <User className="w-5 h-5 text-[#666666]" />
            <input
              type="text"
              placeholder="Enter your name"
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
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

        <div>
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
          Sign Up
        </Button>

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
