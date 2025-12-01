
import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Button } from './Button';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';

import { getUserEarnings, getEarningsByCategory } from '../services/userService';
import { getUserReviews } from '../services/reviewService';
import { getUserWithdrawals } from '../services/withdrawalService';
import { toast } from 'sonner';

interface WalletScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const { user } = useAuth();

  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    availableBalance: 0,
    pendingEarnings: 0,
    withdrawnAmount: 0,
  });
  const [earningsData, setEarningsData] = useState<Array<{ name: string; value: number; color: string }>>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [earningsData, categoryEarnings, reviews, withdrawals] = await Promise.all([
        getUserEarnings(user.uid),
        getEarningsByCategory(user.uid),
        getUserReviews(user.uid),
        getUserWithdrawals(user.uid),
      ]);

      setEarnings(earningsData);

      // Format category earnings for chart
      const chartData = Object.entries(categoryEarnings).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: value as number,
        color: getColorForCategory(name),
      }));
      setEarningsData(chartData);

      // Combine reviews and withdrawals into transactions
      const reviewTransactions = reviews
        .filter((r) => r.status === 'approved')
        .map((r) => ({
          id: r.id,
          type: 'credit' as const,
          title: `Review Reward`,
          amount: r.rewardAmount,
          date: formatDate(r.createdAt),
          status: 'completed',
        }));

      const withdrawalTransactions = withdrawals.map((w) => ({
        id: w.id,
        type: 'debit' as const,
        title: `Withdrawn to ${w.method.toUpperCase()}`,
        amount: w.amount,
        date: formatDate(w.requestedAt),
        status: w.status,
      }));

      const allTransactions = [...reviewTransactions, ...withdrawalTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10); // Show last 10 transactions

      setTransactions(allTransactions);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };


  const getColorForCategory = (category: string): string => {
    const colors: Record<string, string> = {
      tech: '#6B4BFF',
      food: '#FFB93F',
      health: '#22C55E',
      fashion: '#EF4444',
      apps: '#8B5CF6',
    };
    return colors[category] || '#6B4BFF';
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full bg-[#F6F6F9] relative flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-6">
        <h1 className="text-[#111111] mb-6">Wallet</h1>

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Earnings</p>

              <h2 className="text-4xl">
                {loading ? '...' : `₹${earnings.totalEarnings.toLocaleString()}`}
              </h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {earnings.pendingEarnings > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
              <span>₹{earnings.pendingEarnings} pending approval</span>
          </div>
          )}
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#666666] text-sm mb-1">Available Balance</p>

              <h3 className="text-[#111111]">
                {loading ? '...' : `₹${earnings.availableBalance.toLocaleString()}`}
              </h3>
            </div>
            <Button
              size="sm"
              onClick={() => onNavigate('withdraw')}
              icon={<ArrowUpRight className="w-4 h-4" />}
              disabled={earnings.availableBalance < 100}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      {earningsData.length > 0 && (
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
      )}

      {/* Transaction History */}
      <div className="px-6 pb-6">
        <h2 className="text-[#111111] mb-4">Transaction History</h2>
        {loading ? (

          <div className="text-center py-8 text-[#666666]">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-[#666666]">No transactions yet</div>
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
      </div>

      {/* Navigation - Sticky at bottom */}
      <Navigation active="wallet" onNavigate={onNavigate} />
    </div>
  );
}