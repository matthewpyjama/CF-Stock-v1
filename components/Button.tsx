import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "w-full py-4 px-6 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-900/20",
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700",
    danger: "bg-red-900/50 text-red-200 border border-red-800 hover:bg-red-900/80",
    ghost: "bg-transparent text-zinc-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-wait' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
      ) : children}
    </button>
  );
};