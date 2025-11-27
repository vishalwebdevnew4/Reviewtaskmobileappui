import { Home, ListTodo, Wallet, User } from 'lucide-react';

interface NavigationProps {
  active: string;
  onNavigate: (screen: string) => void;
}

export function Navigation({ active, onNavigate }: NavigationProps) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'myTasks', icon: ListTodo, label: 'Tasks' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex items-center justify-around max-w-[414px] mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-[12px] transition-all"
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-[#6B4BFF]' : 'text-[#666666]'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs ${
                isActive ? 'text-[#6B4BFF]' : 'text-[#666666]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
