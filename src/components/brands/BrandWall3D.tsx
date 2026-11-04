import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowUpRight,
  Search,
  Sparkles,
  Flame,
  LayoutGrid,
  Rows3,
  Box,
  MapPin,
  Filter,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Eye,
} from 'lucide-react';
import type { Brand, Project } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { BrandCard } from '../common/BrandCard';

interface BrandWall3DProps {
  brands: Brand[];
  navigate: (path: string) => void;
}

// Curated pool of high-definition garment & artwork visuals for editorial display
const EDITORIAL_VISUALS_POOL = [
  '/uploads/rebel-x-makan-hero.png',
  '/uploads/persian-carpet-tee.png',
  '/uploads/palestine-bomber-jacket.png',
  '/uploads/elzari-spider-jersey.png',
  '/uploads/stray-pets-tee.png',
  '/uploads/truck-art-tee.png',
  '/uploads/rebel-x-makan-full-mockup.png',
];

const FALLBACK_GARMENT_VISUALS = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=1000',
];

export const BrandWall3D: React.FC<BrandWall3DProps> = ({ brands, navigate }) => {
  const { collections, projects } = useCMS();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyLiveDrops, setOnlyLiveDrops] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'lookbook' | 'runway' | 'spatial'>('lookbook');
  const [hoveredBrandId, setHoveredBrandId] = useState<string | null>(null);
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  const [activeVisualAngle, setActiveVisualAngle] = useState<'hero' | 'techpack' | 'detail'>('hero');

  // Extract unique categories across all brands
  const categories = useMemo(() => {
    return Array.from(new Set(brands.flatMap((b) => b.categories)));
  }, [brands]);

  // Featured spotlight brands (prefer brands with active collections or featured status)
  const spotlightBrands = useMemo(() => {
    const withLiveDrops = brands.filter((b) =>
      collections.some((c) => c.brand_id === b.id && c.is_active)
    );
    const featured = brands.filter((b) => b.featured);
    const combined = Array.from(new Set([...withLiveDrops, ...featured, ...brands]));
    return combined.slice(0, 5);
  }, [brands, collections]);

  const currentSpotlightBrand = spotlightBrands[selectedSpotlightIndex] || spotlightBrands[0] || brands[0];

  // Auto-rotate spotlight every 7 seconds unless hovered or manually changed
  useEffect(() => {
    if (!isAutoCycling || spotlightBrands.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedSpotlightIndex((prev) => (prev + 1) % spotlightBrands.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoCycling, spotlightBrands.length]);

  // Helper to resolve dynamic multi-angle visuals for current spotlight brand
  const getBrandVisualAngles = (brand: Brand) => {
    if (!brand) return { hero: FALLBACK_GARMENT_VISUALS[0], techpack: FALLBACK_GARMENT_VISUALS[1], detail: FALLBACK_GARMENT_VISUALS[2] };

    const matchingProject = projects.find(
      (p: Project) =>
        p.brandId === brand.id ||
        (p.brandName && p.brandName.toLowerCase().trim() === brand.name.toLowerCase().trim())
    );

    const brandCollections = collections.filter((c) => c.brand_id === brand.id && c.is_active);
    let collectionImg = '';
    if (brandCollections.length > 0 && brandCollections[0].banner_image) {
      collectionImg = brandCollections[0].banner_image;
    }

    const hero =
      collectionImg ||
      matchingProject?.mockups?.heroMockup ||
      matchingProject?.mockups?.frontMockup ||
      matchingProject?.finalDesigns?.frontArtwork ||
      EDITORIAL_VISUALS_POOL[0];

    const techpack =
      matchingProject?.finalDesigns?.backArtwork ||
      matchingProject?.mockups?.backMockup ||
      matchingProject?.finalDesigns?.frontArtwork ||
      EDITORIAL_VISUALS_POOL[1] ||
      FALLBACK_GARMENT_VISUALS[1];

    const detail =
      matchingProject?.finalDesigns?.closeups?.[0] ||
      matchingProject?.mockups?.detailCloseups?.[0] ||
      EDITORIAL_VISUALS_POOL[2] ||
      FALLBACK_GARMENT_VISUALS[2];

    return { hero, techpack, detail };
  };

  const currentVisuals = getBrandVisualAngles(currentSpotlightBrand);

  const getActiveVisualUrl = () => {
    if (activeVisualAngle === 'techpack') return currentVisuals.techpack;
    if (activeVisualAngle === 'detail') return currentVisuals.detail;
    return currentVisuals.hero;
  };

  // Helper to resolve standard visual for lookbook tiles
  const getBrandVisual = (brand: Brand): string => {
    const brandCollections = collections.filter((c) => c.brand_id === brand.id && c.is_active);
    if (brandCollections.length > 0 && brandCollections[0].banner_image) {
      return brandCollections[0].banner_image;
    }

    const matchingProject = projects.find(
      (p: Project) =>
        p.brandId === brand.id ||
        (p.brandName && p.brandName.toLowerCase().trim() === brand.name.toLowerCase().trim())
    );
    if (matchingProject) {
      if (matchingProject.mockups?.heroMockup) return matchingProject.mockups.heroMockup;
      if (matchingProject.mockups?.frontMockup) return matchingProject.mockups.frontMockup;
      if (matchingProject.finalDesigns?.frontArtwork) return matchingProject.finalDesigns.frontArtwork;
    }

    let hash = 0;
    for (let i = 0; i < brand.name.length; i++) {
      hash = (hash << 5) - hash + brand.name.charCodeAt(i);
      hash |= 0;
    }
    const poolIndex = Math.abs(hash) % EDITORIAL_VISUALS_POOL.length;
    return EDITORIAL_VISUALS_POOL[poolIndex] || FALLBACK_GARMENT_VISUALS[0];
  };

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const brandCollections = collections.filter((c) => c.brand_id === brand.id && c.is_active);
      const hasLiveDrops = brandCollections.length > 0;

      if (onlyLiveDrops && !hasLiveDrops) return false;

      const matchesSearch =
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === 'all' || brand.categories.includes(activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [brands, collections, searchQuery, activeCategory, onlyLiveDrops]);

  // Active brand for runway master-detail view
  const activeRunwayBrand = useMemo(() => {
    if (hoveredBrandId) {
      const found = filteredBrands.find((b) => b.id === hoveredBrandId);
      if (found) return found;
    }
    return filteredBrands[0] || brands[0];
  }, [hoveredBrandId, filteredBrands, brands]);

  return (
    <div className="space-y-12">
      {/* 1. ULTRA-CREATIVE 3D ISOMETRIC ATELIER SPOTLIGHT STAGE */}
      {currentSpotlightBrand && (
        <div
          onMouseEnter={() => setIsAutoCycling(false)}
          onMouseLeave={() => setIsAutoCycling(true)}
          className="relative rounded-3xl overflow-hidden border border-[#F2EDE4]/15 bg-[#171614] shadow-[0_35px_110px_rgba(0,0,0,0.95)] backdrop-blur-2xl group transition-all duration-500 hover:border-[#F2EDE4]/30"
        >
          {/* Top Auto-Cycle Progress Indicator Line */}
          {isAutoCycling && (
            <div className="absolute top-0 left-0 right-0 h-1 z-30 bg-[#3A332D] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white/20 via-[#F2EDE4] to-white/20 animate-[marquee_7s_linear_infinite]" />
            </div>
          )}

          {/* Glowing 3D Corner Frame Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D1C7BB]/50 rounded-tl-3xl z-20 pointer-events-none transition-all group-hover:w-10 group-hover:h-10 group-hover:border-[#F2EDE4]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D1C7BB]/50 rounded-tr-3xl z-20 pointer-events-none transition-all group-hover:w-10 group-hover:h-10 group-hover:border-[#F2EDE4]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D1C7BB]/50 rounded-bl-3xl z-20 pointer-events-none transition-all group-hover:w-10 group-hover:h-10 group-hover:border-[#F2EDE4]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D1C7BB]/50 rounded-br-3xl z-20 pointer-events-none transition-all group-hover:w-10 group-hover:h-10 group-hover:border-[#F2EDE4]" />

          {/* Ambient Glowing Atmosphere & 3D Isometric Grid Mesh */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[35rem] h-[35rem] rounded-full bg-[#D96A3B]/[0.06] blur-[160px] animate-pulse" />
            <div className="absolute -bottom-40 -right-40 w-[35rem] h-[35rem] rounded-full bg-[#D96A3B]/[0.04] blur-[160px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-white/[0.02] blur-[180px]" />
            
            {/* High-Tech Isometric Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#F2EDE408_1px,transparent_1px),linear-gradient(to_bottom,#F2EDE408_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Blurred Background Garment Canvas */}
            <img
              src={getActiveVisualUrl()}
              alt={currentSpotlightBrand.name}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_GARMENT_VISUALS[0]) e.currentTarget.src = FALLBACK_GARMENT_VISUALS[0];
              }}
              className="w-full h-full object-cover object-center opacity-25 blur-2xl scale-110 filter contrast-125 saturate-150 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171614] via-[#171614]/90 to-[#171614]/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-transparent to-[#171614]/70" />

            {/* Giant 3D Watermark Monogram */}
            <div className="absolute -right-12 -bottom-24 text-[18rem] md:text-[28rem] font-editorial-heading font-black text-white/[0.04] select-none tracking-tighter leading-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {currentSpotlightBrand.logo || currentSpotlightBrand.name.substring(0, 2)}
            </div>
          </div>

          <div className="relative z-10 p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row items-stretch justify-between gap-10">
            {/* Left Spotlight Narrative & 3D Specs Panel */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D96A3B] text-[#101010] shadow-[0_5px_20px_rgba(255,255,255,0.3)]">
                    <Sparkles className="w-3.5 h-3.5 text-[#101010]" /> Atelier Spotlight
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#201C18]/90 text-[#D1C7BB] border border-[#F2EDE4]/20 backdrop-blur-md shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D1C7BB]" /> Verified Client
                  </span>

                  <span className="text-[11px] font-mono text-[#A99E92] flex items-center gap-1.5 bg-[#101010]/90 px-3.5 py-1.5 rounded-full border border-[#3A332D] backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-[#A99E92]" /> {currentSpotlightBrand.location}
                  </span>

                  {/* Shuffle / Next Controls */}
                  <button
                    type="button"
                    onClick={() => setSelectedSpotlightIndex((prev) => (prev + 1) % spotlightBrands.length)}
                    className="p-2 rounded-full bg-[#201C18] border border-[#3A332D] hover:border-[#F2EDE4] text-[#A99E92] hover:text-[#F2EDE4] transition-all duration-300 ml-auto cursor-pointer shadow-md hover:scale-105"
                    title="Cycle Next Atelier"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Narrative */}
                <div>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight leading-[1.02] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    {currentSpotlightBrand.name}
                  </h2>
                  <p className="mt-4 text-sm md:text-base text-[#D1C7BB] font-light leading-relaxed max-w-xl">
                    {currentSpotlightBrand.description}
                  </p>
                </div>

                {/* 3D Inset Technical Metrics Cards */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#D1C7BB]/40 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300 group/metric">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Active Drops
                    </span>
                    <span className="text-base md:text-xl font-mono font-bold text-[#F2EDE4] flex items-center gap-1.5 mt-1">
                      {collections.filter((c) => c.brand_id === currentSpotlightBrand.id && c.is_active).length}
                      <span className="text-[10px] text-[#D1C7BB] font-normal bg-white/10 px-1.5 py-0.5 rounded border border-white/20">Live</span>
                    </span>
                  </div>

                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#F2EDE4]/30 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Collaboration Era
                    </span>
                    <span className="text-base md:text-xl font-mono font-bold text-[#F2EDE4] mt-1 block">
                      {currentSpotlightBrand.collaborationPeriod || '2024 - 2025'}
                    </span>
                  </div>

                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#F2EDE4]/30 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Primary Silhouette
                    </span>
                    <span className="text-xs md:text-sm font-mono font-bold text-[#D1C7BB] uppercase truncate block mt-1">
                      {currentSpotlightBrand.categories[0] || 'Streetwear'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Mini Atelier Selector */}
              <div className="space-y-5 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/brands/${currentSpotlightBrand.slug}`)}
                    className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#F2EDE4] via-[#F2EDE4] to-[#F2EDE4] hover:from-[#F2EDE4] hover:to-[#F2EDE4] text-[#101010] font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-[0_15px_35px_rgba(255,255,255,0.2)] hover:shadow-[0_22px_50px_rgba(255,255,255,0.4)] hover:-translate-y-1 cursor-pointer"
                  >
                    <span>Explore Atelier Drops</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <span className="text-[10px] font-mono text-[#A99E92] uppercase tracking-wider flex items-center gap-2 px-4 py-3 bg-[#101010]/90 rounded-xl border border-[#3A332D] shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-[#D1C7BB]" /> 100% Factory Tech Pack Ready
                  </span>
                </div>

                {/* Creative Atelier Carousel Cards */}
                {spotlightBrands.length > 1 && (
                  <div className="pt-4 border-t border-[#3A332D]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] flex items-center gap-1.5">
                        FEATURED ATELIERS ({selectedSpotlightIndex + 1}/{spotlightBrands.length}):
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#A99E92]">
                        <button
                          type="button"
                          onClick={() => setSelectedSpotlightIndex((prev) => (prev === 0 ? spotlightBrands.length - 1 : prev - 1))}
                          className="p-1.5 rounded-lg bg-[#101010] border border-[#3A332D] hover:text-[#F2EDE4] hover:border-[#F2EDE4] transition-colors"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedSpotlightIndex((prev) => (prev + 1) % spotlightBrands.length)}
                          className="p-1.5 rounded-lg bg-[#101010] border border-[#3A332D] hover:text-[#F2EDE4] hover:border-[#F2EDE4] transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {spotlightBrands.map((b, idx) => {
                        const isSelected = selectedSpotlightIndex === idx;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedSpotlightIndex(idx)}
                            className={`group relative px-3.5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2.5 text-left cursor-pointer border ${
                              isSelected
                                ? 'bg-[#201C18] border-[#F2EDE4] text-[#F2EDE4] shadow-[0_10px_25px_rgba(255,255,255,0.15)] -translate-y-0.5'
                                : 'bg-[#101010]/80 border-[#3A332D] text-[#A99E92] hover:text-[#F2EDE4] hover:border-[#A99E92]'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-[#101010] border border-[#3A332D] flex items-center justify-center font-bold text-[9px] text-[#F2EDE4] shrink-0 shadow-inner">
                              {b.logo || b.name.substring(0, 2)}
                            </span>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                              {b.name}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D96A3B] animate-pulse ml-1" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 3D Layered Interactive Visual Showcase Deck */}
            <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-between space-y-4">
              <div className="relative group/deck">
                {/* 3D Stacked Deck Underneath Sheet (Layer 1) */}
                <div className="absolute -inset-2.5 rounded-2xl bg-[#101010] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform rotate-2 translate-x-3 translate-y-3 opacity-60 pointer-events-none group-hover/deck:rotate-3 group-hover/deck:translate-x-4 group-hover/deck:translate-y-4 transition-all duration-500" />
                
                {/* 3D Secondary Blueprint Sheet (Layer 0) */}
                <div className="absolute -inset-1 rounded-2xl bg-[#201C18] border border-[#3A332D] transform -rotate-1 -translate-x-2 -translate-y-1 opacity-80 pointer-events-none transition-all duration-500" />

                {/* Primary Interactive 3D Visual Card (Top Sheet) */}
                <div
                  onClick={() => navigate(`/brands/${currentSpotlightBrand.slug}`)}
                  className="relative aspect-[4/5] min-h-[440px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-[#F2EDE4]/20 bg-[#201C18] shadow-[0_30px_80px_rgba(0,0,0,0.95)] transition-all duration-700 ease-out group-hover/deck:scale-[1.01] group-hover/deck:-translate-y-2 group-hover/deck:border-[#F2EDE4]/50 group-hover/deck:shadow-[0_40px_95px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  {/* Visual Image */}
                  <img
                    src={getActiveVisualUrl()}
                    alt={currentSpotlightBrand.name}
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_GARMENT_VISUALS[0]) e.currentTarget.src = FALLBACK_GARMENT_VISUALS[0];
                    }}
                    className="w-full h-full object-cover object-center group-hover/deck:scale-108 transition-transform duration-700 filter contrast-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/25 to-transparent opacity-85" />

                  {/* Top Floating 3D Monogram & View Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#101010]/90 backdrop-blur-xl border border-[#F2EDE4]/40 flex items-center justify-center font-editorial-heading font-black text-lg text-[#F2EDE4] shadow-[0_10px_25px_rgba(0,0,0,0.8)] group-hover/deck:scale-105 group-hover/deck:border-[#F2EDE4] transition-all">
                      {currentSpotlightBrand.logo || currentSpotlightBrand.name.substring(0, 2)}
                    </div>

                    <span className="px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-[#101010]/90 text-[#D1C7BB] border border-[#F2EDE4]/20 backdrop-blur-xl shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D1C7BB]" /> {activeVisualAngle.toUpperCase()} VIEW
                    </span>
                  </div>

                  {/* Bottom Elevated 3D Lookbook Bar */}
                  <div className="absolute bottom-4 left-4 right-4 p-4.5 rounded-xl bg-[#101010]/90 backdrop-blur-xl border border-[#F2EDE4]/20 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#A99E92] uppercase tracking-widest block">
                        Featured Garment Lookbook
                      </span>
                      <span className="text-xs font-bold text-[#F2EDE4] font-editorial-heading tracking-wide">
                        {currentSpotlightBrand.name} Atelier
                      </span>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#D96A3B] text-[#101010] flex items-center justify-center group-hover/deck:translate-x-0.5 group-hover/deck:-translate-y-0.5 transition-transform shadow-[0_5px_15px_rgba(255,255,255,0.4)]">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Angle Inspection Tabs */}
              <div className="bg-[#101010] border border-[#3A332D] p-1.5 rounded-xl flex items-center justify-between text-[10px] font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                <button
                  type="button"
                  onClick={() => setActiveVisualAngle('hero')}
                  className={`flex-1 py-2 rounded-lg text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeVisualAngle === 'hero'
                      ? 'bg-[#29231F] text-[#F2EDE4] font-bold border border-[#F2EDE4]/20 shadow-md'
                      : 'text-[#A99E92] hover:text-[#F2EDE4]'
                  }`}
                >
                  01 / Hero
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVisualAngle('techpack')}
                  className={`flex-1 py-2 rounded-lg text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeVisualAngle === 'techpack'
                      ? 'bg-[#29231F] text-[#F2EDE4] font-bold border border-[#F2EDE4]/20 shadow-md'
                      : 'text-[#A99E92] hover:text-[#F2EDE4]'
                  }`}
                >
                  02 / Tech Pack
                </button>
                <button
                  type="button"
                  onClick={() => setActiveVisualAngle('detail')}
                  className={`flex-1 py-2 rounded-lg text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeVisualAngle === 'detail'
                      ? 'bg-[#29231F] text-[#F2EDE4] font-bold border border-[#F2EDE4]/20 shadow-md'
                      : 'text-[#A99E92] hover:text-[#F2EDE4]'
                  }`}
                >
                  03 / Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATIVE FILTER & EXHIBITION MODE BAR */}
      <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-4 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Left: Search input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#A99E92] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands, city, or style..."
            className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-xs pl-9 pr-3 py-2.5 rounded-lg focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#A99E92] hover:text-[#F2EDE4]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Center: Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#D96A3B] text-[#101010] shadow'
                : 'bg-[#101010] text-[#A99E92] hover:text-[#F2EDE4] border border-[#3A332D]'
            }`}
          >
            All ({brands.length})
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#D96A3B] text-[#101010] shadow'
                  : 'bg-[#101010] text-[#A99E92] hover:text-[#F2EDE4] border border-[#3A332D]'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Quick toggle: Only Live Drops */}
          <button
            type="button"
            onClick={() => setOnlyLiveDrops(!onlyLiveDrops)}
            className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyLiveDrops
                ? 'bg-[#D96A3B] text-[#101010]'
                : 'bg-[#101010] text-[#A99E92] hover:text-[#F2EDE4] border border-[#3A332D]'
            }`}
          >
            <Flame className="w-3 h-3" /> Live Drops
          </button>
        </div>

        {/* Right: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#101010] border border-[#3A332D] p-1 rounded-lg shrink-0">
          <button
            type="button"
            title="Editorial Lookbook Grid"
            onClick={() => setViewMode('lookbook')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'lookbook'
                ? 'bg-[#D96A3B] text-[#101010] font-bold'
                : 'text-[#A99E92] hover:text-[#F2EDE4]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lookbook</span>
          </button>

          <button
            type="button"
            title="Interactive Runway Split Stage"
            onClick={() => setViewMode('runway')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'runway'
                ? 'bg-[#D96A3B] text-[#101010] font-bold'
                : 'text-[#A99E92] hover:text-[#F2EDE4]'
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Runway</span>
          </button>

          <button
            type="button"
            title="Spatial 3D Matrix"
            onClick={() => setViewMode('spatial')}
            className={`p-2 rounded flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'spatial'
                ? 'bg-[#D96A3B] text-[#101010] font-bold'
                : 'text-[#A99E92] hover:text-[#F2EDE4]'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Matrix</span>
          </button>
        </div>
      </div>

      {/* Dynamic Results Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-[#A99E92] px-1">
        <span>
          SHOWING <strong className="text-[#F2EDE4]">{filteredBrands.length}</strong> COLLABORATIVE ATELIERS
        </span>
        <span className="uppercase tracking-widest text-[10px]">
          [STUDIO ARCHIVE • CURATED TECH PACKS]
        </span>
      </div>

      {/* ============================================================ */}
      {/* MODE 1: EDITORIAL LOOKBOOK (Single-Column Full-Width Block Layout) */}
      {/* ============================================================ */}
      {viewMode === 'lookbook' && (
        <div className="flex flex-col gap-8 w-full">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} navigate={navigate} />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 2: INTERACTIVE RUNWAY (Split Screen Stage) */}
      {/* ============================================================ */}
      {viewMode === 'runway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Brand Roster List (7 cols) */}
          <div className="lg:col-span-7 space-y-2">
            {filteredBrands.map((brand, idx) => {
              const brandCollections = collections.filter(
                (c) => c.brand_id === brand.id && c.is_active
              );
              const activeCount = brandCollections.length;
              const isSelected = activeRunwayBrand.id === brand.id;

              return (
                <div
                  key={brand.id}
                  onMouseEnter={() => setHoveredBrandId(brand.id)}
                  onClick={() => navigate(`/brands/${brand.slug}`)}
                  className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#201C18] border-[#F2EDE4] shadow-lg translate-x-2'
                      : 'liquid-glass bg-[#171614] border-[#3A332D] hover:border-[#A99E92] hover:bg-[#201C18]/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-[#A99E92] w-6">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="w-10 h-10 rounded bg-[#101010] border border-[#3A332D] flex items-center justify-center font-editorial-heading font-black text-sm text-[#F2EDE4]">
                      {brand.logo || brand.name.substring(0, 2)}
                    </div>

                    <div>
                      <h4 className="font-editorial-heading font-bold text-base text-[#F2EDE4] group-hover:text-[#F2EDE4] flex items-center gap-2">
                        {brand.name}
                        {activeCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-[#D96A3B] animate-pulse" />
                        )}
                      </h4>
                      <p className="text-[10px] font-mono text-[#A99E92]">
                        {brand.location} • {brand.collaborationPeriod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block text-[10px] font-mono text-[#D1C7BB] uppercase px-2 py-0.5 rounded bg-[#101010] border border-[#3A332D]">
                      {brand.categories[0]}
                    </span>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F2EDE4] bg-[#101010] px-2.5 py-1 rounded border border-[#3A332D]">
                      {activeCount} {activeCount === 1 ? 'Collection' : 'Collections'}
                    </span>

                    <div className="w-7 h-7 rounded-full bg-[#101010] border border-[#3A332D] flex items-center justify-center text-[#F2EDE4] group-hover:bg-[#E98156] group-hover:text-[#101010] transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Floating Inspection Stage (5 cols, sticky) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-2xl border border-[#3A332D] liquid-glass bg-[#171614] overflow-hidden shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#3A332D] pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A99E92] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2EDE4]" /> Live Runway Inspection
                </span>
                <span className="text-[10px] font-mono text-[#D1C7BB] bg-[#201C18] px-2 py-0.5 rounded border border-[#3A332D]">
                  {activeRunwayBrand.location}
                </span>
              </div>

              {/* Garment Visual */}
              <div className="relative aspect-[4/3] min-h-[340px] lg:min-h-[380px] rounded-xl overflow-hidden border border-[#3A332D] bg-[#101010]">
                <img
                  src={getBrandVisual(activeRunwayBrand)}
                  alt={activeRunwayBrand.name}
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_GARMENT_VISUALS[0]) e.currentTarget.src = FALLBACK_GARMENT_VISUALS[0];
                  }}
                  className="w-full h-full object-cover object-center filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#101010]/85 backdrop-blur-md border border-[#3A332D]">
                  <div className="text-xs font-bold text-[#F2EDE4] font-editorial-heading">
                    {activeRunwayBrand.name} Drop Canvas
                  </div>
                  <div className="text-[10px] text-[#A99E92] font-mono">
                    {activeRunwayBrand.categories.join(' / ')}
                  </div>
                </div>
              </div>

              {/* Brand Philosophy */}
              <div>
                <h3 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
                  {activeRunwayBrand.name}
                </h3>
                <p className="mt-2 text-xs text-[#D1C7BB] font-light leading-relaxed">
                  {activeRunwayBrand.description}
                </p>
              </div>

              {/* Collections Breakout */}
              <div className="space-y-2 pt-2 border-t border-[#3A332D]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A99E92] block">
                  Design Articles & Specs:
                </span>
                {activeRunwayBrand.collectionsList &&
                activeRunwayBrand.collectionsList.filter((c) => c.name.trim() || c.articleSummary.trim()).length > 0 ? (
                  activeRunwayBrand.collectionsList
                    .filter((c) => c.name.trim() || c.articleSummary.trim())
                    .map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded bg-[#101010] border border-[#3A332D] flex items-center justify-between text-xs font-mono"
                      >
                        <span className="text-[#F2EDE4] font-bold">{c.name}</span>
                        <span className="text-[#A99E92]">{c.articleSummary}</span>
                      </div>
                    ))
                ) : (
                  <div className="p-3 rounded bg-[#101010] border border-[#3A332D] text-xs text-[#A99E92] font-mono text-center">
                    Capsule graphics developed under studio tech pack NDA.
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => navigate(`/brands/${activeRunwayBrand.slug}`)}
                className="w-full py-3 rounded-lg bg-[#D96A3B] hover:bg-[#E98156] text-[#101010] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>View Full Brand Archive</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 3: SPATIAL 3D MATRIX */}
      {/* ============================================================ */}
      {viewMode === 'spatial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBrands.map((brand, idx) => {
            const isHovered = hoveredBrandId === brand.id;
            const rowOffset = (idx % 3) * 10 - 10;
            const brandCollections = collections.filter(
              (c) => c.brand_id === brand.id && c.is_active
            );
            const activeCount = brandCollections.length;
            const visual = getBrandVisual(brand);

            return (
              <div
                key={brand.id}
                onMouseEnter={() => setHoveredBrandId(brand.id)}
                onMouseLeave={() => setHoveredBrandId(null)}
                onClick={() => navigate(`/brands/${brand.slug}`)}
                style={{
                  transform: isHovered
                    ? `perspective(1000px) translateZ(25px) translateY(-8px)`
                    : `perspective(1000px) translateZ(${rowOffset}px)`,
                  transformStyle: 'preserve-3d',
                }}
                className={`group relative liquid-glass bg-[#171614] border transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer p-6 flex flex-col justify-between min-h-[420px] shadow-xl hover:shadow-[0_25px_50px_rgba(0,0,0,0.95)] ${
                  isHovered
                    ? 'border-[#F2EDE4]/80 bg-[#201C18]'
                    : 'border-[#3A332D]'
                }`}
              >
                {/* Background Subtle Garment Texture */}
                <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none">
                  <img
                    src={visual}
                    alt={brand.name}
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_GARMENT_VISUALS[0]) e.currentTarget.src = FALLBACK_GARMENT_VISUALS[0];
                    }}
                    className="w-full h-full object-cover object-center filter grayscale contrast-125"
                  />
                  <div className="absolute inset-0 liquid-glass bg-[#171614]/80" />
                </div>

                {/* Top Header */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#101010] border border-[#3A332D] group-hover:border-[#F2EDE4] flex items-center justify-center font-editorial-heading font-black text-xl text-[#F2EDE4] shadow-inner transition-colors">
                      {brand.logo || brand.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-editorial-heading font-bold text-lg text-[#F2EDE4] group-hover:text-[#F2EDE4] transition-colors leading-tight">
                        {brand.name}
                      </h3>
                      <span className="text-[10px] font-mono text-[#A99E92] block">
                        {brand.location}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#101010] border border-[#3A332D] group-hover:border-[#F2EDE4] group-hover:bg-[#E98156] group-hover:text-[#101010] text-[#F2EDE4] flex items-center justify-center transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Middle Description */}
                <p className="text-xs text-[#D1C7BB] line-clamp-2 leading-relaxed font-light z-10">
                  {brand.description}
                </p>

                {/* Bottom Specs */}
                <div className="pt-4 border-t border-[#3A332D] flex flex-col gap-2 z-10">
                  {brand.collectionsList &&
                    brand.collectionsList.filter((c) => c.name.trim() || c.articleSummary.trim()).length > 0 && (
                      <span className="text-[10px] font-mono text-[#D1C7BB] truncate block">
                        <span className="text-[#A99E92] uppercase font-bold mr-1">Articles:</span>
                        {brand.collectionsList
                          .filter((c) => c.name.trim() || c.articleSummary.trim())
                          .map((c) => c.articleSummary)
                          .join(' | ')}
                      </span>
                    )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {brand.categories.slice(0, 2).map((cat, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[9px] font-mono uppercase tracking-wider text-[#F2EDE4] bg-[#101010] px-2 py-0.5 rounded border border-[#3A332D]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F2EDE4] bg-[#101010] px-2.5 py-1 rounded border border-[#3A332D]">
                      {activeCount} {activeCount === 1 ? 'COLLECTION' : 'COLLECTIONS'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Zero State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-24 liquid-glass bg-[#171614] border border-[#3A332D] rounded-2xl p-8 space-y-4">
          <Filter className="w-10 h-10 text-[#A99E92] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#F2EDE4]">No Brand Collaborations Found</h3>
          <p className="text-xs text-[#A99E92] max-w-sm mx-auto">
            Try resetting your search query or toggling off the &quot;Live Drops&quot; filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setOnlyLiveDrops(false);
            }}
            className="px-4 py-2 bg-[#D96A3B] text-[#101010] text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};




