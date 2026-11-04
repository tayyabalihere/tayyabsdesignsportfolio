import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { BrandWall3D } from '../components/brands/BrandWall3D';

interface BrandsPageProps {
  navigate: (path: string) => void;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ navigate }) => {
  const { brands, collections } = useCMS();

  // Active live drops across all brands
  const activeDropsCount = collections.filter((c) => c.is_active).length;

  // Extract brand names for marquee animation
  const marqueeBrandNames = useMemo(() => {
    if (!brands || brands.length === 0) return [];
    const names = brands.map((b) => b.name.toUpperCase());
    return [...names, ...names];
  }, [brands]);

  return (
    <div className="portfolio-page pt-28 pb-28 bg-[#101010] min-h-screen text-[#D1C7BB]">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#D96A3B]/[0.05] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header Section */}
        <div className="border-b border-[#3A332D] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass bg-[#171614] border border-[#3A332D] text-[#F2EDE4] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D1C7BB]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]">
                Tayyabs.Designs Client Exhibition Roster
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight leading-[0.95]">
              50+ Global Brand Collaborations
            </h1>

            <p className="text-sm md:text-base text-[#A99E92] leading-relaxed max-w-xl font-light">
              From independent boutique streetwear labels in Paris and Tokyo to high-volume athletic sportswear teams and cultural diaspora houses across North America, Europe, and Asia.
            </p>
          </div>

          {/* Quick High-Impact Studio Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 liquid-glass bg-[#171614] p-5 rounded-2xl border border-[#3A332D] shadow-xl">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A99E92] block">
                Collaborations
              </span>
              <span className="text-2xl lg:text-3xl font-mono font-bold text-[#F2EDE4]">
                50+
              </span>
              <span className="text-[10px] text-[#A99E92] block font-light mt-0.5">
                Global labels
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A99E92] block">
                Global Footprint
              </span>
              <span className="text-2xl lg:text-3xl font-mono font-bold text-[#F2EDE4]">
                10+
              </span>
              <span className="text-[10px] text-[#A99E92] block font-light mt-0.5">
                Fashion capitals
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A99E92] block">
                Active In Studio
              </span>
              <span className="text-2xl lg:text-3xl font-mono font-bold text-[#F2EDE4]">
                {activeDropsCount}
              </span>
              <span className="text-[10px] text-[#A99E92] block font-light mt-0.5">
                Live drops
              </span>
            </div>
          </div>
        </div>

        {/* Brand Names Marquee Banner */}
        <div className="py-3.5 px-4 rounded-xl liquid-glass bg-[#171614]/80 border border-[#3A332D] overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-8 animate-[marquee_45s_linear_infinite] whitespace-nowrap">
            {marqueeBrandNames.map((brandName, idx) => (
              <div key={idx} className="inline-flex items-center gap-2.5 text-[11px] font-mono tracking-widest uppercase text-[#A99E92]">
                <span className="text-[#F2EDE4]">✦</span>
                <span className="text-[#F2EDE4] font-bold">{brandName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Wall Exhibition Component */}
        <BrandWall3D brands={brands} navigate={navigate} />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};



