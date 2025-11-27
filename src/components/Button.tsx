import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  onClick,
  disabled = false,
  icon
}: ButtonProps) {
  const baseStyles = "rounded-[16px] flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 font-semibold tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#6B4BFF] to-[#8B6BFF] text-white shadow-lg shadow-[#6B4BFF]/30 hover:shadow-xl hover:shadow-[#6B4BFF]/40 hover:from-[#5a3edb] hover:to-[#7a5aef]",
    secondary: "bg-gradient-to-r from-[#FFB93F] to-[#FFCA6F] text-white shadow-lg shadow-[#FFB93F]/30 hover:shadow-xl hover:shadow-[#FFB93F]/40 hover:from-[#f0aa2e] hover:to-[#ffbf5e]",
    outline: "border-2 border-[#6B4BFF] text-[#6B4BFF] hover:bg-[#6B4BFF]/5 hover:border-[#5a3edb]",
    ghost: "text-[#6B4BFF] hover:bg-[#6B4BFF]/5"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3.5",
    lg: "px-8 py-4"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}