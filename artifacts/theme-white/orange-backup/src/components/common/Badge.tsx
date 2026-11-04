import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'silver' | 'outline' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'outline', className = '' }) => {
  let styles = 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-xs transition-colors inline-flex items-center gap-1.5 ';

  if (variant === 'silver') {
    styles += 'bg-[#D96A3B] text-[#101010]';
  } else if (variant === 'dark') {
    styles += 'bg-[#201C18] text-[#D1C7BB] border border-[#3A332D]';
  } else {
    styles += 'bg-transparent text-[#D1C7BB] border border-[#F2EDE4]/25 hover:border-[#F2EDE4]/60';
  }

  return <span className={`${styles} ${className}`}>{children}</span>;
};


