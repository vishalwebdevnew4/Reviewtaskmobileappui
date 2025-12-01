import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { WalletCard } from './WalletCard';
import { CategoryChip } from './CategoryChip';
import { TaskCard } from './TaskCard';
import { useAuth } from '../contexts/AuthContext';
import { taskQueries, walletQueries } from '../db/queries';
import { Bell, Search, Smartphone, UtensilsCrossed, Heart, Shirt, Laptop, Briefcase } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Get user's first name or default
  const userName = user?.name?.split(' ')[0] || 'User';

  useEffect(() => {
    if (user?.id) {
      // Load all tasks from database
      const loadedTasks = taskQueries.getAllTasks(activeCategory === 'all' ? undefined : activeCategory);
      setAllTasks(loadedTasks);
      
      // Filter tasks based on search query
      let filteredTasks = loadedTasks;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredTasks = loadedTasks.filter(task => 
          task.title?.toLowerCase().includes(query) ||
          task.brand?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.category?.toLowerCase().includes(query)
        );
      }
      setTasks(filteredTasks);
      
      // Load wallet balance
      const walletBalance = walletQueries.getBalance(user.id);
      setBalance(walletBalance);
    }
    setLoading(false);
  }, [user, activeCategory, searchQuery]);

  const categories = [
    { id: 'all', icon: <Briefcase className="w-5 h-5" />, label: 'All' },
    { id: 'tech', icon: <Smartphone className="w-5 h-5" />, label: 'Tech' },
    { id: 'food', icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Food' },
    { id: 'health', icon: <Heart className="w-5 h-5" />, label: 'Health' },
    { id: 'fashion', icon: <Shirt className="w-5 h-5" />, label: 'Fashion' },
    { id: 'apps', icon: <Laptop className="w-5 h-5" />, label: 'Apps' },
  ];

  return (
    <div className="h-full bg-[#F6F6F9] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#111111]">Hi, {userName} 👋</h1>
            <p className="text-[#666666]">Ready to earn today?</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-[#666666]" />
            </button>
            <button className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-[#666666]" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></div>
            </button>
          </div>
          {showSearch && (
            <div className="mt-4">
              <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-3">
                <Search className="w-5 h-5 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#111111] placeholder:text-[#666666]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[#666666] hover:text-[#111111]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Card */}
        <WalletCard 
          balance={balance} 
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
          {tasks.length > 0 && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#111111]">Available Tasks</h2>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="text-[#6B4BFF] text-sm"
                >
                  View All
                </button>
              </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {tasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={(task) => onNavigate('taskDetails', { task })}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Tasks */}
      <div className="px-6 pb-6">
        <h2 className="text-[#111111] mb-4">All Tasks</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-[#111111] mb-2">No tasks available</h3>
            <p className="text-[#666666]">Check back later for new review tasks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={(task) => onNavigate('taskDetails', { task })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation active="home" onNavigate={onNavigate} />
    </div>
  );
}
