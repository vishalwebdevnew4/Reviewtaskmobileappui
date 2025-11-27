import { useState } from 'react';
import { Navigation } from './Navigation';
import { WalletCard } from './WalletCard';
import { CategoryChip } from './CategoryChip';
import { TaskCard } from './TaskCard';
import { Bell, Search, Smartphone, UtensilsCrossed, Heart, Shirt, Laptop, Briefcase } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', icon: <Briefcase className="w-5 h-5" />, label: 'All' },
    { id: 'tech', icon: <Smartphone className="w-5 h-5" />, label: 'Tech' },
    { id: 'food', icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Food' },
    { id: 'health', icon: <Heart className="w-5 h-5" />, label: 'Health' },
    { id: 'fashion', icon: <Shirt className="w-5 h-5" />, label: 'Fashion' },
    { id: 'apps', icon: <Laptop className="w-5 h-5" />, label: 'Apps' },
  ];

  const featuredTasks = [
    {
      id: '1',
      title: 'Samsung Galaxy S24 Ultra Review',
      brand: 'Samsung Electronics',
      image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 250,
      deadline: 'Due in 3 days',
      category: 'tech',
      tag: 'Hot Task'
    },
    {
      id: '2',
      title: 'Organic Restaurant Experience',
      brand: 'Green Bistro',
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 180,
      deadline: 'Due in 5 days',
      category: 'food',
      tag: 'Quick Task'
    },
    {
      id: '3',
      title: 'Premium Skincare Product',
      brand: 'GlowUp Beauty',
      image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 200,
      deadline: 'Due in 2 days',
      category: 'health',
      tag: 'New'
    }
  ];

  const latestTasks = [
    {
      id: '4',
      title: 'Wireless Noise Cancelling Headphones',
      brand: 'SoundMax Audio',
      image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 220,
      deadline: 'Due in 4 days',
      category: 'tech'
    },
    {
      id: '5',
      title: 'Designer Fashion Collection Review',
      brand: 'Urban Style Co.',
      image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 190,
      deadline: 'Due in 6 days',
      category: 'fashion',
      tag: 'Popular'
    },
    {
      id: '6',
      title: 'Fitness Tracker & Health App',
      brand: 'FitLife Tech',
      image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      reward: 170,
      deadline: 'Due in 7 days',
      category: 'health'
    }
  ];

  return (
    <div className="h-full bg-[#F6F6F9] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#111111]">Hi, Vishal 👋</h1>
            <p className="text-[#666666]">Ready to earn today?</p>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-[#666666]" />
            </button>
            <button className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-[#666666]" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Wallet Card */}
        <WalletCard 
          balance={2450} 
          onWithdraw={() => onNavigate('withdraw')}
        />
      </div>

      {/* Categories */}
      <div className="px-6 py-6">
        <h2 className="text-[#111111] mb-4">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              icon={category.icon}
              label={category.label}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* Featured Tasks */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#111111]">Featured Tasks</h2>
          <button className="text-[#6B4BFF] text-sm">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {featuredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={(task) => onNavigate('taskDetails', { task })}
              compact
            />
          ))}
        </div>
      </div>

      {/* Latest Tasks */}
      <div className="px-6 pb-6">
        <h2 className="text-[#111111] mb-4">Latest Tasks</h2>
        <div className="space-y-4">
          {latestTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={(task) => onNavigate('taskDetails', { task })}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation active="home" onNavigate={onNavigate} />
    </div>
  );
}
