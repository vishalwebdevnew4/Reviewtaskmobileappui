import React from 'react';
import { ArrowLeft, HelpCircle, Mail, MessageCircle, FileText, Phone } from 'lucide-react';

interface HelpSupportScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function HelpSupportScreen({ onNavigate, onBack }: HelpSupportScreenProps) {
  const faqs = [
    {
      question: 'How do I earn money?',
      answer: 'Complete review tasks posted by companies. Each task has a reward amount that you\'ll receive after your review is approved.'
    },
    {
      question: 'When will I receive payment?',
      answer: 'Payments are processed within 24-48 hours after your review is approved. You can withdraw your earnings anytime.'
    },
    {
      question: 'What is KYC verification?',
      answer: 'KYC (Know Your Customer) verification is required to withdraw earnings. It helps us ensure account security and comply with regulations.'
    },
    {
      question: 'How do I submit a review?',
      answer: 'Browse available tasks, select one that interests you, write an honest review with photos, and submit it before the deadline.'
    },
    {
      question: 'Can I edit my review after submission?',
      answer: 'No, reviews cannot be edited after submission. Please review your content carefully before submitting.'
    },
    {
      question: 'What if my review is rejected?',
      answer: 'If your review doesn\'t meet the requirements, you\'ll receive feedback. You can improve and submit a new review for the same task if available.'
    }
  ];

  const supportOptions = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'support@reviewtask.com',
      action: () => window.location.href = 'mailto:support@reviewtask.com'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Available 9 AM - 6 PM',
      action: () => {}
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      description: '+91 1800-123-4567',
      action: () => window.location.href = 'tel:+9118001234567'
    }
  ];

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Help & Support</h1>
        <p className="text-[#666666] text-sm">We're here to help you</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Support Options */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Contact Support</h2>
          <div className="space-y-3">
            {supportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full bg-white rounded-[20px] p-6 shadow-md text-left hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center text-[#6B4BFF]">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111111] mb-1">{option.title}</h3>
                    <p className="text-sm text-[#666666]">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-[20px] p-6 shadow-md">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#6B4BFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[#111111] mb-2">{faq.question}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-[#EEF2FF] rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-3">📚 Additional Resources</h3>
          <div className="space-y-2 text-sm text-[#666666]">
            <p>• Check our <button onClick={() => onNavigate('terms')} className="text-[#6B4BFF] underline">Terms & Privacy</button> policy</p>
            <p>• Read our review guidelines for best practices</p>
            <p>• Watch tutorial videos in the app</p>
          </div>
        </div>
      </div>
    </div>
  );
}

