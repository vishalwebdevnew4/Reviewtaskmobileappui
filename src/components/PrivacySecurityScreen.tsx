import React, { useState } from 'react';
import { ArrowLeft, Lock, Shield, Eye, Key, Smartphone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PrivacySecurityScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function PrivacySecurityScreen({ onNavigate, onBack }: PrivacySecurityScreenProps) {
  const { user, changePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const securityFeatures = [
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      enabled: false,
      action: () => {}
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Login Activity',
      description: 'View recent login attempts',
      enabled: true,
      action: () => onNavigate('loginActivity')
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Data Export',
      description: 'Download your account data',
      enabled: true,
      action: () => {}
    }
  ];

  const handleChangePassword = async () => {
    setError('');
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can change password (only for email/password users, not Google OAuth)
  const canChangePassword = user?.auth_provider !== 'google';

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Privacy & Security</h1>
        <p className="text-[#666666] text-sm">Manage your account security</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Account Info */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Account Information</h2>
          <div className="bg-white rounded-[20px] p-6 shadow-md space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#666666]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#666666]">Email</p>
                <p className="text-[#111111]">{user?.email || 'Not set'}</p>
              </div>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#666666]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#666666]">Phone</p>
                  <p className="text-[#111111]">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Change Password</h2>
          {!canChangePassword ? (
            <div className="bg-white rounded-[20px] p-6 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <Key className="w-5 h-5 text-[#666666]" />
                <p className="text-[#111111]">Google Account</p>
              </div>
              <p className="text-sm text-[#666666]">
                You're signed in with Google. Password changes are not available for Google accounts. 
                To change your password, please use email/password authentication.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[20px] p-6 shadow-md space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-[12px]">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-[12px]">
                  <p className="text-green-600 text-sm">Password changed successfully!</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-[#666666] mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setError('');
                      setSuccess(false);
                    }}
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                    setSuccess(false);
                  }}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                />
              </div>
              <div>
                <label className="block text-sm text-[#666666] mb-2">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                    setSuccess(false);
                  }}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                />
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-[#6B4BFF] hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'} Passwords
              </button>
              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                className="w-full bg-[#6B4BFF] text-white py-3 rounded-[12px] font-semibold hover:bg-[#5a3edb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          )}
        </div>

        {/* Security Features */}
        <div className="mb-6">
          <h2 className="text-[#111111] mb-4">Security Features</h2>
          <div className="space-y-3">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-[20px] p-6 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center text-[#6B4BFF]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-[#111111] mb-1">{feature.title}</h3>
                      <p className="text-sm text-[#666666]">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={feature.action}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 overflow-hidden ${
                      feature.enabled ? 'bg-[#6B4BFF]' : 'bg-[#E5E5E5]'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                        feature.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-[#EEF2FF] rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-3">🔒 Privacy Settings</h3>
          <div className="space-y-2 text-sm text-[#666666]">
            <p>• Your profile information is private by default</p>
            <p>• Reviews are visible to companies only</p>
            <p>• We never share your personal data with third parties</p>
            <p>• You can delete your account anytime from settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

