import React from 'react';
import { ArrowLeft, Bell, Settings, Shield, HelpCircle, FileText, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function SettingsScreen({ onNavigate, onBack }: SettingsScreenProps) {
  const { logout } = useAuth();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          icon: <User className="w-5 h-5" />, 
          label: 'Edit Profile', 
          action: () => onNavigate('editProfile')
        },
        { 
          icon: <Shield className="w-5 h-5" />, 
          label: 'Privacy & Security', 
          action: () => onNavigate('privacySecurity')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          icon: <Bell className="w-5 h-5" />, 
          label: 'Notification Settings', 
          action: () => onNavigate('notifications')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: <Settings className="w-5 h-5" />, 
          label: 'App Preferences', 
          action: () => onNavigate('preferences')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: <HelpCircle className="w-5 h-5" />, 
          label: 'Help & Support', 
          action: () => onNavigate('helpSupport')
        },
        { 
          icon: <FileText className="w-5 h-5" />, 
          label: 'Terms & Privacy', 
          action: () => onNavigate('terms')
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { 
          icon: <LogOut className="w-5 h-5" />, 
          label: 'Logout', 
          action: () => {
            logout();
            onNavigate('login');
          },
          destructive: true
        }
      ]
    }
  ];

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Settings</h1>
        <p className="text-[#666666] text-sm">Manage your app settings and preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h2 className="text-[#111111] mb-4">{section.title}</h2>
            <div className="bg-white rounded-[20px] shadow-md overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F6F6F9] transition-all
                    ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''}
                    ${item.destructive ? 'text-[#EF4444]' : 'text-[#111111]'}
                  `}
                >
                  <div className={`w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center ${
                    item.destructive ? 'text-[#EF4444]' : 'text-[#666666]'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

