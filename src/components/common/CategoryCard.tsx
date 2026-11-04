import React, { useState } from 'react';
import { ArrowUpRight, Flame, Compass, Type, Palette, Activity, Layers } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  navigate: (path: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, navigate }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 16, y: -y * 16 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const getCategoryIcon = () => {
    const slug = category.slug.toLowerCase();
    if (slug.includes('streetwear')) return <Flame className="w-4 h-4 text-[#F2EDE4]" />;
    if (slug.includes('cultural')) return <Compass className="w-4 h-4 text-[#F2EDE4]" />;
    if (slug.includes('typography')) return <Type className="w-4 h-4 text-[#F2EDE4]" />;
    if (slug.includes('illustration')) return <Palette className="w-4 h-4 text-[#F2EDE4]" />;
    if (slug.includes('jersey') || slug.includes('sports')) return <Activity className="w-4 h-4 text-[#F2EDE4]" />;
    return <Layers className="w-4 h-4 text-[#F2EDE4]" />;
  };

  return (
    <div
      data-cursor="explore"
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/work?category=${category.slug}`)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(12px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transformStyle: 'preserve-3d',
      }}
      className="category-card group relative h-80 rounded-xl overflow-hidden border border-[#3A332D] hover:border-[#F2EDE4]/60 transition-all duration-300 cursor-pointer liquid-glass bg-[#171614] shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)] flex flex-col justify-between p-6"
    >
      {/* Background Image Layer with Scale & Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={category.coverImage}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover opacity-35 group-hover:opacity-55 group-hover:scale-110 transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/70 to-transparent" />
      </div>

      {/* 3D Spatial Wireframe Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#F2EDE40a_1px,transparent_1px),linear-gradient(to_bottom,#F2EDE40a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

      {/* Top Floating Badge Row */}
      <div
        className="relative z-10 flex justify-between items-center transition-transform duration-300"
        style={{ transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)' }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101010]/80 border border-[#F2EDE4]/20 rounded-md backdrop-blur-md">
          {getCategoryIcon()}
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#F2EDE4] font-bold">
            {category.count} PROJECTS
          </span>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#101010]/80 border border-[#F2EDE4]/30 flex items-center justify-center text-[#F2EDE4] group-hover:bg-[#F2EDE4] group-hover:text-[#101010] transition-all shadow-md">
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Foreground Editorial Category Details */}
      <div
        className="relative z-10 space-y-2 transition-transform duration-300"
        style={{ transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)' }}
      >
        <span className="text-[9px] font-mono text-[#A99E92] uppercase tracking-widest block">
          SPATIAL GATEWAY // EXPLICIT SPECS
        </span>

        <h3 className="font-editorial-heading font-black text-2xl text-[#F2EDE4] group-hover:text-[#D1C7BB] transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-[#A99E92] group-hover:text-[#D1C7BB]/90 line-clamp-2 leading-relaxed font-light">
          {category.description}
        </p>
      </div>
    </div>
  );
};



