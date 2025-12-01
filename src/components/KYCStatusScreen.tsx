import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Home } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { kycQueries } from '../db/queries';

interface KYCStatusScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  status?: 'pending' | 'approved' | 'rejected';
}

export function KYCStatusScreen({ onNavigate, onBack, status: propStatus }: KYCStatusScreenProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState(propStatus || 'pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      // Fetch real KYC status from database
      const kycInfo = kycQueries.getKYCInfo(user.id);
      if (kycInfo?.status) {
        setStatus(kycInfo.status as 'basic_info_complete' | 'pending' | 'approved' | 'rejected');
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const statusConfig = {
    basic_info_complete: {
      icon: <CheckCircle2 className="w-16 h-16" />,
      bgColor: 'bg-[#6B4BFF]/10',
      iconColor: 'text-[#6B4BFF]',
      title: 'Basic Info Complete',
      message: 'Your basic information has been saved. You can complete document verification later when you need to withdraw funds or access premium features.',
      timeline: [
        { label: 'Basic Information', status: 'completed', time: 'Just now' },
        { label: 'Document Verification', status: 'pending', time: 'Optional' },
        { label: 'Full Verification', status: 'pending', time: 'Pending' }
      ],
      action: 'Go to Home',
      actionVariant: 'secondary' as const
    },
    pending: {
      icon: <Clock className="w-16 h-16" />,
      bgColor: 'bg-[#FFB93F]/10',
      iconColor: 'text-[#FFB93F]',
      title: 'Verification Pending',
      message: 'Your KYC documents are being verified. This usually takes 2-5 minutes for automated verification.',
      timeline: [
        { label: 'Documents Submitted', status: 'completed', time: 'Just now' },
        { label: 'Under Review', status: 'current', time: 'In progress' },
        { label: 'Verification Complete', status: 'pending', time: 'Pending' }
      ],
      action: 'Go to Home',
      actionVariant: 'secondary' as const
    },
    approved: {
      icon: <CheckCircle2 className="w-16 h-16" />,
      bgColor: 'bg-[#22C55E]/10',
      iconColor: 'text-[#22C55E]',
      title: 'Verification Approved! 🎉',
      message: 'Congratulations! Your KYC verification is complete. You can now withdraw your earnings without any restrictions.',
      timeline: [
        { label: 'Documents Submitted', status: 'completed', time: '2 hours ago' },
        { label: 'Under Review', status: 'completed', time: '5 mins ago' },
        { label: 'Verification Complete', status: 'completed', time: 'Just now' }
      ],
      action: 'Start Earning',
      actionVariant: 'primary' as const
    },
    rejected: {
      icon: <XCircle className="w-16 h-16" />,
      bgColor: 'bg-[#EF4444]/10',
      iconColor: 'text-[#EF4444]',
      title: 'Verification Failed',
      message: 'We couldn\'t verify your documents. Please review the reasons below and try again with correct information.',
      timeline: [
        { label: 'Documents Submitted', status: 'completed', time: '2 hours ago' },
        { label: 'Under Review', status: 'completed', time: '5 mins ago' },
        { label: 'Verification Failed', status: 'failed', time: 'Just now' }
      ],
      action: 'Try Again',
      actionVariant: 'primary' as const
    }
  };

  const config = statusConfig[status];

  if (loading) {
    return (
      <div className="h-full bg-[#F6F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111]">KYC Status</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Status Icon */}
        <div className="bg-white rounded-[20px] p-8 shadow-md text-center mb-6">
          <div className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${config.iconColor}`}>
            {config.icon}
          </div>
          <h2 className="text-[#111111] mb-3">{config.title}</h2>
          <p className="text-sm text-[#666666] leading-relaxed">
            {config.message}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-[20px] p-6 shadow-md mb-6">
          <h3 className="text-[#111111] mb-4">Verification Timeline</h3>
          <div className="space-y-4">
            {config.timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="relative">
                  {item.status === 'completed' ? (
                    <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  ) : item.status === 'current' ? (
                    <div className="w-6 h-6 bg-[#FFB93F] rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  ) : item.status === 'failed' ? (
                    <div className="w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-[#E5E5E5] rounded-full"></div>
                  )}
                  {index < config.timeline.length - 1 && (
                    <div className={`absolute left-1/2 top-6 w-0.5 h-8 -translate-x-1/2 ${
                      item.status === 'completed' ? 'bg-[#22C55E]' : 'bg-[#E5E5E5]'
                    }`}></div>
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm ${
                    item.status === 'completed' || item.status === 'current' || item.status === 'failed'
                      ? 'text-[#111111]'
                      : 'text-[#999999]'
                  }`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-[#666666] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rejection Reasons (if rejected) */}
        {status === 'rejected' && (
          <div className="bg-[#FEF2F2] rounded-[20px] p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[#EF4444] mb-2">Reasons for Rejection</h3>
                <ul className="space-y-2 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444]">•</span>
                    <span>Document image is blurry or unclear</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444]">•</span>
                    <span>All corners of the document are not visible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444]">•</span>
                    <span>Document details don't match provided information</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-[12px] p-4">
              <p className="text-sm text-[#111111]">💡 <span className="text-[#666666]">Make sure to upload clear, well-lit photos showing all document details</span></p>
            </div>
          </div>
        )}

        {/* Benefits (if approved) */}
        {status === 'approved' && (
          <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[20px] p-6 text-white">
            <h3 className="mb-4">🎁 You're Now Verified!</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm">Withdraw earnings instantly</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm">Access premium tasks</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-sm">Higher earning potential</p>
              </div>
            </div>
          </div>
        )}

        {/* Basic Info Complete Info */}
        {status === 'basic_info_complete' && (
          <div className="bg-[#EEF2FF] rounded-[20px] p-6">
            <h3 className="text-[#111111] mb-3">📋 What's Next?</h3>
            <div className="space-y-2 text-sm text-[#666666]">
              <p>• You can browse and complete tasks right away</p>
              <p>• Document verification is optional but recommended</p>
              <p>• Complete document verification when you want to withdraw funds</p>
              <p>• You can continue KYC verification anytime from your profile</p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#6B4BFF]/20">
              <Button
                fullWidth
                onClick={() => onNavigate('kycDocument')}
                variant="primary"
              >
                Complete Document Verification
              </Button>
            </div>
          </div>
        )}

        {/* Pending Info */}
        {status === 'pending' && (
          <div className="bg-[#EEF2FF] rounded-[20px] p-6">
            <h3 className="text-[#111111] mb-3">⏱️ What happens next?</h3>
            <div className="space-y-2 text-sm text-[#666666]">
              <p>• You'll receive a notification once verification is complete</p>
              <p>• Average verification time: 2-5 minutes</p>
              <p>• You can continue browsing tasks while we verify</p>
              <p>• Contact support if it takes longer than expected</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="bg-white px-6 py-4 shadow-lg space-y-3">
        {status === 'rejected' ? (
          <>
            <Button
              fullWidth
              onClick={() => onNavigate('kycBasicInfo')}
              variant={config.actionVariant}
            >
              {config.action}
            </Button>
            <Button
              fullWidth
              onClick={() => onNavigate('home')}
              variant="secondary"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Home
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            onClick={() => onNavigate('home')}
            variant={config.actionVariant}
            icon={status === 'pending' ? <Home className="w-4 h-4" /> : undefined}
          >
            {config.action}
          </Button>
        )}
      </div>
    </div>
  );
}
