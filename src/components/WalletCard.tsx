import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from './Button';

interface WalletCardProps {
  balance: number;
  onWithdraw: () => void;
}

export function WalletCard({ balance, onWithdraw }: WalletCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#6B4BFF] to-[#8B6BFF] rounded-[24px] p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-sm opacity-90">Available Balance</span>
        </div>
        <TrendingUp className="w-5 h-5 opacity-70" />
      </div>
      
      <div className="mb-6">
        <h2 className="text-4xl mb-1">₹{balance.toLocaleString()}</h2>
        <p className="text-sm opacity-80">+₹450 this week</p>
      </div>
      
      <Button 
        variant="secondary" 
        fullWidth
        onClick={onWithdraw}
        icon={<ArrowUpRight className="w-5 h-5" />}
      >
        Withdraw Money
      </Button>
    </div>
  );
}
