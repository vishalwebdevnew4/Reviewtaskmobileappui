import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Mail, Smartphone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userQueries } from '../db/queries';

interface NotificationsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  taskReminders: boolean;
  paymentAlerts: boolean;
  kycUpdates: boolean;
  marketingEmails: boolean;
}

export function NotificationsScreen({ onNavigate, onBack }: NotificationsScreenProps) {
  const { user, refreshUser } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    taskReminders: true,
    paymentAlerts: true,
    kycUpdates: true,
    marketingEmails: false
  });

  useEffect(() => {
    if (user?.id) {
      // Load saved notification preferences
      const userData = userQueries.getUserById(user.id);
      if (userData?.notification_settings) {
        const settingsStr = userData.notification_settings;
        
        // Handle various invalid cases first
        if (!settingsStr || typeof settingsStr !== 'string') {
          return; // Use default settings
        }
        
        const trimmed = settingsStr.trim();
        
        // Skip if empty, null, undefined, or invalid strings
        if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'NULL' || trimmed === 'Null') {
          // Clean up invalid data
          try {
            userQueries.updateUser(user.id, { notification_settings: undefined });
          } catch (e) {
            // Ignore cleanup errors
          }
          return; // Use default settings
        }
        
        // Check if it looks like valid JSON before attempting to parse
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
          // Doesn't look like JSON, clean it up
          try {
            userQueries.updateUser(user.id, { notification_settings: undefined });
          } catch (e) {
            // Ignore cleanup errors
          }
          return; // Use default settings
        }
        
        try {
          // Try to parse JSON
          const savedSettings = JSON.parse(trimmed);
          
          // Validate that savedSettings is an object (not array, not null)
          if (savedSettings && typeof savedSettings === 'object' && !Array.isArray(savedSettings)) {
            // Merge with defaults, ensuring all required keys exist
            setSettings(prev => ({
              ...prev,
              ...savedSettings,
              // Ensure all keys are present with valid boolean values
              pushNotifications: typeof savedSettings.pushNotifications === 'boolean' ? savedSettings.pushNotifications : prev.pushNotifications,
              emailNotifications: typeof savedSettings.emailNotifications === 'boolean' ? savedSettings.emailNotifications : prev.emailNotifications,
              smsNotifications: typeof savedSettings.smsNotifications === 'boolean' ? savedSettings.smsNotifications : prev.smsNotifications,
              taskReminders: typeof savedSettings.taskReminders === 'boolean' ? savedSettings.taskReminders : prev.taskReminders,
              paymentAlerts: typeof savedSettings.paymentAlerts === 'boolean' ? savedSettings.paymentAlerts : prev.paymentAlerts,
              kycUpdates: typeof savedSettings.kycUpdates === 'boolean' ? savedSettings.kycUpdates : prev.kycUpdates,
              marketingEmails: typeof savedSettings.marketingEmails === 'boolean' ? savedSettings.marketingEmails : prev.marketingEmails,
            }));
          } else {
            // Not a valid object, clean it up
            try {
              userQueries.updateUser(user.id, { notification_settings: undefined });
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        } catch (e) {
          // If parsing fails, clear the corrupted data and use defaults
          // Only log if it's not a common invalid value
          if (!trimmed.match(/^(null|undefined|NULL|Null)$/i)) {
            console.warn('Failed to parse notification settings, clearing corrupted data. Value:', trimmed.substring(0, 50));
          }
          try {
            // Clean up corrupted data in database
            userQueries.updateUser(user.id, { notification_settings: undefined });
          } catch (cleanupError) {
            // Ignore cleanup errors - they're not critical
          }
        }
      }
    }
  }, [user]);

  const handleToggle = async (key: keyof NotificationSettings) => {
    if (!user?.id) return;

    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    setSettings(newSettings);

    // Auto-save immediately when toggled
    try {
      userQueries.updateUser(user.id, {
        notification_settings: JSON.stringify(newSettings)
      });
      
      // Refresh user context to reflect changes
      refreshUser();
    } catch (err) {
      console.error('Failed to save notification settings:', err);
      // Revert on error
      setSettings(settings);
    }
  };

  const notificationCategories = [
    {
      title: 'Notification Methods',
      items: [
        {
          key: 'pushNotifications' as keyof NotificationSettings,
          label: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: <Bell className="w-5 h-5" />
        },
        {
          key: 'emailNotifications' as keyof NotificationSettings,
          label: 'Email Notifications',
          description: 'Receive updates via email',
          icon: <Mail className="w-5 h-5" />
        },
        {
          key: 'smsNotifications' as keyof NotificationSettings,
          label: 'SMS Notifications',
          description: 'Receive updates via text message',
          icon: <Smartphone className="w-5 h-5" />
        }
      ]
    },
    {
      title: 'What to Notify',
      items: [
        {
          key: 'taskReminders' as keyof NotificationSettings,
          label: 'Task Reminders',
          description: 'Reminders for upcoming task deadlines',
          icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
          key: 'paymentAlerts' as keyof NotificationSettings,
          label: 'Payment Alerts',
          description: 'Notifications for payments and withdrawals',
          icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
          key: 'kycUpdates' as keyof NotificationSettings,
          label: 'KYC Updates',
          description: 'Updates about your KYC verification status',
          icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
          key: 'marketingEmails' as keyof NotificationSettings,
          label: 'Marketing Emails',
          description: 'Promotional offers and new features',
          icon: <CheckCircle2 className="w-5 h-5" />
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
        <h1 className="text-[#111111] mb-2">Notifications</h1>
        <p className="text-[#666666] text-sm">Manage your notification preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {notificationCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h2 className="text-[#111111] mb-4">{category.title}</h2>
            <div className="bg-white rounded-[20px] shadow-md overflow-hidden">
              {category.items.map((item, itemIndex) => (
                <div
                  key={item.key}
                  className={`
                    flex items-center gap-4 px-6 py-4
                    ${itemIndex < category.items.length - 1 ? 'border-b border-gray-100' : ''}
                  `}
                >
                  <div className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center text-[#666666]">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#111111] mb-1">{item.label}</h3>
                    <p className="text-xs text-[#666666]">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200
                      ${settings[item.key] ? 'bg-[#6B4BFF]' : 'bg-[#E5E5E5]'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform duration-200 shadow-sm
                        ${settings[item.key] ? 'translate-x-[30px]' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info Box */}
        <div className="bg-[#EEF2FF] rounded-[20px] p-4 mb-6">
          <p className="text-xs text-[#6B4BFF]">
            💡 You can change these settings anytime. Some notifications are important for account security and cannot be disabled.
          </p>
        </div>
      </div>

      {/* Info message - settings auto-save */}
      <div className="bg-white px-6 py-4">
        <p className="text-center text-sm text-[#666666]">
          💾 Settings are saved automatically
        </p>
      </div>
    </div>
  );
}

