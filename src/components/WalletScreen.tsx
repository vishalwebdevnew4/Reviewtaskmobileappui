import { Navigation } from './Navigation';
import { Button } from './Button';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface WalletScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const earningsData = [
    { name: 'Tech', value: 850, color: '#6B4BFF' },
    { name: 'Food', value: 600, color: '#FFB93F' },
    { name: 'Health', value: 500, color: '#22C55E' },
    { name: 'Fashion', value: 500, color: '#EF4444' },
  ];

  const transactions = [
    {
      id: '1',
      type: 'credit',
      title: 'Samsung Galaxy Review',
      amount: 250,
      date: 'Today, 10:30 AM',
      status: 'completed'
    },
    {
      id: '2',
      type: 'debit',
      title: 'Withdrawn to UPI',
      amount: 1000,
      date: 'Yesterday, 3:45 PM',
      status: 'completed'
    },
    {
      id: '3',
      type: 'credit',
      title: 'Headphones Review',
      amount: 220,
      date: 'Nov 25, 2:15 PM',
      status: 'completed'
    },
    {
      id: '4',
      type: 'credit',
      title: 'Restaurant Review',
      amount: 180,
      date: 'Nov 24, 11:20 AM',
      status: 'completed'
    },
    {
      id: '5',
      type: 'credit',
      title: 'Skincare Product Review',
      amount: 200,
      date: 'Nov 23, 4:30 PM',
      status: 'completed'
    }
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
              <h2 className="text-4xl">₹12,450</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+₹450 this week</span>
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-[20px] p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#666666] text-sm mb-1">Available Balance</p>
              <h3 className="text-[#111111]">₹2,450</h3>
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
      </div>

      {/* Navigation */}
      <Navigation active="wallet" onNavigate={onNavigate} />
    </div>
  );
}