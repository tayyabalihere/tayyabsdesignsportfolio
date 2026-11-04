import React, { useState } from 'react';

interface DimensionalHeadingProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  eyebrow?: string;
  subtitle?: string;
}

export const DimensionalHeading: React.FC<DimensionalHeadingProps> = ({
  children,
  as: Component = 'h2',
  className = '',
  eyebrow,
  subtitle,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="space-y-3 relative inline-block text-left"
    >
      {eyebrow && (
        <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D96A3B] block flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D96A3B] animate-pulse" />
          {eyebrow}
        </span>
      )}

      <Component
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(10px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
        }}
        className={`font-editorial-heading font-black tracking-tight text-[#F2EDE4] transition-transform duration-300 relative select-none ${className}`}
      >
        {/* Layer 1: 3D Depth Extrusion Shadow Layer */}
        <span
          aria-hidden="true"
          className="absolute top-1 left-1 text-[#3A332D] opacity-60 pointer-events-none select-none"
          style={{ transform: 'translateZ(-15px)' }}
        >
          {children}
        </span>

        {/* Layer 2: Main Metallic Surface Heading */}
        <span className="relative z-10 metallic-shine-anim block drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {children}
        </span>
      </Component>

      {subtitle && (
        <p className="text-xs sm:text-sm text-[#A99E92] max-w-lg leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};


