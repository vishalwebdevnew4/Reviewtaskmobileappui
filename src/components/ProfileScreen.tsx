import { Navigation } from './Navigation';
import { Button } from './Button';
import { 
  User, 
  Mail, 
  Smartphone, 
  ChevronRight, 
  Shield, 
  Bell, 
  HelpCircle, 
  FileText, 
  LogOut,
  Settings,
  Briefcase
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: <User className="w-5 h-5" />, label: 'Edit Profile', action: () => {} },
        { icon: <Shield className="w-5 h-5" />, label: 'KYC Verification', badge: 'Pending', action: () => {} },
        { icon: <Briefcase className="w-5 h-5" />, label: 'Switch to Company', action: () => onNavigate('companyDashboard') },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: <Bell className="w-5 h-5" />, label: 'Notifications', action: () => {} },
        { icon: <Settings className="w-5 h-5" />, label: 'Preferences', action: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', action: () => {} },
        { icon: <FileText className="w-5 h-5" />, label: 'Terms & Privacy', action: () => {} },
      ]
    }
  ];

  return (
    <div className="h-full bg-[#F6F6F9] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <h1 className="text-[#111111] mb-6">Profile</h1>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-1">Vishal Kumar</h2>
              <p className="text-sm opacity-90">Member since Nov 2024</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 opacity-70" />
              <span>vishal.kumar@email.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4 opacity-70" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">45</h3>
            <p className="text-[#666666] text-xs">Reviews</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">₹12.4K</h3>
            <p className="text-[#666666] text-xs">Earned</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">4.8★</h3>
            <p className="text-[#666666] text-xs">Rating</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="px-6 pb-6">
          <h2 className="text-[#111111] mb-4">{section.title}</h2>
          <div className="bg-white rounded-[20px] shadow-md overflow-hidden">
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                onClick={item.action}
                className={`
                  w-full flex items-center gap-4 px-6 py-4 hover:bg-[#F6F6F9] transition-all
                  ${itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center text-[#666666]">
                  {item.icon}
                </div>
                <span className="flex-1 text-left text-[#111111]">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#FF9500]/10 text-[#FF9500] px-3 py-1 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-[#666666]" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* KYC Verification Banner */}
      <div className="px-6 pb-6">
        <div className="bg-[#FFB93F]/10 rounded-[20px] p-6 border-2 border-[#FFB93F]/20">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-[#FFB93F]" />
            <h3 className="text-[#FFB93F]">Complete KYC Verification</h3>
          </div>
          <p className="text-[#666666] text-sm mb-4">
            Verify your identity to unlock higher withdrawal limits and premium tasks.
          </p>
          <Button size="sm" variant="secondary">
            Verify Now
          </Button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-6">
        <button 
          onClick={() => onNavigate('login')}
          className="w-full flex items-center justify-center gap-3 bg-white rounded-[20px] px-6 py-4 text-[#EF4444] shadow-md hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center pb-6">
        <p className="text-[#666666] text-sm">ReviewTask v1.0.0</p>
      </div>

      {/* Navigation */}
      <Navigation active="profile" onNavigate={onNavigate} />
    </div>
  );
}
