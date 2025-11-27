import { useState } from 'react';
import { Button } from './Button';
import { Coins, ClipboardList, Wallet, ChevronRight } from 'lucide-react';

interface OnboardingScreensProps {
  onComplete: () => void;
}

export function OnboardingScreens({ onComplete }: OnboardingScreensProps) {
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: <Coins className="w-24 h-24 text-[#6B4BFF]" />,
      title: 'Earn Money Easily',
      description: 'Complete review tasks and earn real money. No investment needed!',
      bullets: [
        'Get paid for honest reviews',
        'Wide variety of products',
        'Instant task notifications'
      ]
    },
    {
      icon: <ClipboardList className="w-24 h-24 text-[#6B4BFF]" />,
      title: 'Companies Post Tasks',
      description: 'Top brands post review campaigns. Choose tasks that interest you.',
      bullets: [
        'Verified companies only',
        'Clear task requirements',
        'Fair reward amounts'
      ]
    },
    {
      icon: <Wallet className="w-24 h-24 text-[#6B4BFF]" />,
      title: 'Withdraw Anytime',
      description: 'Your earnings are always available. Multiple payment options.',
      bullets: [
        'UPI, Bank, Paytm',
        'No minimum withdrawal',
        'Fast processing'
      ]
    }
  ];

  const currentScreen = screens[step];

  return (
    <div className="h-full flex flex-col bg-white px-6">
      {/* Skip Button */}
      <div className="flex justify-end pt-6 mb-8">
        <button onClick={onComplete} className="text-[#666666] px-4 py-2">
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Icon */}
        <div className="w-40 h-40 bg-[#F6F6F9] rounded-full flex items-center justify-center mb-8">
          {currentScreen.icon}
        </div>

        {/* Title */}
        <h1 className="text-[#111111] mb-4 px-4">
          {currentScreen.title}
        </h1>

        {/* Description */}
        <p className="text-[#666666] mb-8 px-4">
          {currentScreen.description}
        </p>

        {/* Bullets */}
        <div className="space-y-3 mb-8">
          {currentScreen.bullets.map((bullet, index) => (
            <div key={index} className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-[#666666]">{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === step 
                ? 'w-8 bg-[#6B4BFF]' 
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Next/Get Started Button */}
      <div className="pb-8">
        <Button
          fullWidth
          onClick={() => step < screens.length - 1 ? setStep(step + 1) : onComplete()}
          icon={step < screens.length - 1 ? <ChevronRight className="w-5 h-5" /> : undefined}
        >
          {step < screens.length - 1 ? 'Next' : 'Get Started'}
        </Button>
      </div>
    </div>
  );
}
