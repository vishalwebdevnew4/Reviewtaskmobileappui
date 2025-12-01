import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { walletQueries, surveyQueries } from '../db/queries';

interface WalletScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadWalletData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWalletData = () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const currentBalance = walletQueries.getBalance(user.id);
      setBalance(currentBalance);
      
      // Calculate total earned from all credit transactions
      const allTransactions = walletQueries.getTransactions(user.id, 1000);
      const total = allTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalEarned(total);
      
      // Get recent transactions
      const recentTransactions = walletQueries.getTransactions(user.id, 20);
      setTransactions(recentTransactions.map(t => ({
        id: t.id,
        type: t.type,
        title: t.description || (t.type === 'credit' ? 'Survey Reward' : 'Withdrawal'),
        amount: t.amount,
        date: new Date(t.created_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        status: t.status || (t.type === 'credit' ? 'completed' : 'pending')
      })));
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setLoading(false);
    }
  };
  // Calculate earnings by category from surveys
  const earningsData = [
    { name: 'Tech', value: 0, color: '#6B4BFF' },
    { name: 'Food', value: 0, color: '#FFB93F' },
    { name: 'Health', value: 0, color: '#22C55E' },
    { name: 'Fashion', value: 0, color: '#EF4444' },
  ];

  return (
    <div className="h-full bg-[#F6F6F9] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <h1 className="text-[#111111] mb-6">Wallet</h1>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Earnings</p>
              <h2 className="text-4xl">₹{totalEarned.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm opacity-75">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#666666] text-sm mb-1">Available Balance</p>
              <h3 className="text-[#111111]">₹{balance.toLocaleString()}</h3>
            </div>
            <Button
              size="sm"
              onClick={() => onNavigate('withdraw')}
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="px-6 py-6">
        <h2 className="text-[#111111] mb-4">Earnings by Category</h2>
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <div className="flex items-center">
            {/* Chart */}
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={earningsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {earningsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {earningsData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-[#666666] text-sm">{item.name}</span>
                  </div>
                  <span className="text-[#111111]">₹{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6 pb-6">
        <h2 className="text-[#111111] mb-4">Transaction History</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[20px]">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-[#666666]" />
            </div>
            <h3 className="text-[#111111] mb-2">No transactions yet</h3>
            <p className="text-[#666666]">Complete surveys to start earning</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-[20px] p-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit'
                      ? 'bg-[#22C55E]/10'
                      : 'bg-[#EF4444]/10'
                  }`}
                >
                  {transaction.type === 'credit' ? (
                    <ArrowDownRight className="w-5 h-5 text-[#22C55E]" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-[#EF4444]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#111111]">{transaction.title}</h3>
                  <p className="text-sm text-[#666666]">{transaction.date}</p>
                  {transaction.type === 'debit' && transaction.status !== 'completed' && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                      transaction.status === 'pending' ? 'bg-[#FFB93F]/10 text-[#FFB93F]' :
                      transaction.status === 'processing' ? 'bg-[#6B4BFF]/10 text-[#6B4BFF]' :
                      transaction.status === 'failed' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                      'bg-[#22C55E]/10 text-[#22C55E]'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className={
                      transaction.type === 'credit'
                        ? 'text-[#22C55E]'
                        : 'text-[#EF4444]'
                    }
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation active="wallet" onNavigate={onNavigate} />
    </div>
  );
}