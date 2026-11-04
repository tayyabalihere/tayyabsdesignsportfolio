import React, { useEffect, useState } from 'react';

interface SpatialPageTransitionProps {
  children: React.ReactNode;
  currentPath: string;
}

export const SpatialPageTransition: React.FC<SpatialPageTransitionProps> = ({ children, currentPath }) => {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [displayChildren, setDisplayChildren] = useState<React.ReactNode>(children);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 180); // Short 180ms transition duration

    return () => clearTimeout(timer);
  }, [currentPath, children]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Spatial Silver Line Transition Swipe Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex flex-col justify-between">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#F2EDE4] to-transparent animate-[swipe_0.3s_ease-in-out] shadow-[0_0_20px_#F2EDE4]" />
          <div className="w-full h-full bg-[#101010]/40 backdrop-blur-xs transition-opacity duration-200" />
        </div>
      )}

      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-70 scale-[0.99] filter blur-[1px]' : 'opacity-100 scale-100 filter blur-0'}`}>
        {displayChildren}
      </div>

      <style>{`
        @keyframes swipe {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

