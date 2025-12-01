import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { StatusBadge } from './StatusBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { userTaskQueries, surveyQueries } from '../db/queries';

interface MyTasksScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function MyTasksScreen({ onNavigate }: MyTasksScreenProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted' | 'approved' | 'rejected'>('submitted');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [user, activeTab]);

  const loadTasks = () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      let userTasks: any[] = [];
      
      if (activeTab === 'pending') {
        const assignedTasks = userTaskQueries.getUserTasks(user.id, 'assigned');
        userTasks = assignedTasks.map(ut => ({
          id: ut.task_id,
          title: ut.title,
          brand: ut.brand,
          image: ut.image,
          reward: ut.reward,
          date: new Date(ut.assigned_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          status: 'pending'
        }));
      } else {
        // Get surveys and map to tasks
        const surveys = surveyQueries.getUserSurveys(user.id);
        const statusMap: Record<string, string> = {
          'pending': 'submitted',
          'approved': 'approved',
          'rejected': 'rejected'
        };
        
        userTasks = surveys
          .filter(s => statusMap[s.status] === activeTab)
          .map(survey => {
            const task = taskQueries.getTaskById(survey.task_id);
            return {
              id: survey.task_id,
              title: survey.task_title || task?.title,
              brand: survey.brand || task?.brand,
              image: task?.image || null,
              reward: survey.reward || task?.reward || 0,
              date: new Date(survey.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              status: activeTab
            };
          });
      }
      
      setTasks(userTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: activeTab === 'pending' ? tasks.length : 0 },
    { id: 'submitted', label: 'Submitted', count: activeTab === 'submitted' ? tasks.length : 0 },
    { id: 'approved', label: 'Approved', count: activeTab === 'approved' ? tasks.length : 0 },
    { id: 'rejected', label: 'Rejected', count: activeTab === 'rejected' ? tasks.length : 0 },
  ];

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
            <h3 className="text-[#111111] mb-2">No tasks yet</h3>
            <p className="text-[#666666]">
              {activeTab === 'pending' && 'Start a task to see it here'}
              {activeTab === 'submitted' && 'Submit your first survey'}
              {activeTab === 'approved' && 'No approved tasks yet'}
              {activeTab === 'rejected' && 'No rejected tasks'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onNavigate('taskDetails', { task })}
              >
                <div className="flex gap-3">
                  {task.image ? (
                    <ImageWithFallback
                      src={task.image}
                      alt={task.title}
                      className="w-20 h-20 rounded-[16px] object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-[#F6F6F9] rounded-[16px] flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[#111111] line-clamp-2 flex-1">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="text-[#666666] text-sm mb-2">{task.brand || 'Unknown Brand'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#666666]">{task.date}</span>
                      {task.reward > 0 && <span className="text-[#22C55E]">₹{task.reward}</span>}
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
