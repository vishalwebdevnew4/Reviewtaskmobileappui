import { useState } from 'react';
import { OnboardingScreens } from './components/OnboardingScreens';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { OTPScreen } from './components/OTPScreen';
import { HomeScreen } from './components/HomeScreen';
import { TaskDetailsScreen } from './components/TaskDetailsScreen';
import { SubmitReviewScreen } from './components/SubmitReviewScreen';
import { MyTasksScreen } from './components/MyTasksScreen';
import { WalletScreen } from './components/WalletScreen';
import { WithdrawScreen } from './components/WithdrawScreen';
import { CompanyDashboard } from './components/CompanyDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { KYCBasicInfoScreen } from './components/KYCBasicInfoScreen';
import { KYCDocumentScreen } from './components/KYCDocumentScreen';
import { KYCVerificationMethodScreen } from './components/KYCVerificationMethodScreen';
import { KYCStatusScreen } from './components/KYCStatusScreen';
import { WithdrawRestrictionScreen } from './components/WithdrawRestrictionScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [selectedTask, setSelectedTask] = useState(null);
  const [userType, setUserType] = useState('user'); // 'user' or 'company'
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const navigateTo = (screen: string, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      if (data.task) setSelectedTask(data.task);
      if (data.userType) setUserType(data.userType);
      if (data.status) setKycStatus(data.status);
    }
    setShowScreenSelector(false);
    
    // Set default task for task-related screens if no task is provided
    if ((screen === 'taskDetails' || screen === 'submitReview') && !data?.task && !selectedTask) {
      setSelectedTask({
        id: '1',
        title: 'Samsung Galaxy S24 Ultra Review',
        brand: 'Samsung Electronics',
        image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 250,
        deadline: 'Due in 3 days',
        category: 'tech',
        tag: 'Hot Task'
      });
    }
  };

  const screens = [
    { id: 'onboarding', name: '1. Onboarding' },
    { id: 'login', name: '2. Login' },
    { id: 'signup', name: '3. Signup' },
    { id: 'otp', name: '4. OTP Verification' },
    { id: 'home', name: '5. Home' },
    { id: 'taskDetails', name: '6. Task Details' },
    { id: 'submitReview', name: '7. Submit Review' },
    { id: 'myTasks', name: '8. My Tasks' },
    { id: 'wallet', name: '9. Wallet' },
    { id: 'withdraw', name: '10. Withdraw' },
    { id: 'companyDashboard', name: '11. Company Dashboard' },
    { id: 'profile', name: '12. Profile' },
    { id: 'withdrawRestriction', name: '13. Withdraw Restriction' },
    { id: 'kycBasicInfo', name: '14. KYC - Basic Info' },
    { id: 'kycDocument', name: '15. KYC - Document Upload' },
    { id: 'kycVerificationMethod', name: '16. KYC - Verification Method' },
    { id: 'kycStatus', name: '17a. KYC Status - Pending' },
    { id: 'kycStatusApproved', name: '17b. KYC Status - Approved' },
    { id: 'kycStatusRejected', name: '17c. KYC Status - Rejected' },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Screen Selector Button */}
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

      {/* Mobile Frame */}
      <div className="w-full max-w-[414px] h-[896px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative border-8 border-gray-800">
        {/* Screen Content */}
        <div className="h-full overflow-y-auto">
          {currentScreen === 'onboarding' && <OnboardingScreens onComplete={() => navigateTo('login')} />}
          {currentScreen === 'login' && <LoginScreen onNavigate={navigateTo} />}
          {currentScreen === 'signup' && <SignupScreen onNavigate={navigateTo} />}
          {currentScreen === 'otp' && <OTPScreen onNavigate={navigateTo} />}
          {currentScreen === 'home' && <HomeScreen onNavigate={navigateTo} />}
          {currentScreen === 'taskDetails' && <TaskDetailsScreen task={selectedTask} onNavigate={navigateTo} />}
          {currentScreen === 'submitReview' && <SubmitReviewScreen task={selectedTask} onNavigate={navigateTo} />}
          {currentScreen === 'myTasks' && <MyTasksScreen onNavigate={navigateTo} />}
          {currentScreen === 'wallet' && <WalletScreen onNavigate={navigateTo} />}
          {currentScreen === 'withdraw' && <WithdrawScreen onNavigate={navigateTo} />}
          {currentScreen === 'companyDashboard' && <CompanyDashboard onNavigate={navigateTo} />}
          {currentScreen === 'profile' && <ProfileScreen onNavigate={navigateTo} />}
          {currentScreen === 'kycBasicInfo' && <KYCBasicInfoScreen onNavigate={navigateTo} onBack={() => navigateTo('profile')} />}
          {currentScreen === 'kycDocument' && <KYCDocumentScreen onNavigate={navigateTo} onBack={() => navigateTo('kycBasicInfo')} />}
          {currentScreen === 'kycVerificationMethod' && <KYCVerificationMethodScreen onNavigate={navigateTo} onBack={() => navigateTo('kycDocument')} />}
          {currentScreen === 'kycStatus' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('home')} status='pending' />}
          {currentScreen === 'kycStatusApproved' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('home')} status={'approved'} />}
          {currentScreen === 'kycStatusRejected' && <KYCStatusScreen onNavigate={navigateTo} onBack={() => navigateTo('home')} status={'rejected'} />}
          {currentScreen === 'withdrawRestriction' && <WithdrawRestrictionScreen onNavigate={navigateTo} onBack={() => navigateTo('wallet')} />}
        </div>
      </div>
    </div>
  );
}