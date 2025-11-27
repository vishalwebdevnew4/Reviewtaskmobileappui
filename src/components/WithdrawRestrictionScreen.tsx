import { ArrowLeft, Lock, Shield, FileCheck, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface WithdrawRestrictionScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function WithdrawRestrictionScreen({ onNavigate, onBack }: WithdrawRestrictionScreenProps) {
  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111]">Withdrawal</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto flex flex-col items-center justify-center">
        {/* Main Restriction Card */}
        <div className="w-full max-w-md">
          {/* Lock Icon */}
          <div className="bg-white rounded-[20px] p-8 shadow-md text-center mb-6">
            <div className="w-24 h-24 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-[#EF4444]" />
            </div>
            <h2 className="text-[#111111] mb-3">KYC Verification Required</h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              To ensure secure transactions and comply with regulations, you need to complete KYC verification before withdrawing your earnings.
            </p>
          </div>

          {/* Current Balance */}
          <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[20px] p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Available Balance</p>
                <h3 className="text-3xl">₹2,450</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-90">
                Complete KYC to unlock withdrawals
              </p>
            </div>
          </div>

          {/* Why KYC is Required */}
          <div className="bg-white rounded-[20px] p-6 shadow-md mb-6">
            <h3 className="text-[#111111] mb-4">Why KYC is Required</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#6B4BFF]" />
                </div>
                <div>
                  <p className="text-[#111111] mb-1">Secure Transactions</p>
                  <p className="text-sm text-[#666666]">Protect your account from fraud and unauthorized access</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-[#111111] mb-1">Legal Compliance</p>
                  <p className="text-sm text-[#666666]">Meet government regulations for financial transactions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#FFB93F]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#FFB93F]" />
                </div>
                <div>
                  <p className="text-[#111111] mb-1">Unlock Benefits</p>
                  <p className="text-sm text-[#666666]">Access premium tasks and higher earning opportunities</p>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Need */}
          <div className="bg-[#EEF2FF] rounded-[20px] p-6 mb-6">
            <h3 className="text-[#111111] mb-3">📋 What You'll Need</h3>
            <div className="space-y-2 text-sm text-[#666666]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>Valid government-issued ID (Aadhaar/PAN/Passport)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>Clear photo of your document</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>5 minutes of your time</span>
              </div>
            </div>
          </div>

          {/* Quick Process */}
          <div className="bg-white rounded-[20px] p-6 shadow-md mb-6">
            <h3 className="text-[#111111] mb-4">✨ Quick & Easy Process</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm text-[#111111]">Fill basic information</p>
                  <p className="text-xs text-[#666666]">Name, DOB, Phone, Email</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm text-[#111111]">Upload ID document</p>
                  <p className="text-xs text-[#666666]">Aadhaar, PAN or Passport</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm text-[#111111]">Get verified instantly</p>
                  <p className="text-xs text-[#666666]">Usually takes 2-5 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-[20px] p-4 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-[#666666]">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <span>Bank-level encryption</span>
              <span className="text-[#E5E5E5]">•</span>
              <span>100% secure</span>
              <span className="text-[#E5E5E5]">•</span>
              <span>Compliant with RBI guidelines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bg-white px-6 py-4 shadow-lg space-y-3">
        <Button
          fullWidth
          onClick={() => onNavigate('kycBasicInfo')}
        >
          Complete KYC Verification
        </Button>
        <Button
          fullWidth
          onClick={onBack}
          variant="secondary"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );
}