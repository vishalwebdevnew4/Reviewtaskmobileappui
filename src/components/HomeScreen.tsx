
import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { WalletCard } from './WalletCard';
import { CategoryChip } from './CategoryChip';
import { TaskCard } from './TaskCard';
import { useAuth } from '../contexts/AuthContext';
import { getTasksByCategory, getFeaturedTasks, Task } from '../services/taskService';
import { getUserEarnings } from '../services/userService';
import { Bell, Search, Smartphone, UtensilsCrossed, Heart, Shirt, Laptop, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [featuredTasks, setFeaturedTasks] = useState<Task[]>([]);
  const [latestTasks, setLatestTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', icon: <Briefcase className="w-5 h-5" />, label: 'All' },
    { id: 'tech', icon: <Smartphone className="w-5 h-5" />, label: 'Tech' },
    { id: 'food', icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Food' },
    { id: 'health', icon: <Heart className="w-5 h-5" />, label: 'Health' },
    { id: 'fashion', icon: <Shirt className="w-5 h-5" />, label: 'Fashion' },
    { id: 'apps', icon: <Laptop className="w-5 h-5" />, label: 'Apps' },
  ];


  useEffect(() => {
    // Only load tasks if user is authenticated
    if (user) {
      loadTasks();
      loadBalance();
    } else {
      // If not authenticated, stop loading
      setLoading(false);
      setFeaturedTasks([]);
      setLatestTasks([]);
    }
  }, [activeCategory, user]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Load tasks without timeout race - let Firestore handle its own timeouts
      const [featured, latest] = await Promise.all([
        getFeaturedTasks(),
        getTasksByCategory(activeCategory),
      ]);
      
      setFeaturedTasks(featured);
      setLatestTasks(latest);
      
      // Log for debugging
      if (featured.length === 0 && latest.length === 0) {
        console.log('No tasks found. You may need to seed tasks in Firestore.');
        console.log('💡 Run seedTasks() in the console (admin required) or see SEED_TASKS.md');
      } else {
        console.log(`Loaded ${featured.length} featured and ${latest.length} latest tasks`);
      }
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      
      // Check for specific error types
      if (error.message?.includes('index')) {
        toast.error('Database index missing. Please deploy Firestore indexes.');
        console.error('💡 Run: firebase deploy --only firestore:indexes');
      } else if (error.message?.includes('permission')) {
        toast.error('Permission denied. Please check your authentication.');
      } else if (error.message?.includes('offline') || error.code === 'unavailable') {
        toast.error('You are offline. Tasks will load when connection is restored.');
        console.warn('Offline mode: Tasks will be available when online');
      } else {
        // Don't show error toast for "no tasks" - it's expected if database is empty
        if (!error.message?.includes('No tasks')) {
          toast.error(error.message || 'Failed to load tasks');
        }
      }
      
      // Set empty arrays on error (graceful degradation)
      setFeaturedTasks([]);
      setLatestTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async () => {
    if (!user) return;
    try {
      const earnings = await getUserEarnings(user.uid);
      setBalance(earnings.availableBalance);
    } catch (error) {
      // Silent fail for balance
    }
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  return (
    <div className="h-full bg-[#F6F6F9] relative flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>

            <h1 className="text-[#111111]">
              Hi, {user?.displayName || 'User'} 👋
            </h1>
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

      {featuredTasks.length > 0 && (
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#111111]">Featured Tasks</h2>
          <button className="text-[#6B4BFF] text-sm">View All</button>
        </div>
          {loading ? (
            <div className="text-center py-8 text-[#666666]">Loading tasks...</div>
          ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {featuredTasks.map((task) => (
            <TaskCard
              key={task.id}
                  task={{
                    ...task,
                    deadline: formatDeadline(task.deadline),
                  }}
              onViewDetails={(task) => onNavigate('taskDetails', { task })}
              compact
            />
          ))}
        </div>
          )}
      </div>
      )}

      {/* Latest Tasks */}
      <div className="px-6 pb-6">

        <h2 className="text-[#111111] mb-4">Latest Tasks</h2>
        {loading ? (
          <div className="text-center py-8 text-[#666666]">Loading tasks...</div>
        ) : latestTasks.length === 0 ? (
          <div className="text-center py-8 text-[#666666]">No tasks available</div>
        ) : (
        <div className="space-y-4">
          {latestTasks.map((task) => (
            <TaskCard
              key={task.id}
                task={{
                  ...task,
                  deadline: formatDeadline(task.deadline),
                }}
              onViewDetails={(task) => onNavigate('taskDetails', { task })}
            />
          ))}
        </div>
        )}
      </div>

      </div>

      {/* Navigation - Sticky at bottom */}
      <Navigation active="home" onNavigate={onNavigate} />
    </div>
  );
}
