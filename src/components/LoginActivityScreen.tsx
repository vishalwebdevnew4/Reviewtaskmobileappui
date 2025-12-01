import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Monitor, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginActivityScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

interface LoginActivity {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  timestamp: Date;
  status: 'success' | 'failed';
  browser?: string;
}

export function LoginActivityScreen({ onNavigate, onBack }: LoginActivityScreenProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load login activities from localStorage (simulated)
    const loadActivities = () => {
      setLoading(true);
      try {
        // Get stored login activities or create default ones
        const stored = localStorage.getItem(`login_activities_${user?.id}`);
        let activityList: LoginActivity[] = [];
        
        if (stored) {
          activityList = JSON.parse(stored).map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp)
          }));
        } else {
          // Create default activities for demo
          activityList = [
            {
              id: '1',
              device: 'iPhone 14 Pro',
              location: 'Mumbai, India',
              ipAddress: '192.168.1.100',
              timestamp: new Date(),
              status: 'success',
              browser: 'Safari'
            },
            {
              id: '2',
              device: 'Windows PC',
              location: 'Delhi, India',
              ipAddress: '192.168.1.101',
              timestamp: new Date(Date.now() - 86400000), // 1 day ago
              status: 'success',
              browser: 'Chrome'
            },
            {
              id: '3',
              device: 'Android Phone',
              location: 'Bangalore, India',
              ipAddress: '192.168.1.102',
              timestamp: new Date(Date.now() - 172800000), // 2 days ago
              status: 'failed',
              browser: 'Chrome'
            }
          ];
          localStorage.setItem(`login_activities_${user?.id}`, JSON.stringify(activityList));
        }
        
        setActivities(activityList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (error) {
        console.error('Error loading login activities:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadActivities();
    }
  }, [user]);

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Login Activity</h1>
        <p className="text-[#666666] text-sm">View recent login attempts and sessions</p>
      </div>

      {/* Current Session */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center text-[#22C55E]">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-[#111111]">Current Session</h3>
              <p className="text-sm text-[#666666]">You're currently logged in</p>
            </div>
            <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-xs">
              Active
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#666666]">Device:</span>
              <span className="text-[#111111]">{navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Browser:</span>
              <span className="text-[#111111]">{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <h2 className="text-[#111111] mb-4">Recent Activity</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[20px]">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-[#666666]" />
            </div>
            <h3 className="text-[#111111] mb-2">No activity found</h3>
            <p className="text-[#666666]">Your login history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-[20px] p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                  }`}>
                    {getDeviceIcon(activity.device)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-[#111111]">{activity.device}</h3>
                        <p className="text-sm text-[#666666]">{formatDate(activity.timestamp)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        activity.status === 'success' 
                          ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                          : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {activity.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-[#666666]">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="text-[#666666]">
                        IP: {activity.ipAddress}
                      </div>
                      {activity.browser && (
                        <div className="text-[#666666]">
                          Browser: {activity.browser}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="px-6 py-4">
        <div className="bg-[#EEF2FF] rounded-[20px] p-4">
          <p className="text-xs text-[#6B4BFF]">
            🔒 If you notice any suspicious activity, please change your password immediately and contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

