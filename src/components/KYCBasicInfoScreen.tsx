import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Mail, Smartphone, MapPin } from 'lucide-react';
import { Button } from './Button';
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
    email: userProfile?.email || user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };


  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 10);
    handleChange('phone', digits);
  };

  const handlePincodeChange = (value: string) => {
    const digits = value.replace(/\D/g, '').substring(0, 6);
    handleChange('pincode', digits);
  };

  const handleSubmit = async () => {
    if (!user?.uid) {
      setError('User not found. Please login again.');
      return;
    }

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.dob) {
      setError('Date of birth is required');
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      setError('Valid 10-digit phone number is required');
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email address is required');
      return;
    }

    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }

    if (!formData.state.trim()) {
      setError('State is required');
      return;
    }

    if (!formData.pincode || formData.pincode.length !== 6) {
      setError('Valid 6-digit pincode is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save basic info to pass to document screen
      // Documents will be uploaded in the next screen
      const basicInfo = {
        fullName: formData.fullName.trim(),
        dob: formData.dob,
        phone: formData.phone,
        email: formData.email,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode
      };

      // Navigate to document screen with basic info
      onNavigate('kycDocument', { basicInfo });
    } catch (err: any) {
      setError(err.message || 'Failed to save information');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.fullName && formData.dob && formData.phone && formData.email && 
                      formData.address && formData.city && formData.state && formData.pincode;

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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-[16px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <h2 className="text-[#111111] mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[12px] px-4 py-3">
                <User className="w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Date of Birth <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[12px] px-4 py-3">
                  <Calendar className="w-5 h-5 text-[#666666]" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="flex-1 bg-transparent outline-none text-[#111111]"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Phone Number <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[12px] px-4 py-3">
                <Smartphone className="w-5 h-5 text-[#666666]" />
                <span className="text-[#666666]">+91</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[12px] px-4 py-3">
                <Mail className="w-5 h-5 text-[#666666]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Address <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex items-start gap-3 bg-[#F6F6F9] rounded-[12px] px-4 py-3">
                <MapPin className="w-5 h-5 text-[#666666] mt-1" />
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                  rows={2}
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999] resize-none"
                />
              </div>
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  City <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">
                  State <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                />
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Pincode <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="123456"
                maxLength={6}
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

      {/* Bottom Buttons */}
      <div className="bg-white px-6 py-4 shadow-lg space-y-3">
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </Button>
        <Button
          fullWidth
          onClick={() => {
            if (!user?.uid) {
              setError('User not found. Please login again.');
              return;
            }

            // Validate required fields
            if (!formData.fullName.trim() || !formData.dob || !formData.phone || formData.phone.length !== 10 || 
                !formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
                !formData.address.trim() || !formData.city.trim() || !formData.state.trim() || 
                !formData.pincode || formData.pincode.length !== 6) {
              setError('Please fill all required fields to skip document verification');
              return;
            }

            setLoading(true);
            setError('');

            try {
              // For skip document flow, we'll just navigate
              // The KYC will be submitted without documents
              // Navigate directly to status screen (skip document upload)
              onNavigate('kycStatus', { 
                skipDocument: true,
                basicInfo: {
                  fullName: formData.fullName.trim(),
                  dob: formData.dob,
                  phone: formData.phone,
                  email: formData.email
                }
              });
            } catch (err: any) {
              setError(err.message || 'Failed to save information');
            } finally {
              setLoading(false);
            }
          }}
          variant="secondary"
          disabled={!isFormValid || loading}
        >
          Skip Document & Continue
        </Button>
      </div>
    </div>
  );
}
