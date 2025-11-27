import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface KYCBasicInfoScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function KYCBasicInfoScreen({ onNavigate, onBack }: KYCBasicInfoScreenProps) {
  const { user, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: userProfile?.displayName || '',
    dob: '',
    phone: userProfile?.phoneNumber || user?.phoneNumber || '',
    email: userProfile?.email || user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Validate form
    if (!formData.fullName || !formData.dob || !formData.phone || !formData.email) {
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return;
    }

    // Validate phone (should be 10 digits)
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      return;
    }

    // Proceed to next step
    onNavigate('kycDocument', { basicInfo: formData });
  };

  const isFormValid = formData.fullName && formData.dob && formData.phone && formData.email;

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">KYC Verification</h1>
        <p className="text-[#666666] text-sm">Complete your profile to start earning</p>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#E5E5E5] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#E5E5E5] rounded-full"></div>
        </div>
        <p className="text-xs text-[#666666] mt-2">Step 1 of 3</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <h2 className="text-[#111111] mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Date of Birth <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                />
                <Calendar className="w-5 h-5 text-[#999999] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Phone Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-[#EEF2FF] rounded-[12px] p-4">
            <p className="text-xs text-[#6B4BFF]">
              📝 Your information is secure and will only be used for verification purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="bg-white px-6 py-4 shadow-lg">
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}