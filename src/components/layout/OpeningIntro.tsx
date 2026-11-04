import React, { useState, useEffect } from 'react';
import { Logo } from '../common/Logo';

export const OpeningIntro: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [show, setShow] = useState<boolean>(() => {
    return !sessionStorage.getItem('tayyabs_intro_played');
  });

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      handleComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [show]);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('tayyabs_intro_played', 'true');
      if (onComplete) onComplete();
    }, 400);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#101010] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-grain opacity-50 pointer-events-none" />

      {/* Glowing white aura behind logo */}
      <div className="absolute w-96 h-96 bg-[#F2EDE4]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        {/* Animated Official Emblem Logo Reveal */}
        <div className="mb-6 animate-[scaleIn_1.2s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <Logo size={90} variant="glow" animated />
        </div>

        {/* Subtitle tag */}
        <p className="text-xs uppercase tracking-[0.4em] text-[#B6AB9F] mb-4 animate-fade-in-slide">
          Independent Apparel Designer • 50+ Brand Collaborations
        </p>

        {/* Wordmark with metallic masking shine */}
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter metallic-shine-anim font-editorial-heading mb-4">
          TAYYABS.DESIGNS
        </h1>

        {/* Tagline */}
        <p className="text-sm md:text-base text-[#D1C7BB]/80 tracking-widest font-light">
          DESIGNING IDENTITY INTO EVERY THREAD.
        </p>

        {/* Progress Bar */}
        <div className="w-48 h-0.5 bg-[#29231F] mx-auto mt-8 overflow-hidden rounded-full border border-[#F2EDE4]/20">
          <div className="h-full bg-gradient-to-r from-[#B6AB9F] to-[#F2EDE4] animate-[progress_2.2s_ease-in-out_forwards]" />
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 text-xs tracking-widest uppercase text-[#B6AB9F] hover:text-[#F2EDE4] transition-colors flex items-center gap-2 border border-[#3A332D] px-3 py-1.5 rounded"
      >
        Skip Intro <span className="text-[#F2EDE4]">→</span>
      </button>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};


