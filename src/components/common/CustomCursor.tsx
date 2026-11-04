import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    // Detect touch device or reduced motion preference
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchQuery.matches || reducedMotionQuery.matches) {
      setIsTouchDevice(true);
      return;
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering over element with data-cursor attribute or interactive element
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor') || '';
        setCursorText(text);
        setIsHovered(true);
      } else {
        const isInteractive = Boolean(
          target?.closest('a, button, input, select, textarea, [role="button"]')
        );
        setCursorText(isInteractive ? 'view' : '');
        setIsHovered(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const updatePosition = () => {
      // Smooth linear interpolation (lerp)
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      setPosition({ x: currentX, y: currentY });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {/* Outer Spec Ring */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 flex items-center justify-center ${
          isHovered
            ? 'w-14 h-14 border-[#F2EDE4] bg-[#F2EDE4]/10 backdrop-blur-xs scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            : 'w-8 h-8 border-[#D1C7BB]/50 bg-transparent'
        }`}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#F2EDE4] animate-fade-in">
            {cursorText}
          </span>
        )}
      </div>

      {/* Center Precision Silver Dot */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
          isHovered ? 'w-1 h-1 bg-[#F2EDE4]' : 'w-1.5 h-1.5 bg-[#D1C7BB] shadow-[0_0_8px_#F2EDE4]'
        }`}
      />
    </div>
  );
};

