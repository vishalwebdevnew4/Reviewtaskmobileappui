<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
=======
import { useState } from 'react';
import { Toaster } from 'sonner';
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
import { OnboardingScreens } from './components/OnboardingScreens';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { OTPScreen } from './components/OTPScreen';
import { HomeScreen } from './components/HomeScreen';
import { TaskDetailsScreen } from './components/TaskDetailsScreen';
import { SubmitSurveyScreen } from './components/SubmitSurveyScreen';
import { MyTasksScreen } from './components/MyTasksScreen';
import { WalletScreen } from './components/WalletScreen';
import { WithdrawScreen } from './components/WithdrawScreen';
import { CompanyDashboard } from './components/CompanyDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { KYCBasicInfoScreen } from './components/KYCBasicInfoScreen';
import { KYCDocumentScreen } from './components/KYCDocumentScreen';
import { KYCVerificationMethodScreen } from './components/KYCVerificationMethodScreen';
import { KYCStatusScreen } from './components/KYCStatusScreen';
import { WithdrawRestrictionScreen } from './components/WithdrawRestrictionScreen';
<<<<<<< HEAD
import { SettingsScreen } from './components/SettingsScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { HelpSupportScreen } from './components/HelpSupportScreen';
import { TermsPrivacyScreen } from './components/TermsPrivacyScreen';
import { PrivacySecurityScreen } from './components/PrivacySecurityScreen';
import { PreferencesScreen } from './components/PreferencesScreen';
import { SurveyManagementScreen } from './components/SurveyManagementScreen';
import { EditTaskScreen } from './components/EditTaskScreen';
import { LoginActivityScreen } from './components/LoginActivityScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { ResetPasswordOTPScreen } from './components/ResetPasswordOTPScreen';
=======
import { useAuth } from './contexts/AuthContext';
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('onboarding');
<<<<<<< HEAD
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(undefined);
=======
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [kycBasicInfo, setKycBasicInfo] = useState<any>(null);
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
  const [userType, setUserType] = useState('user'); // 'user' or 'company'
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [kycStatus, setKycStatus] = useState('pending');
  const [resetToken, setResetToken] = useState(undefined);
  const [resetEmail, setResetEmail] = useState(undefined);
  const [resetUserId, setResetUserId] = useState(undefined);

  // Check for reset token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const screen = urlParams.get('screen');
    if (token) {
      setResetToken(token);
      // Navigate to reset password screen if token exists
      if (screen === 'resetPassword' || token) {
        setCurrentScreen('resetPassword');
      }
    }
  }, []);

  const navigateTo = (screen: string, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      if (data.task) setSelectedTask(data.task);
      if (data.taskId) setSelectedTaskId(data.taskId);
      if (data.userType) setUserType(data.userType);
      if (data.status) setKycStatus(data.status);
<<<<<<< HEAD
      if (data.resetToken) setResetToken(data.resetToken);
      if (data.email) setResetEmail(data.email);
      if (data.userId) setResetUserId(data.userId);
=======
      if (data.basicInfo) setKycBasicInfo(data.basicInfo);
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
    }
    setShowScreenSelector(false);
    
    // Set default task for task-related screens if no task is provided
    if ((screen === 'taskDetails' || screen === 'submitSurvey') && !data?.task && !selectedTask) {
      setSelectedTask({
        id: '1',
        title: 'Samsung Galaxy S24 Ultra Survey',
        brand: 'Samsung Electronics',
        image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 250,
        deadline: 'Due in 3 days',
        category: 'tech',
        tag: 'Hot Task'
      });
    }

    // Auto-navigate authenticated users away from login/signup
    if (user && (screen === 'login' || screen === 'signup' || screen === 'onboarding')) {
      setCurrentScreen('home');
    }
  };

  // Auto-navigate based on auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#666666]">Loading...</div>
        </div>
      </div>
    );
  }

  const screens = [
    { id: 'onboarding', name: '1. Onboarding' },
    { id: 'login', name: '2. Login' },
    { id: 'signup', name: '3. Signup' },
    { id: 'otp', name: '4. OTP Verification' },
    { id: 'home', name: '5. Home' },
    { id: 'taskDetails', name: '6. Task Details' },
    { id: 'submitSurvey', name: '7. Submit Survey' },
    { id: 'myTasks', name: '8. My Tasks' },
    { id: 'wallet', name: '9. Wallet' },
    { id: 'withdraw', name: '10. Withdraw' },
    { id: 'companyDashboard', name: '11. Company Dashboard' },
    { id: 'profile', name: '12. Profile' },
    { id: 'editProfile', name: '12a. Edit Profile' },
    { id: 'withdrawRestriction', name: '13. Withdraw Restriction' },
    { id: 'kycBasicInfo', name: '14. KYC - Basic Info' },
    { id: 'kycDocument', name: '15. KYC - Document Upload' },
    { id: 'kycVerificationMethod', name: '16. KYC - Verification Method' },
    { id: 'kycStatus', name: '17a. KYC Status - Pending' },
    { id: 'kycStatusApproved', name: '17b. KYC Status - Approved' },
    { id: 'kycStatusRejected', name: '17c. KYC Status - Rejected' },
    { id: 'settings', name: '18. Settings' },
    { id: 'notifications', name: '19. Notifications' },
    { id: 'helpSupport', name: '20. Help & Support' },
    { id: 'terms', name: '21. Terms & Privacy' },
    { id: 'privacySecurity', name: '22. Privacy & Security' },
        { id: 'preferences', name: '23. Preferences' },
        { id: 'surveyManagement', name: '24. Survey Management' },
  ];

<<<<<<< HEAD
  const isNative = Capacitor.isNativePlatform();
  const isWeb = !isNative;
=======
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Global reCAPTCHA container */}
      <div id="recaptcha-container" style={{ display: 'none', position: 'fixed', top: '-9999px' }}></div>
      {/* Screen Selector Button */}
      <button
        onClick={() => setShowScreenSelector(!showScreenSelector)}
        className="fixed top-4 right-4 z-50 bg-[#6B4BFF] text-white px-6 py-3 rounded-[16px] shadow-lg hover:bg-[#5a3edb] transition-all"
      >
        📱 Screens
      </button>
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d

  return (
    <div className={`${isWeb ? 'min-h-screen bg-white flex items-center justify-center p-4' : 'h-screen bg-white'}`}>
      {/* Screen Selector Button - Only show in web */}
      {isWeb && (
        <>
          <button
            onClick={() => setShowScreenSelector(!showScreenSelector)}
            className="fixed top-4 right-4 z-50 bg-[#6B4BFF] text-white px-6 py-3 rounded-[16px] shadow-lg hover:bg-[#5a3edb] transition-all"
          >
            📱 Screens
          </button>

          {/* Screen Selector Dropdown */}
          {showScreenSelector && (
            <div className="fixed top-20 right-4 z-50 bg-white rounded-[20px] shadow-2xl p-4 w-64 max-h-[500px] overflow-y-auto">
              <h3 className="text-[#111111] mb-3 px-2">Navigate to Screen</h3>
              <div className="space-y-1">
                {screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => navigateTo(screen.id)}
                    className={`w-full text-left px-4 py-3 rounded-[12px] transition-all ${
                      currentScreen === screen.id
                        ? 'bg-[#6B4BFF] text-white'
                        : 'hover:bg-[#F6F6F9] text-[#111111]'
                    }`}
                  >
                    {screen.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile Frame - Only in web, full screen in native */}
      <div className={isWeb 
        ? "w-full max-w-[414px] h-[896px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-gray-800"
        : "w-full h-full bg-white overflow-hidden"
      }>
        {/* Screen Content */}
        <div className="h-full overflow-y-auto">
          {currentScreen === 'onboarding' && <OnboardingScreens onComplete={() => navigateTo('login')} />}
          {currentScreen === 'login' && <LoginScreen onNavigate={navigateTo} />}
          {currentScreen === 'signup' && <SignupScreen onNavigate={navigateTo} />}
          {currentScreen === 'otp' && <OTPScreen onNavigate={navigateTo} />}
          {currentScreen === 'home' && <HomeScreen onNavigate={navigateTo} />}
          {currentScreen === 'taskDetails' && <TaskDetailsScreen task={selectedTask} onNavigate={navigateTo} />}
          {currentScreen === 'submitSurvey' && <SubmitSurveyScreen task={selectedTask} onNavigate={navigateTo} />}
          {currentScreen === 'myTasks' && <MyTasksScreen onNavigate={navigateTo} />}
          {currentScreen === 'wallet' && <WalletScreen onNavigate={navigateTo} />}
          {currentScreen === 'withdraw' && <WithdrawScreen onNavigate={navigateTo} />}
          {currentScreen === 'companyDashboard' && <CompanyDashboard onNavigate={navigateTo} />}
          {currentScreen === 'profile' && <ProfileScreen onNavigate={navigateTo} />}
          {currentScreen === 'editProfile' && <EditProfileScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} />}
          {currentScreen === 'kycBasicInfo' && <KYCBasicInfoScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} />}
          {currentScreen === 'kycDocument' && <KYCDocumentScreen onNavigate={navigateTo} onBack={() => navigateTo('kycBasicInfo')} basicInfo={kycBasicInfo} />}
          {currentScreen === 'kycVerificationMethod' && <KYCVerificationMethodScreen onNavigate={navigateTo} onBack={() => navigateTo('kycDocument')} />}
          {currentScreen === 'kycStatus' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} status={kycStatus} />}
          {currentScreen === 'kycStatusApproved' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} status={'approved'} />}
          {currentScreen === 'kycStatusRejected' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} status={'rejected'} />}
          {currentScreen === 'withdrawRestriction' && <WithdrawRestrictionScreen onNavigate={navigateTo} onBack={() => navigateTo('wallet')} />}
          {currentScreen === 'settings' && <SettingsScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} />}
          {currentScreen === 'notifications' && <NotificationsScreen onNavigate={navigateTo} onBack={() => navigateTo('settings')} />}
          {currentScreen === 'helpSupport' && <HelpSupportScreen onNavigate={navigateTo} onBack={() => navigateTo('settings')} />}
          {currentScreen === 'terms' && <TermsPrivacyScreen onNavigate={navigateTo} onBack={() => navigateTo('settings')} />}
          {currentScreen === 'privacySecurity' && <PrivacySecurityScreen onNavigate={navigateTo} onBack={() => navigateTo('settings')} />}
          {currentScreen === 'preferences' && <PreferencesScreen onNavigate={navigateTo} onBack={() => navigateTo('settings')} />}
          {currentScreen === 'loginActivity' && <LoginActivityScreen onNavigate={navigateTo} onBack={() => navigateTo('privacySecurity')} />}
          {currentScreen === 'surveyManagement' && (
            <SurveyManagementScreen 
              onNavigate={navigateTo} 
              onBack={() => navigateTo('companyDashboard')}
              taskId={selectedTaskId || selectedTask?.id}
            />
          )}
          {currentScreen === 'editTask' && (
            <EditTaskScreen 
              onNavigate={navigateTo} 
              onBack={() => navigateTo('companyDashboard')}
              taskId={selectedTaskId || selectedTask?.id || 0}
            />
          )}
          {currentScreen === 'forgotPassword' && (
            <ForgotPasswordScreen 
              onNavigate={navigateTo} 
              onBack={() => navigateTo('login')}
            />
          )}
          {currentScreen === 'resetPasswordOTP' && (
            <ResetPasswordOTPScreen 
              onNavigate={navigateTo} 
              onBack={() => navigateTo('forgotPassword')}
              email={resetEmail || ''}
            />
          )}
          {currentScreen === 'resetPassword' && (
            <ResetPasswordScreen 
              onNavigate={navigateTo} 
              onBack={() => navigateTo('login')}
              resetToken={resetToken}
              userId={resetUserId}
              email={resetEmail}
            />
          )}
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}