import { Clock, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    brand: string;
    image: string;
    reward: number;
    deadline: string;
    category: string;
    tag?: string;
  };
  onViewDetails: (task: any) => void;
  compact?: boolean;
}

export function TaskCard({ task, onViewDetails, compact = false }: TaskCardProps) {
  if (compact) {
    return (
      <div 
        onClick={() => onViewDetails(task)}
        className="bg-white rounded-[20px] shadow-md p-4 min-w-[280px] cursor-pointer hover:shadow-lg transition-all"
      >
        <div className="flex gap-3">
          <ImageWithFallback
            src={task.image}
            alt={task.title}
            className="w-20 h-20 rounded-[16px] object-cover"
          />
          <div className="flex-1">
            <h3 className="text-[#111111] line-clamp-2 mb-1">{task.title}</h3>
            <p className="text-[#666666] text-sm mb-2">{task.brand}</p>
            <div className="flex items-center justify-between">
              <span className="text-[#22C55E]">₹{task.reward}</span>
              <ArrowRight className="w-5 h-5 text-[#6B4BFF]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] shadow-md p-4 hover:shadow-lg transition-all">
      <div className="flex gap-3">
        <ImageWithFallback
          src={task.image}
          alt={task.title}
          className="w-24 h-24 rounded-[16px] object-cover flex-shrink-0"
        />
        <div className="flex-1 flex flex-col">
          {task.tag && (
            <span className="inline-block bg-[#FFB93F] text-white px-3 py-1 rounded-full text-xs mb-2 self-start">
              {task.tag}
            </span>
          )}
          <h3 className="text-[#111111] line-clamp-2 mb-1">{task.title}</h3>
          <p className="text-[#666666] text-sm mb-2">{task.brand}</p>
          
          <div className="flex items-center gap-2 text-sm text-[#666666] mb-3 mt-auto">
            <Clock className="w-4 h-4" />
            <span>{task.deadline}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-[#666666]">Reward</p>
          <p className="text-[#22C55E]">₹{task.reward}</p>
        </div>
        <Button size="sm" onClick={() => onViewDetails(task)}>
          Write Review
        </Button>
      </div>
    </div>
  );
}
