import React from 'react';

interface CategoryChipProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ icon, label, active = false, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 px-6 py-4 rounded-[16px] min-w-[80px]
        transition-all duration-200
        ${active 
          ? 'bg-[#6B4BFF] text-white shadow-lg shadow-[#6B4BFF]/30' 
          : 'bg-[#F6F6F9] text-[#666666]'
        }
      `}
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm whitespace-nowrap">{label}</span>
    </button>
  );
}
