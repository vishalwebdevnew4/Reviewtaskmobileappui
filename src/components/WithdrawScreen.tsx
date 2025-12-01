import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowLeft, Smartphone, Building2, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { walletQueries, kycQueries } from '../db/queries';

interface WithdrawScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function WithdrawScreen({ onNavigate }: WithdrawScreenProps) {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [accountDetails, setAccountDetails] = useState({
    upi: '',
    accountNumber: '',
    ifsc: '',
    paytm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycApproved, setKycApproved] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const currentBalance = walletQueries.getBalance(user.id);
      setBalance(currentBalance);
      
      // Check KYC status
      const kycInfo = kycQueries.getKYCInfo(user.id);
      setKycApproved(kycInfo?.status === 'approved');
    }
  }, [user]);

  const withdrawMethods = [
    { id: 'upi', icon: <Smartphone className="w-6 h-6" />, label: 'UPI', description: 'Instant transfer' },
    { id: 'bank', icon: <Building2 className="w-6 h-6" />, label: 'Bank Transfer', description: '1-2 business days' },
    { id: 'paytm', icon: <Wallet className="w-6 h-6" />, label: 'Paytm', description: 'Instant transfer' },
  ];

  const quickAmounts = balance > 0 ? [
    Math.min(500, balance),
    Math.min(1000, balance),
    Math.min(2000, balance),
    balance
  ].filter((amt, index, arr) => amt > 0 && arr.indexOf(amt) === index) : [];

  return (
    <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
        <button 
          onClick={() => onNavigate('wallet')}
          className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <h2 className="text-[#111111]">Withdraw Money</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* KYC Warning */}
        {!kycApproved && (
          <div className="bg-[#FFB93F]/10 border border-[#FFB93F] rounded-[20px] p-4 mb-4">
            <p className="text-sm text-[#FFB93F]">
              ⚠️ KYC verification required to withdraw. <button onClick={() => onNavigate('kycBasicInfo')} className="underline">Verify now</button>
            </p>
          </div>
        )}

        {/* Available Balance */}
        <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Available Balance</p>
          <h2 className="text-4xl">₹{balance.toLocaleString()}</h2>
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Enter Amount</label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4 mb-4">
            <span className="text-[#111111]">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (!val || parseFloat(val) <= balance) {
                  setAmount(val);
                  setError('');
                } else {
                  setError('Amount cannot exceed available balance');
                }
              }}
              placeholder="0"
              max={balance}
              className="flex-1 bg-transparent outline-none text-[#111111] text-2xl"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          {/* Quick Amount Buttons */}
          {quickAmounts.length > 0 && (
            <div className={`grid gap-2 ${quickAmounts.length === 4 ? 'grid-cols-4' : quickAmounts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-[#F6F6F9] rounded-[12px] py-3 text-[#111111] hover:bg-[#6B4BFF] hover:text-white transition-all"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Withdrawal Method */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Select Withdrawal Method</h3>
          <div className="space-y-3">
            {withdrawMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-[16px] border-2 transition-all
                  ${selectedMethod === method.id
                    ? 'border-[#6B4BFF] bg-[#6B4BFF]/5'
                    : 'border-gray-200 hover:border-[#6B4BFF]/50'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${selectedMethod === method.id
                    ? 'bg-[#6B4BFF] text-white'
                    : 'bg-[#F6F6F9] text-[#666666]'
                  }
                `}>
                  {method.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[#111111]">{method.label}</p>
                  <p className="text-sm text-[#666666]">{method.description}</p>
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedMethod === method.id
                    ? 'border-[#6B4BFF]'
                    : 'border-gray-300'
                  }
                `}>
                  {selectedMethod === method.id && (
                    <div className="w-3 h-3 bg-[#6B4BFF] rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Account Details */}
        {selectedMethod === 'upi' && (
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">UPI ID</label>
            <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <input
                type="text"
                value={accountDetails.upi}
                onChange={(e) => setAccountDetails({ ...accountDetails, upi: e.target.value })}
                placeholder="yourname@upi"
                className="flex-1 bg-transparent outline-none text-[#111111]"
              />
            </div>
          </div>
        )}

        {selectedMethod === 'bank' && (
          <div className="bg-white rounded-[20px] p-6 space-y-4">
            <div>
              <label className="block text-[#111111] mb-3">Account Number</label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <input
                  type="text"
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                  className="flex-1 bg-transparent outline-none text-[#111111]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#111111] mb-3">IFSC Code</label>
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
                <input
                  type="text"
                  value={accountDetails.ifsc}
                  onChange={(e) => setAccountDetails({ ...accountDetails, ifsc: e.target.value.toUpperCase() })}
                  placeholder="Enter IFSC code"
                  className="flex-1 bg-transparent outline-none text-[#111111]"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'paytm' && (
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Paytm Mobile Number</label>
            <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <span className="text-[#666666]">+91</span>
              <input
                type="tel"
                value={accountDetails.paytm}
                onChange={(e) => setAccountDetails({ ...accountDetails, paytm: e.target.value.replace(/\D/g, '').substring(0, 10) })}
                placeholder="Enter mobile number"
                className="flex-1 bg-transparent outline-none text-[#111111]"
                maxLength={10}
              />
            </div>
          </div>
        )}

        {/* Important Note */}
        <div className="bg-[#FFB93F]/10 rounded-[20px] p-6">
          <h3 className="text-[#FFB93F] mb-2">Important Notes</h3>
          <ul className="space-y-1 text-sm text-[#666666]">
            <li>• Minimum withdrawal: ₹100</li>
            <li>• Processing time varies by method</li>
            <li>• Ensure account details are correct</li>
          </ul>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <div className="max-w-[414px] mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-[16px]">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <Button 
            fullWidth
            onClick={() => {
              if (!user?.id) {
                setError('User not found');
                return;
              }

              if (!kycApproved) {
                setError('KYC verification required');
                onNavigate('kycBasicInfo');
                return;
              }

              const withdrawAmount = parseFloat(amount);
              if (!amount || withdrawAmount < 100) {
                setError('Minimum withdrawal is ₹100');
                return;
              }

              if (withdrawAmount > balance) {
                setError('Amount exceeds available balance');
                return;
              }

              // Validate account details
              if (selectedMethod === 'upi' && !accountDetails.upi.includes('@')) {
                setError('Please enter a valid UPI ID');
                return;
              }

              if (selectedMethod === 'bank' && (!accountDetails.accountNumber || !accountDetails.ifsc)) {
                setError('Please enter account number and IFSC code');
                return;
              }

              if (selectedMethod === 'paytm' && accountDetails.paytm.length !== 10) {
                setError('Please enter a valid 10-digit mobile number');
                return;
              }

              setLoading(true);
              setError('');

              try {
                const accountDetailsStr = selectedMethod === 'upi' 
                  ? accountDetails.upi 
                  : selectedMethod === 'bank'
                  ? `${accountDetails.accountNumber}|${accountDetails.ifsc}`
                  : accountDetails.paytm;

                // Add withdrawal transaction with status tracking
                walletQueries.addTransaction({
                  userId: user.id,
                  amount: withdrawAmount,
                  type: 'debit',
                  description: `Withdrawal via ${selectedMethod.toUpperCase()}`,
                  status: 'pending',
                  withdrawalMethod: selectedMethod,
                  accountDetails: accountDetailsStr
                });

                // Update balance
                setBalance(balance - withdrawAmount);
                
                // Show success and navigate
                setTimeout(() => {
                  onNavigate('wallet');
                }, 1000);
              } catch (err: any) {
                setError(err.message || 'Failed to process withdrawal');
                setLoading(false);
              }
            }}
            disabled={!amount || parseFloat(amount) < 100 || parseFloat(amount) > balance || loading || !kycApproved}
          >
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </Button>
        </div>
      </div>
    </div>
  );
}
