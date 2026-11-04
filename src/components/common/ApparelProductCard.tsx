import React, { useState } from 'react';
import { Maximize2, Images, Sparkles, ShieldCheck, Eye, Tag } from 'lucide-react';
import type { ApparelProduct } from '../../types';

interface ApparelProductCardProps {
  product: ApparelProduct;
  onOpenGallery?: (product: ApparelProduct, initialIndex: number) => void;
  className?: string;
}

export const ApparelProductCard: React.FC<ApparelProductCardProps> = ({
  product,
  onOpenGallery,
  className = '',
}) => {
  // Extract all valid image URLs
  const imgList: string[] = (() => {
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (typeof product.images === 'string' && (product.images as string).trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    if (product.image_url) return [product.image_url];
    return [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
    ];
  })();

  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  const currentDisplayImg = imgList[activeImgIndex] || imgList[0];
  const categoryName = product.category_name || 'Streetwear Apparel';

  // Dynamic fabric/GSM spec note based on title/category for high-end feel
  const getGarmentSpec = () => {
    const titleLower = product.title.toLowerCase();
    if (titleLower.includes('shirt') || titleLower.includes('button')) return '100% French Oxford Cotton • Relaxed Fit';
    if (titleLower.includes('hoodie') || titleLower.includes('fleece')) return '450 GSM Heavyweight Fleece • Cut & Sew';
    if (titleLower.includes('jacket') || titleLower.includes('bomber')) return 'Water-Resistant Technical Nylon • Custom Lining';
    if (titleLower.includes('pant') || titleLower.includes('cargo')) return 'Heavyweight Twill • Utility Pockets';
    return '280 GSM Ring-Spun Cotton • Premium Screenprint';
  };

  return (
    <article
      className={`group relative liquid-glass bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4]/80 rounded-2xl overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-2xl hover:shadow-[0_30px_70px_rgba(0,0,0,0.95)] hover:-translate-y-2 ${className}`}
    >
      {/* Top Atmospheric Glow & 3D Border Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-black/40 pointer-events-none z-10" />

      {/* Main Scaled-Up Garment Visual Stage */}
      <div className="relative aspect-[3/4] min-h-[340px] sm:min-h-[380px] w-full bg-[#201C18] overflow-hidden border-b border-[#3A332D]">
        <img
          src={currentDisplayImg}
          alt={product.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 filter contrast-110 brightness-95"
        />

        {/* Ambient Dark Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-transparent to-black/50 opacity-90" />

        {/* Floating Top Header Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#101010]/90 text-[#F2EDE4] border border-[#F2EDE4]/30 backdrop-blur-md shadow-lg">
            <Sparkles className="w-3 h-3 text-[#D1C7BB]" />
            {categoryName}
          </span>

          {/* Tech Pack / Quality Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider bg-white/10 text-[#F2EDE4] border border-white/20 backdrop-blur-md shadow-md">
            <ShieldCheck className="w-3 h-3" /> Tech Pack Ready
          </span>
        </div>

        {/* Center Hover Action Button (Full Resolution Modal Trigger) */}
        {onOpenGallery && (
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery(product, activeImgIndex);
              }}
              className="pointer-events-auto px-5 py-2.5 rounded-full bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspect Fullscreen</span>
            </button>
          </div>
        )}

        {/* Bottom Multi-Angle Thumbnail Bar (Interactive Angle Pickers) */}
        {imgList.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-xl bg-[#101010]/85 backdrop-blur-md border border-[#3A332D] shadow-xl">
            <span className="text-[8px] font-mono text-[#A99E92] uppercase tracking-wider px-1.5 shrink-0 flex items-center gap-1">
              <Images className="w-3 h-3 text-[#F2EDE4]" /> Angles ({imgList.length}):
            </span>
            {imgList.map((thumbUrl, tIdx) => (
              <button
                key={tIdx}
                type="button"
                onMouseEnter={() => setActiveImgIndex(tIdx)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImgIndex(tIdx);
                  if (onOpenGallery) onOpenGallery(product, tIdx);
                }}
                className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  activeImgIndex === tIdx
                    ? 'border-[#F2EDE4] ring-2 ring-[#F2EDE4]/50 scale-105 shadow-md'
                    : 'border-[#3A332D] opacity-60 hover:opacity-100'
                }`}
                title={`View angle ${tIdx + 1}`}
              >
                <img src={thumbUrl} alt="angle thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information & Editorial Technical Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative z-20">
        <div className="space-y-2">
          <h4
            onClick={() => onOpenGallery && onOpenGallery(product, activeImgIndex)}
            className="font-editorial-heading font-black text-lg md:text-xl text-[#F2EDE4] group-hover:text-[#F2EDE4] transition-colors leading-tight cursor-pointer line-clamp-1"
            title={product.title}
          >
            {product.title}
          </h4>

          {/* Garment Fabric & Cut Spec Note */}
          <p className="text-[11px] font-mono text-[#A99E92] flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-[#D1C7BB]" />
            {getGarmentSpec()}
          </p>

          {/* Description if present */}
          {product.description && (
            <p className="text-xs text-[#D1C7BB]/80 leading-relaxed font-light line-clamp-2 pt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Footer with Details button */}
        <div className="pt-3 border-t border-[#3A332D] flex items-center justify-end text-xs">
          <button
            type="button"
            onClick={() => onOpenGallery && onOpenGallery(product, activeImgIndex)}
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F2EDE4] group-hover:text-[#F2EDE4] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </button>
        </div>
      </div>
    </article>
  );
};

