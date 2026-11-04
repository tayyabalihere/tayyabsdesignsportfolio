import React, { useState } from 'react';
import { Quote, CheckCircle, ArrowUpRight } from 'lucide-react';
import type { Testimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  navigate?: (path: string) => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, navigate }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  if (!testimonial.verified) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
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
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(15px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transformStyle: 'preserve-3d',
      }}
      className="liquid-glass bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4]/60 p-6 md:p-8 rounded-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-xl group"
    >
      <Quote className="w-12 h-12 text-[#F2EDE4]/10 absolute top-6 right-6 pointer-events-none group-hover:text-[#F2EDE4]/20 transition-colors" />

      <div className="relative z-10 mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#F2EDE4] bg-[#101010] px-3 py-1 border border-[#3A332D] rounded-md shadow-md">
            <CheckCircle className="w-3 h-3 text-[#F2EDE4]" /> VERIFIED CLIENT FEEDBACK
          </span>
        </div>
        <p className="text-sm md:text-base text-[#D1C7BB] italic leading-relaxed font-serif">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="pt-4 border-t border-[#3A332D] flex items-center justify-between relative z-10">
        <div>
          <h4 className="font-editorial-heading font-bold text-sm text-[#F2EDE4]">
            {testimonial.clientName}
          </h4>
          <p className="text-xs text-[#A99E92]">
            {testimonial.clientRole} • <span className="text-[#F2EDE4] font-bold">{testimonial.brandName}</span>
          </p>
        </div>

        {testimonial.projectId && navigate && (
          <button
            type="button"
            onClick={() => navigate(`/work/${testimonial.projectId}`)}
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-[#A99E92] hover:text-[#F2EDE4] transition-colors"
          >
            Project <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};



