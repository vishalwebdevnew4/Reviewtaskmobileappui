import React from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { getUserEarnings } from '../services/userService';
import { getKYCStatus } from '../services/kycService';
import { getUserReviews } from '../services/reviewService';
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
  const { user, logout } = useAuth();
  const [stats, setStats] = React.useState({
    reviews: 0,
    earned: 0,
    rating: 0
  });
  const [kycStatus, setKycStatus] = React.useState(null);
  const [memberSince, setMemberSince] = React.useState('');

  React.useEffect(() => {
    if (user?.uid) {
      // Load user stats
      const loadStats = async () => {
        try {
          // Get earnings
          const earnings = await getUserEarnings(user.uid);
          
          // Get reviews
          const reviews = await getUserReviews(user.uid);
          
          // Calculate average rating
          const ratings = reviews.filter(r => r.rating).map(r => r.rating);
          const avgRating = ratings.length > 0 
            ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
            : '0.0';

          setStats({
            reviews: reviews.length,
            earned: earnings.availableBalance,
            rating: parseFloat(avgRating)
          });

          // Get KYC status
          const kycStatusValue = await getKYCStatus(user.uid);
          setKycStatus(kycStatusValue);

          // Format member since date
          if (user.metadata.creationTime) {
            const date = new Date(user.metadata.creationTime);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            setMemberSince(`${month} ${year}`);
          } else {
            setMemberSince('Recently');
          }
        } catch (error) {
          console.error('Failed to load user stats:', error);
        }
      };

      loadStats();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      onNavigate('login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      onNavigate('login');
    }
  };

  const handleKYCVerification = () => {
    if (kycStatus === 'approved') {
      onNavigate('kycStatusApproved');
    } else if (kycStatus === 'rejected') {
      onNavigate('kycStatusRejected');
    } else if (kycStatus === 'pending') {
      onNavigate('kycStatus');
    } else {
      onNavigate('kycBasicInfo');
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: <User className="w-5 h-5" />, label: 'Edit Profile', action: () => onNavigate('editProfile') },
        { 
          icon: <Shield className="w-5 h-5" />, 
          label: 'KYC Verification', 
          badge: kycStatus ? (kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)) : 'Not Started',
          action: handleKYCVerification
        },
        { icon: <Briefcase className="w-5 h-5" />, label: 'Switch to Company', action: () => onNavigate('companyDashboard') },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: <Bell className="w-5 h-5" />, label: 'Notifications', action: () => onNavigate('notifications') },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', action: () => onNavigate('settings') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', action: () => onNavigate('helpSupport') },
        { icon: <FileText className="w-5 h-5" />, label: 'Terms & Privacy', action: () => onNavigate('terms') },
      ]
    }
  ];

  // Format phone number
  const formatPhone = (phone?: string) => {
    if (!phone) return 'Not provided';
    // Remove country code if present
    let phoneNumber = phone.replace(/^\+91/, '').trim();
    if (phoneNumber.length === 10) {
      return `+91 ${phoneNumber.substring(0, 5)} ${phoneNumber.substring(5)}`;
    }
    return phone.startsWith('+') ? phone : `+91 ${phoneNumber}`;
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="h-full bg-[#F6F6F9] relative flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-6">
        <h1 className="text-[#111111] mb-6">Profile</h1>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-2xl font-bold">{getInitials(user?.displayName || undefined)}</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl mb-1">{user?.displayName || 'User'}</h2>
              <p className="text-sm opacity-90">
                Member since {memberSince || 'Recently'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {user?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 opacity-70" />
                <span>{user.email}</span>
              </div>
            )}
            {user?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 opacity-70" />
                <span>{formatPhone(user.phoneNumber)}</span>
              </div>
            )}
            {!user?.email && !user?.phoneNumber && (
              <div className="text-sm opacity-70">
                Complete your profile to add contact information
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">{stats.reviews}</h3>
            <p className="text-[#666666] text-xs">Surveys</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">₹{stats.earned.toLocaleString()}</h3>
            <p className="text-[#666666] text-xs">Earned</p>
          </div>
          <div className="bg-white rounded-[20px] p-4 text-center shadow-md">
            <h3 className="text-[#111111] mb-1">{stats.rating.toFixed(1)}★</h3>
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
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    item.badge === 'Approved' 
                      ? 'bg-green-100 text-green-600'
                      : item.badge === 'Pending'
                      ? 'bg-[#FF9500]/10 text-[#FF9500]'
                      : item.badge === 'Rejected'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
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
      {!kycStatus || kycStatus === 'pending' || kycStatus === 'rejected' ? (
        <div className="px-6 pb-6">
          <div className="bg-[#FFB93F]/10 rounded-[20px] p-6 border-2 border-[#FFB93F]/20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-[#FFB93F]" />
              <h3 className="text-[#FFB93F]">Complete KYC Verification</h3>
            </div>
            <p className="text-[#666666] text-sm mb-4">
              Verify your identity to unlock higher withdrawal limits and premium tasks.
            </p>
            <Button size="sm" variant="secondary" onClick={handleKYCVerification}>
              {kycStatus === 'rejected' ? 'Re-verify' : 'Verify Now'}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Logout Button */}
      <div className="px-6 pb-6">
        <button 
          onClick={handleLogout}
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
      </div>

      {/* Navigation - Sticky at bottom */}
      <Navigation active="profile" onNavigate={onNavigate} />
    </div>
  );
}
