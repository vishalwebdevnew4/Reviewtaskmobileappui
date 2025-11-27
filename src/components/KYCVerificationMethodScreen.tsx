import { ArrowLeft, Zap, Users, Shield, Clock } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';

interface KYCVerificationMethodScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function KYCVerificationMethodScreen({ onNavigate, onBack }: KYCVerificationMethodScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'auto' | 'manual'>('auto');

  const handleSubmit = () => {
    // Submit KYC for verification
    onNavigate('kycStatus', { method: selectedMethod, status: 'pending' });
  };

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Verification Method</h1>
        <p className="text-[#666666] text-sm">Choose how you'd like to verify</p>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
        </div>
        <p className="text-xs text-[#666666] mt-2">Step 3 of 3</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="space-y-4">
          {/* Automated Verification */}
          <button
            onClick={() => setSelectedMethod('auto')}
            className={`w-full bg-white rounded-[20px] p-6 shadow-md text-left transition-all ${
              selectedMethod === 'auto' ? 'ring-2 ring-[#6B4BFF]' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center text-[#6B4BFF] flex-shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#111111]">Automated Verification</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'auto' ? 'border-[#6B4BFF] bg-[#6B4BFF]' : 'border-[#E5E5E5]'
                  }`}>
                    {selectedMethod === 'auto' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  Instant verification using AI-powered document scanning
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-[#22C55E]">
                    <Clock className="w-4 h-4" />
                    <span>2-5 minutes</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6B4BFF]">
                    <Shield className="w-4 h-4" />
                    <span>Highly secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-[#F0F0F0] space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>API-based validation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#6B4BFF] rounded-full"></div>
                <span>99.8% accuracy rate</span>
              </div>
            </div>

            {/* Recommended Badge */}
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 bg-[#FFB93F]/10 text-[#FFB93F] px-3 py-1 rounded-full text-xs">
                ⚡ Recommended
              </span>
            </div>
          </button>

          {/* Manual Review */}
          <button
            onClick={() => setSelectedMethod('manual')}
            className={`w-full bg-white rounded-[20px] p-6 shadow-md text-left transition-all ${
              selectedMethod === 'manual' ? 'ring-2 ring-[#6B4BFF]' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#666666]/10 rounded-full flex items-center justify-center text-[#666666] flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#111111]">Manual Review</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'manual' ? 'border-[#6B4BFF] bg-[#6B4BFF]' : 'border-[#E5E5E5]'
                  }`}>
                    {selectedMethod === 'manual' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  Documents reviewed by our verification team
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-[#FFB93F]">
                    <Clock className="w-4 h-4" />
                    <span>1-2 business days</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6B4BFF]">
                    <Shield className="w-4 h-4" />
                    <span>Highly secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-[#F0F0F0] space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#666666] rounded-full"></div>
                <span>Human verification</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#666666] rounded-full"></div>
                <span>Manual document review</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666666]">
                <div className="w-1.5 h-1.5 bg-[#666666] rounded-full"></div>
                <span>100% accuracy guarantee</span>
              </div>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-[#EEF2FF] rounded-[12px] p-4">
          <h3 className="text-sm text-[#111111] mb-2">🔒 Your data is protected</h3>
          <p className="text-xs text-[#666666]">
            All documents are encrypted and stored securely. We comply with government regulations and never share your data with third parties.
          </p>
        </div>

        {/* How it Works */}
        <div className="mt-6">
          <h3 className="text-[#111111] mb-4">How Verification Works</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-[#111111] mb-1">Submit Documents</p>
                <p className="text-sm text-[#666666]">Your documents are securely uploaded</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-[#111111] mb-1">Verification Process</p>
                <p className="text-sm text-[#666666]">Documents are verified using your selected method</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#6B4BFF] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-[#111111] mb-1">Get Verified</p>
                <p className="text-sm text-[#666666]">Start earning once approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bg-white px-6 py-4 shadow-lg">
        <Button
          fullWidth
          onClick={handleSubmit}
        >
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}