import React, { useState } from 'react';
import { ArrowLeft, Globe, Moon, Sun, Bell, Volume2, VolumeX } from 'lucide-react';

interface PreferencesScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function PreferencesScreen({ onNavigate, onBack }: PreferencesScreenProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState('en');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const themes = [
    { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { id: 'auto', label: 'Auto', icon: <Globe className="w-5 h-5" /> }
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'ta', label: 'தமிழ்' },
    { id: 'te', label: 'తెలుగు' }
  ];

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Preferences</h1>
        <p className="text-[#666666] text-sm">Customize your app experience</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Theme Selection */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Appearance</h2>
          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <label className="block text-sm text-[#666666] mb-4">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id as any)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-[16px] border-2 transition-all
                    ${theme === themeOption.id
                      ? 'border-[#6B4BFF] bg-[#6B4BFF]/5'
                      : 'border-gray-200 hover:border-[#6B4BFF]/50'
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === themeOption.id ? 'bg-[#6B4BFF] text-white' : 'bg-[#F6F6F9] text-[#666666]'
                  }`}>
                    {themeOption.icon}
                  </div>
                  <span className="text-sm text-[#111111]">{themeOption.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Language</h2>
          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <label className="block text-sm text-[#666666] mb-4">Select Language</label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-[12px] transition-all
                    ${language === lang.id
                      ? 'bg-[#6B4BFF]/5 border-2 border-[#6B4BFF]'
                      : 'bg-[#F6F6F9] hover:bg-[#6B4BFF]/5'
                    }
                  `}
                >
                  <span className="text-[#111111]">{lang.label}</span>
                  {language === lang.id && (
                    <div className="w-6 h-6 rounded-full bg-[#6B4BFF] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Sound & Notifications</h2>
          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center text-[#6B4BFF]">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-[#111111] mb-1">Sound Effects</h3>
                  <p className="text-sm text-[#666666]">Enable sound for notifications</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 overflow-hidden ${
                  soundEnabled ? 'bg-[#6B4BFF]' : 'bg-[#E5E5E5]'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Other Preferences */}
        <div className="bg-[#EEF2FF] rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-3">💡 Tips</h3>
          <div className="space-y-2 text-sm text-[#666666]">
            <p>• Preferences are saved automatically</p>
            <p>• Dark mode reduces eye strain in low light</p>
            <p>• Language changes apply immediately</p>
            <p>• You can change these settings anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

