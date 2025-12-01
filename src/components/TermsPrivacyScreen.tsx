import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

interface TermsPrivacyScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function TermsPrivacyScreen({ onNavigate, onBack }: TermsPrivacyScreenProps) {
  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Terms & Privacy</h1>
        <p className="text-[#666666] text-sm">Your privacy matters to us</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Privacy Policy */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#6B4BFF]" />
            </div>
            <h2 className="text-[#111111]">Privacy Policy</h2>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-[#111111] mb-2">Data Collection</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                We collect information necessary to provide our services, including your name, email, phone number, and payment details. 
                All data is encrypted and stored securely.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Data Usage</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Your data is used solely for account management, payment processing, and improving our services. 
                We never sell your personal information to third parties.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Data Security</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, 
                secure servers, and regular security audits.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Your Rights</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                Contact support to exercise these rights.
              </p>
            </div>
          </div>
        </div>

        {/* Terms of Service */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#FFB93F]/10 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#FFB93F]" />
            </div>
            <h2 className="text-[#111111]">Terms of Service</h2>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-[#111111] mb-2">User Responsibilities</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Users must provide honest, genuine reviews. Fake or misleading reviews will result in account suspension 
                and forfeiture of earnings.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Payment Terms</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Payments are processed after review approval. Withdrawal requests are processed within 24-48 hours. 
                Minimum withdrawal amount is ₹100.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Account Termination</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate our terms, including submission of 
                fake reviews or fraudulent activity.
              </p>
            </div>
            <div>
              <h3 className="text-[#111111] mb-2">Service Availability</h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                We strive to maintain service availability but are not liable for temporary outages or technical issues 
                beyond our control.
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-[#EEF2FF] rounded-[20px] p-4 text-center">
          <p className="text-xs text-[#666666]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}

