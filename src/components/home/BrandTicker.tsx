import React from 'react';
import { ArrowUpRight, ShieldCheck, Repeat } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { BrandCard } from '../common/BrandCard';

interface BrandTickerProps {
  navigate: (path: string) => void;
}

export const BrandTicker: React.FC<BrandTickerProps> = ({ navigate }) => {
  const { brands } = useCMS();
  const featuredBrands = brands.filter((b) => b.featured).slice(0, 3);

  // Duplicate list for continuous infinite loop marquee
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="py-24 bg-[#101010] border-b border-[#3A332D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Callout Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#201C18] border border-[#3A332D] text-[#D1C7BB]">
            <ShieldCheck className="w-4 h-4 text-[#F2EDE4]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]">
              Proven Track Record Across Global Fashion
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
            50+ Brand Collaborations
          </h2>

          <p className="text-sm md:text-base text-[#B6AB9F] leading-relaxed">
            From independent boutique streetwear labels in Paris and Tokyo to high-volume athletic sportswear brands across North America and Dubai.
          </p>
        </div>

        {/* Continuous Animated Infinite Marquee Ticker */}
        <div className="mb-16 py-6 border-y border-[#3A332D] overflow-hidden relative">
          <div className="flex items-center gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
            {marqueeBrands.map((brand, idx) => (
              <button
                key={`${brand.id}-${idx}`}
                onClick={() => navigate(`/brands/${brand.slug}`)}
                className="group inline-flex items-center gap-3 px-5 py-2.5 rounded bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4] transition-all shrink-0 hover:scale-105"
              >
                <span className="w-7 h-7 rounded bg-[#201C18] text-[#D1C7BB] font-bold text-xs flex items-center justify-center border border-[#3A332D] group-hover:border-[#F2EDE4]">
                  {brand.logo || brand.name.substring(0, 2)}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D1C7BB] group-hover:text-[#F2EDE4]">
                  {brand.name}
                </span>
                <span className="text-[9px] text-[#B6AB9F] font-mono">({brand.location})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Repeat Collaborations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B6AB9F] flex items-center gap-2">
              <Repeat className="w-3.5 h-3.5 text-[#F2EDE4]" /> Selected Repeat Collaborations
            </span>
            <button
              onClick={() => navigate('/brands')}
              className="text-xs uppercase tracking-widest font-bold text-[#D1C7BB] hover:text-[#F2EDE4] flex items-center gap-1"
            >
              View All Brands ({brands.length}) <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} navigate={navigate} compact />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};


