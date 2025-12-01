import React from 'react';
import { Button } from './Button';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { userTaskQueries } from '../db/queries';

interface TaskDetailsScreenProps {
  task: any;
  onNavigate: (screen: string, data?: any) => void;
}

export function TaskDetailsScreen({ task, onNavigate }: TaskDetailsScreenProps) {
  const { user } = useAuth();
  
  if (!task) return null;

  const handleSubmitSurvey = () => {
    if (user?.id && task.id) {
      // Assign task to user if not already assigned
      userTaskQueries.assignTask(user.id, parseInt(task.id));
    }
    onNavigate('submitSurvey', { task });
  };

  const requirements = [
    'Write a detailed survey response (minimum 50 words)',
    'Rate the product honestly (1-5 stars)',
    'Upload at least 2 photos',
    'Submit within the deadline'
  ];

  return (
    <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <h2 className="text-[#111111]">Task Details</h2>
      </div>

      {/* Product Image */}
      <div className="relative">
        <ImageWithFallback
          src={task.image}
          alt={task.title}
          className="w-full h-64 object-cover"
        />
        {task.tag && (
          <div className="absolute top-4 right-4 bg-[#FFB93F] text-white px-4 py-2 rounded-full shadow-lg">
            {task.tag}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Title & Brand */}
        <div>
          <p className="text-[#666666] mb-1">{task.brand}</p>
          <h1 className="text-[#111111] mb-4">{task.title}</h1>
          
          {/* Reward Badge */}
          <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 px-6 py-3 rounded-[16px]">
            <span className="text-[#22C55E]">Reward Amount</span>
            <span className="text-[#22C55E]">₹{task.reward}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-3">Task Description</h3>
          <p className="text-[#666666]">
            We need your honest opinion about this product. Your survey response will help us improve our products and services. 
            Please provide detailed feedback about your experience, including what you liked and what could be improved.
          </p>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Requirements</h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#6B4BFF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666]">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-white rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#FF9500]" />
            <h3 className="text-[#111111]">Deadline</h3>
          </div>
          <p className="text-[#666666] ml-8">{task.deadline}</p>
        </div>

        {/* Important Note */}
        <div className="bg-[#FFB93F]/10 rounded-[20px] p-6 flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#FFB93F] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#FFB93F] mb-1">Important</h3>
            <p className="text-[#666666] text-sm">
              Fake or spam survey responses will result in account suspension. Please provide genuine feedback only.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <div className="max-w-[414px] mx-auto">
          <Button 
            fullWidth
            onClick={handleSubmitSurvey}
          >
            Submit Survey
          </Button>
        </div>
      </div>
    </div>
  );
}
