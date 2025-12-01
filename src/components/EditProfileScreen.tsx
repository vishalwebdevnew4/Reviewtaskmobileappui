import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Smartphone, Save, Lock, Eye } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { userQueries } from '../db/queries';
import { getCurrentUser } from '../services/auth';

interface EditProfileScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

export function EditProfileScreen({ onNavigate, onBack }: EditProfileScreenProps) {
  const { user, refreshUser, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess(false);
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits, max 10
    const digits = value.replace(/\D/g, '').substring(0, 10);
    handleChange('phone', digits);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setError('User not found. Please login again.');
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Update user in database
      const updates: { name?: string; email?: string } = {};
      
      if (formData.name !== user.name) {
        updates.name = formData.name.trim();
      }
      
      if (formData.email && formData.email !== user.email) {
        // Check if email is already taken by another user
        const existingUser = userQueries.getUserByEmail(formData.email);
        if (existingUser && existingUser.id !== user.id) {
          setError('Email is already registered to another account');
          setLoading(false);
          return;
        }
        updates.email = formData.email.trim();
      }

      // Update name and email
      if (Object.keys(updates).length > 0) {
        userQueries.updateUser(user.id, updates);
      }

      // Update phone if changed
      if (formData.phone !== user.phone) {
        const db = (await import('../db/database')).getDatabase();
        db.run(`UPDATE users SET phone = ? WHERE id = ?`, [formData.phone || null, user.id]);
        (await import('../db/database')).saveDatabase();
      }

      setSuccess(true);
      
      // Refresh user data in context
      refreshUser();
      
      // Navigate back after a short delay
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Edit Profile</h1>
        <p className="text-[#666666] text-sm">Update your personal information</p>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Personal Information */}
        <div className="bg-white rounded-[20px] p-6 shadow-md mb-6">
          <h2 className="text-[#111111] mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <User className="w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Email Address {user?.auth_provider === 'google' && <span className="text-xs text-[#666666]">(Google account)</span>}
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <Mail className="w-5 h-5 text-[#666666]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  disabled={user?.auth_provider === 'google'}
                  className={`flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999] ${
                    user?.auth_provider === 'google' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-form-type="other"
                  onKeyDown={(e) => {
                    // Prevent autofill on backspace/delete
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.stopPropagation();
                    }
                  }}
                />
              </div>
              {user?.auth_provider === 'google' && (
                <p className="text-xs text-[#666666] mt-1 ml-1">
                  Email is managed by your Google account
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm text-[#666666] mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <Smartphone className="w-5 h-5 text-[#666666]" />
                <span className="text-[#666666]">+91</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter phone number"
                  maxLength={10}
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#999999]"
                />
              </div>
              <p className="text-xs text-[#666666] mt-1 ml-1">
                Optional - Used for account recovery
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-[16px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[16px]">
            <p className="text-green-600 text-sm">✅ Profile updated successfully!</p>
          </div>
        )}

        {/* Save Button */}
        <div className="mb-6">
          <Button 
            fullWidth 
            onClick={handleSubmit}
            disabled={loading}
            icon={<Save className="w-5 h-5" />}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Change Password Section */}
        {user?.auth_provider !== 'google' && (
          <div className="bg-white rounded-[20px] p-6 shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#111111]">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordSection(!showPasswordSection);
                  setPasswordError('');
                  setPasswordSuccess(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-[#6B4BFF] text-sm font-medium"
              >
                {showPasswordSection ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordSection && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[12px]">
                    <p className="text-red-600 text-sm">{passwordError}</p>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-[12px]">
                    <p className="text-green-600 text-sm">Password changed successfully!</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-[#666666] mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, currentPassword: e.target.value });
                        setPasswordError('');
                        setPasswordSuccess(false);
                      }}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#111111]"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#666666] mb-2">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#666666] mb-2">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      setPasswordError('');
                      setPasswordSuccess(false);
                    }}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
                  />
                </div>

                <Button
                  fullWidth
                  onClick={async () => {
                    setPasswordError('');
                    setPasswordSuccess(false);

                    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                      setPasswordError('Please fill in all fields');
                      return;
                    }

                    if (passwordData.newPassword !== passwordData.confirmPassword) {
                      setPasswordError('New passwords do not match');
                      return;
                    }

                    if (passwordData.newPassword.length < 6) {
                      setPasswordError('New password must be at least 6 characters');
                      return;
                    }

                    if (passwordData.currentPassword === passwordData.newPassword) {
                      setPasswordError('New password must be different from current password');
                      return;
                    }

                    setPasswordLoading(true);

                    try {
                      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
                      
                      if (result.success) {
                        setPasswordSuccess(true);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setTimeout(() => {
                          setShowPasswordSection(false);
                          setPasswordSuccess(false);
                        }, 2000);
                      } else {
                        setPasswordError(result.error || 'Failed to change password');
                      }
                    } catch (err: any) {
                      setPasswordError(err.message || 'Failed to change password');
                    } finally {
                      setPasswordLoading(false);
                    }
                  }}
                  disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  icon={<Lock className="w-5 h-5" />}
                >
                  {passwordLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <h2 className="text-[#111111] mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#666666]">Account Type</span>
              <span className="text-[#111111] font-medium">
                {user?.auth_provider === 'google' ? 'Google Account' : 'Email Account'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Member Since</span>
              <span className="text-[#111111] font-medium">
                {user?.created_at 
                  ? new Date(user.created_at as string).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'Recently'}
              </span>
            </div>
            {user?.auth_provider === 'google' && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[#666666] text-xs">
                  To change your email, update your Google account settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

