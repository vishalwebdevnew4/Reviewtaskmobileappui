import { useState } from 'react';
import { Navigation } from './Navigation';
import { StatusBadge } from './StatusBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MyTasksScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function MyTasksScreen({ onNavigate }: MyTasksScreenProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'approved' | 'rejected'>('submitted');

  const tasks = {
    pending: [
      {
        id: '1',
        title: 'Samsung Galaxy S24 Ultra Review',
        brand: 'Samsung Electronics',
        image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 250,
        date: 'Started today',
        status: 'pending' as const
      }
    ],
    submitted: [
      {
        id: '2',
        title: 'Wireless Noise Cancelling Headphones',
        brand: 'SoundMax Audio',
        image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 220,
        date: 'Submitted 2 hours ago',
        status: 'submitted' as const
      },
      {
        id: '3',
        title: 'Premium Skincare Product',
        brand: 'GlowUp Beauty',
        image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 200,
        date: 'Submitted yesterday',
        status: 'submitted' as const
      }
    ],
    approved: [
      {
        id: '4',
        title: 'Organic Restaurant Experience',
        brand: 'Green Bistro',
        image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 180,
        date: 'Approved 3 days ago',
        status: 'approved' as const
      },
      {
        id: '5',
        title: 'Fitness Tracker & Health App',
        brand: 'FitLife Tech',
        image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 170,
        date: 'Approved 5 days ago',
        status: 'approved' as const
      }
    ],
    rejected: [
      {
        id: '6',
        title: 'Designer Fashion Collection Review',
        brand: 'Urban Style Co.',
        image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
        reward: 190,
        date: 'Rejected 1 week ago',
        status: 'rejected' as const
      }
    ]
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: tasks.pending.length },
    { id: 'submitted', label: 'Submitted', count: tasks.submitted.length },
    { id: 'approved', label: 'Approved', count: tasks.approved.length },
    { id: 'rejected', label: 'Rejected', count: tasks.rejected.length },
  ];

  const currentTasks = tasks[activeTab];

  return (
    <div className="h-full bg-[#F6F6F9] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4">
        <h1 className="text-[#111111] mb-6">My Tasks</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-6 py-3 rounded-[12px] whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-[#6B4BFF] text-white'
                  : 'bg-[#F6F6F9] text-[#666666]'
                }
              `}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 py-6">
        {currentTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-[#111111] mb-2">No tasks yet</h3>
            <p className="text-[#666666]">
              {activeTab === 'pending' && 'Start a task to see it here'}
              {activeTab === 'submitted' && 'Submit your first review'}
              {activeTab === 'approved' && 'No approved tasks yet'}
              {activeTab === 'rejected' && 'No rejected tasks'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onNavigate('taskDetails', { task })}
              >
                <div className="flex gap-3">
                  <ImageWithFallback
                    src={task.image}
                    alt={task.title}
                    className="w-20 h-20 rounded-[16px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[#111111] line-clamp-2 flex-1">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-[#666666] text-sm mb-2">{task.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#666666]">{task.date}</span>
                      <span className="text-[#22C55E]">₹{task.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation active="myTasks" onNavigate={onNavigate} />
    </div>
  );
}
