import React, { useState } from 'react';
import { ArrowUpRight, Layers, ChevronDown, ChevronUp, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { Brand, Project, ApparelProduct } from '../../types';
import { Badge } from './Badge';
import { ApparelProductCard } from './ApparelProductCard';
import { ArticleGalleryModal } from './ArticleGalleryModal';

interface BrandCardProps {
  brand: Brand;
  navigate: (path: string) => void;
  compact?: boolean;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, navigate, compact = false }) => {
  const { collections, projects } = useCMS();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedGalleryProduct, setSelectedGalleryProduct] = useState<{
    product: ApparelProduct;
    initialIndex: number;
  } | null>(null);

  const brandCollections = collections.filter((c) => c.brand_id === brand.id && c.is_active);
  const activeCount = brandCollections.length;

  const matchingProject = projects.find(
    (p: Project) =>
      p.brandId === brand.id ||
      (p.brandName && p.brandName.toLowerCase().trim() === brand.name.toLowerCase().trim())
  );

  const getSubGridImages = (b: Brand): string[] => {
    if (b.galleryImages && b.galleryImages.length >= 3) {
      return b.galleryImages.slice(0, 3);
    }

    const imgs: string[] = [];
    if (b.galleryImages && b.galleryImages.length > 0) {
      imgs.push(...b.galleryImages);
    }

    if (brandCollections.length > 0) {
      brandCollections.forEach((c) => {
        if (c.banner_image && !imgs.includes(c.banner_image)) imgs.push(c.banner_image);
      });
    }

    if (matchingProject) {
      if (matchingProject.mockups?.heroMockup && !imgs.includes(matchingProject.mockups.heroMockup))
        imgs.push(matchingProject.mockups.heroMockup);
      if (matchingProject.mockups?.frontMockup && !imgs.includes(matchingProject.mockups.frontMockup))
        imgs.push(matchingProject.mockups.frontMockup);
      if (matchingProject.mockups?.backMockup && !imgs.includes(matchingProject.mockups.backMockup))
        imgs.push(matchingProject.mockups.backMockup);
      if (matchingProject.finalDesigns?.frontArtwork && !imgs.includes(matchingProject.finalDesigns.frontArtwork))
        imgs.push(matchingProject.finalDesigns.frontArtwork);
      if (matchingProject.finalDesigns?.closeups?.[0] && !imgs.includes(matchingProject.finalDesigns.closeups[0]))
        imgs.push(matchingProject.finalDesigns.closeups[0]);
    }

    const fallbacks = [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    ];

    let fIdx = 0;
    while (imgs.length < 3) {
      imgs.push(fallbacks[fIdx % fallbacks.length]);
      fIdx++;
    }

    return imgs.slice(0, 3);
  };

  const subGridImages = getSubGridImages(brand);

  // Extract products from live collections or construct fallback apparel products from project designs
  const activeProducts: ApparelProduct[] = (() => {
    const productsFromCMS: ApparelProduct[] = [];
    brandCollections.forEach((col) => {
      if (col.products && col.products.length > 0) {
        col.products.forEach((p) => {
          if (p.is_published) productsFromCMS.push(p);
        });
      }
    });

    if (productsFromCMS.length > 0) return productsFromCMS;

    // Fallback: Generate structured product representations from project mockups & final designs
    if (matchingProject) {
      const fallbackList: ApparelProduct[] = [];
      const heroImg = matchingProject.mockups?.heroMockup || matchingProject.mockups?.frontMockup;
      const backImg = matchingProject.mockups?.backMockup || matchingProject.finalDesigns?.backArtwork;
      const detailImg = matchingProject.finalDesigns?.closeups?.[0] || matchingProject.mockups?.detailCloseups?.[0];

      if (heroImg) {
        fallbackList.push({
          id: `${brand.id}-p1`,
          collection_id: 'col-1',
          category_id: 'cat-1',
          category_name: matchingProject.category || 'Streetwear Shirt & Oversized Tee',
          title: `${brand.name} Heavyweight Graphic Tee`,
          slug: 'heavyweight-tee',
          description: matchingProject.projectOverview?.brief || 'Custom oversized streetwear garment with technical screenprint artwork.',
          images: [heroImg, backImg, detailImg].filter(Boolean) as string[],
          is_published: true,
          price: 85,
        });
      }

      if (matchingProject.mockups?.modelMockups?.[0] || matchingProject.finalDesigns?.frontArtwork) {
        fallbackList.push({
          id: `${brand.id}-p2`,
          collection_id: 'col-1',
          category_id: 'cat-2',
          category_name: 'Cut & Sew Hoodie',
          title: `${brand.name} Atelier Fleece Hoodie`,
          slug: 'fleece-hoodie',
          description: '450 GSM luxury french terry fleece hoodie with custom silicone hardware.',
          images: [
            matchingProject.mockups?.modelMockups?.[0] || matchingProject.finalDesigns?.frontArtwork || heroImg,
            detailImg || heroImg,
          ].filter(Boolean) as string[],
          is_published: true,
          price: 135,
        });
      }

      return fallbackList;
    }

    return [];
  })();

  return (
    <>
      <article
        className={`brand-card group relative liquid-glass bg-[#171614] border rounded-2xl transition-all duration-500 flex flex-col justify-between shadow-xl ${
          isExpanded
            ? 'border-[#F2EDE4] bg-[#201C18] shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
            : 'border-[#3A332D] hover:border-[#F2EDE4]/70 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Top 3-Image Sub-Grid Visual Stage */}
        <div
          onClick={() => navigate(`/brands/${brand.slug}`)}
          className={`relative ${compact ? '' : 'p-3.5 sm:p-4.5 md:p-5'} rounded-t-2xl overflow-hidden bg-[#101010] cursor-pointer`}
        >
          {/* Sub-grid of 3 image fields */}
          <div className={compact ? 'aspect-[4/3] w-full' : 'grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 h-64 sm:h-72 md:h-80 lg:h-96 w-full'}>
            {(compact ? subGridImages.slice(0, 1) : subGridImages).map((imgUrl, imgIdx) => (
              <div
                key={imgIdx}
                className={`relative ${compact ? '' : 'rounded-xl border border-[#3A332D]'} overflow-hidden bg-[#201C18] group/slot h-full`}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={imgUrl}
                  alt={`${brand.name} visual ${imgIdx + 1}`}
                  onError={(e) => {
                    const fallback = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800';
                    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                  }}
                  className={`w-full h-full ${compact && imgUrl.startsWith('/uploads/') ? 'object-contain' : 'object-cover'} object-center group-hover/slot:scale-105 transition-transform duration-500`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#101010]/80 via-transparent to-transparent ${compact ? 'opacity-30' : ''}`} />
                {!compact && <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold text-white/80 bg-black/75 px-2 py-0.5 rounded backdrop-blur-xs">
                  0{imgIdx + 1}
                </span>}
              </div>
            ))}
          </div>

          {/* Watermark Monogram Overlay */}
          <div className="absolute right-6 bottom-4 text-6xl sm:text-7xl md:text-8xl font-editorial-heading font-black text-white/[0.04] select-none pointer-events-none tracking-tighter">
            {brand.logo || brand.name.substring(0, 2)}
          </div>

          {/* Top Status & Monogram Badges */}
          <div className={`absolute ${compact ? 'top-3 left-3 right-3' : 'top-6 left-6 right-6'} flex items-center justify-between z-10 pointer-events-none`}>
            <div className="w-10 h-10 rounded-xl bg-[#101010]/90 backdrop-blur-md border border-[#F2EDE4]/30 flex items-center justify-center font-editorial-heading font-black text-sm text-[#F2EDE4] shadow-xl group-hover:border-[#F2EDE4] transition-colors">
              {brand.logo || brand.name.substring(0, 2)}
            </div>

            {activeCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-[#F2EDE4] border border-white/20 backdrop-blur-md shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2EDE4]" />
                {activeCount} {activeCount === 1 ? 'Live Drop' : 'Live Drops'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#101010]/85 text-[#A99E92] border border-[#3A332D] backdrop-blur-md">
                Verified Partner
              </span>
            )}
          </div>

          {/* Bottom Location & Collaboration Stamp */}
          <div className={`absolute ${compact ? 'bottom-3 left-3 right-3 flex-wrap text-[9px]' : 'bottom-6 left-6 text-xs'} flex items-center gap-2 z-10 font-mono text-[#D1C7BB] pointer-events-none`}>
            <span className="bg-[#101010]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3A332D] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A99E92]" /> {brand.location}
            </span>
            <span className="bg-[#101010]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#3A332D] text-[#A99E92]">
              {brand.collaborationPeriod}
            </span>
          </div>
        </div>

        {/* Card Body Information */}
        <div className={`${compact ? 'p-4 space-y-3' : 'p-6 sm:p-7 md:p-8 space-y-4 sm:space-y-5'} flex-1 flex flex-col justify-between`}>
          <div className={compact ? 'space-y-2' : 'space-y-3'}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  className={`font-editorial-heading font-black ${compact ? 'text-base line-clamp-1' : 'text-2xl sm:text-3xl'} text-[#F2EDE4] group-hover:text-[#F2EDE4] transition-colors tracking-tight cursor-pointer`}
                >
                  {brand.name}
                </h3>
                <p className={`${compact ? 'text-[9px] line-clamp-1' : 'text-xs'} text-[#A99E92] font-mono uppercase tracking-wider mt-1`}>
                  {brand.categories.join(' • ')}
                </p>
              </div>

              {!compact && <Badge variant="dark" className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] sm:text-xs bg-[#201C18] border-[#3A332D] px-3 py-1">
                <ShieldCheck className="w-4 h-4 text-[#D1C7BB]" />
                Verified
              </Badge>}
            </div>

            <p className={`${compact ? 'text-xs line-clamp-1' : 'text-xs sm:text-sm line-clamp-2'} text-[#D1C7BB] leading-relaxed font-light`}>
              {brand.description}
            </p>
          </div>

          {/* Collection & Breakdown Pills */}
          {!compact && brand.collectionsList &&
            brand.collectionsList.filter((c) => c.name.trim() || c.articleSummary.trim()).length > 0 && (
              <div className="bg-[#101010] border border-[#3A332D] p-4 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A99E92] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F2EDE4]" /> Featured Collection Breakdown:
                </span>
                <div className="space-y-1.5">
                  {brand.collectionsList
                    .filter((c) => c.name.trim() || c.articleSummary.trim())
                    .slice(0, 3)
                    .map((col, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono text-[#D1C7BB]">
                        <span className="font-bold text-[#F2EDE4] truncate max-w-[60%]">{col.name}</span>
                        <span className="text-[#A99E92] truncate max-w-[40%] text-right">{col.articleSummary}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Interactive Expand Collection Dropdown Bar */}
          <div className={`${compact ? 'pt-3' : 'pt-4'} border-t border-[#3A332D] space-y-3`}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                className={`flex-1 min-w-0 ${compact ? 'py-2.5 px-3 text-[10px]' : 'py-3.5 px-5 text-xs sm:text-sm'} rounded-xl border font-mono font-bold uppercase tracking-wider flex items-center justify-between transition-all duration-300 cursor-pointer ${
                  isExpanded
                    ? 'bg-[#D96A3B] text-[#101010] border-[#F2EDE4] shadow-[0_5px_20px_rgba(255,255,255,0.3)]'
                    : 'bg-[#101010] text-[#D1C7BB] border-[#3A332D] hover:border-[#F2EDE4] hover:bg-[#201C18]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isExpanded ? 'text-[#101010]' : 'text-[#D1C7BB]'}`} />
                  {isExpanded ? 'Close collection' : compact ? 'View collection' : 'Expand Collection Dropdown'}
                </span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 animate-bounce" />}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/brands/${brand.slug}`)}
                className="p-3.5 rounded-xl bg-[#101010] border border-[#3A332D] hover:border-[#F2EDE4] text-[#F2EDE4] transition-all cursor-pointer hover:scale-105"
                title="View Full Brand Archive"
              >
                <ArrowUpRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CREATIVE EXPANDED COLLECTION DROPDOWN DRAWER */}
        {/* ============================================================ */}
        {isExpanded && (
          <div className="p-6 bg-[#101010] border-t border-[#F2EDE4]/20 rounded-b-2xl space-y-6 animate-fadeIn">
            {/* Dropdown Header Bar */}
            <div className="flex items-center justify-between border-b border-[#3A332D] pb-4">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                  ATELIER COLLECTION EXHIBITION
                </span>
                <h4 className="font-editorial-heading font-black text-xl text-[#F2EDE4] flex items-center gap-2 mt-0.5">
                  {brand.name} Collection Articles
                  {activeProducts.length > 0 && (
                    <span className="text-[10px] font-mono text-[#D1C7BB] bg-white/10 px-2 py-0.5 rounded border border-white/20 font-normal">
                      {activeProducts.length} Items
                    </span>
                  )}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/brands/${brand.slug}`)}
                className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F2EDE4] hover:underline flex items-center gap-1"
              >
                View All Specs <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scaled-Up Creative Apparel Product Cards Grid */}
            {activeProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProducts.map((prod) => (
                  <ApparelProductCard
                    key={prod.id}
                    product={prod}
                    onOpenGallery={(productItem, idx) =>
                      setSelectedGalleryProduct({ product: productItem, initialIndex: idx })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-[#201C18] border border-[#3A332D] text-center space-y-3">
                <p className="text-xs text-[#A99E92] font-mono">
                  Collection drops currently under production NDA. Explore full brand case study.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  className="px-5 py-2.5 rounded-lg bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2"
                >
                  <span>Explore Brand Page</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Full Resolution Gallery Modal */}
      <ArticleGalleryModal
        isOpen={Boolean(selectedGalleryProduct)}
        onClose={() => setSelectedGalleryProduct(null)}
        product={selectedGalleryProduct?.product || null}
        initialIndex={selectedGalleryProduct?.initialIndex || 0}
      />
    </>
  );
};

