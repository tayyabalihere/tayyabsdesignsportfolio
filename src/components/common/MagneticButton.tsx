import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  icon?: 'arrow-up-right' | 'arrow-right';
  id?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon = 'arrow-up-right',
  id,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  let variantStyles = '';
  if (variant === 'primary') {
    variantStyles =
      'bg-[#D96A3B] text-[#101010] hover:bg-[#D1C7BB] shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]';
  } else if (variant === 'secondary') {
    variantStyles =
      'liquid-glass bg-[#171614] text-[#F2EDE4] border border-[#3A332D] hover:border-[#F2EDE4]/60 hover:bg-[#201C18]';
  } else {
    variantStyles =
      'bg-transparent text-[#F2EDE4] border border-[#F2EDE4]/30 hover:border-[#F2EDE4] hover:bg-[#F2EDE4]/10';
  }

  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out',
      }}
      className={`group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all duration-300 cursor-pointer ${variantStyles} ${className}`}
    >
      <span className="relative z-10">{children}</span>

      {icon === 'arrow-up-right' && (
        <ArrowUpRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      )}
      {icon === 'arrow-right' && (
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
      )}
    </button>
  );
};

