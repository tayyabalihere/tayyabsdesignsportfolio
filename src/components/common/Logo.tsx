import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: 'white' | 'silver' | 'metallic' | 'glow';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  variant = 'silver',
  animated = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${animated ? 'hover:scale-105' : ''} ${className}`}
    >
      <defs>
        {/* Monochromatic White/Grey Chrome Gradient */}
        <linearGradient id="logoSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2EDE4" />
          <stop offset="40%" stopColor="#E5E5E5" />
          <stop offset="70%" stopColor="#D1C7BB" />
          <stop offset="100%" stopColor="#B6AB9F" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#F2EDE4" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Main Tayyabs.Designs Geometric Logo Emblem */}
      <g
        fill={
          variant === 'white'
            ? '#F2EDE4'
            : variant === 'metallic' || variant === 'glow'
            ? 'url(#logoSilverGrad)'
            : '#F2EDE4'
        }
        filter={variant === 'glow' ? 'url(#logoGlow)' : undefined}
      >
        {/* Top Horizontal Bar & Main Left Outer Leg of T */}
        <path d="M 295 290 H 540 V 350 H 355 V 420 H 455 L 455 600 L 410 710 L 410 350 H 295 Z" />

        {/* Inner Parallel Corner Stroke */}
        <path d="M 295 365 H 410 V 645 L 455 600 V 350 H 540 V 290 H 410 Z" />

        {/* Outer Main T Block */}
        <polygon points="295,290 540,290 540,350 410,350 410,645 455,600 455,350 540,350 540,290" />
      </g>

      {/* Recreated Precise Geometric Vector Emblem of User's T-Logo */}
      <g
        fill={
          variant === 'white'
            ? '#F2EDE4'
            : variant === 'metallic' || variant === 'glow'
            ? 'url(#logoSilverGrad)'
            : '#F2EDE4'
        }
      >
        {/* Top Horizontal Bar */}
        <rect x="295" y="290" width="245" height="55" />
        
        {/* Inner L-Bar */}
        <rect x="295" y="365" width="115" height="55" />

        {/* Vertical Leg with 45-degree angle cut at bottom */}
        <polygon points="410,350 470,350 470,610 410,710" />

        {/* Parallel Inner Vertical Leg */}
        <polygon points="485,350 540,350 540,540 485,615" />

        {/* Top-Right Arrow Pointing Upward */}
        <polygon points="555,290 705,290 555,420" />
      </g>
    </svg>
  );
};


