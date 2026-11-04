import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
  Layers,
  Sparkles,
  MapPin,
  Eye,
  CheckCircle2,
  MessageSquare,
  Box,
  FileText,
  Award,
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ProjectCard } from '../components/common/ProjectCard';
import { TestimonialCard } from '../components/common/TestimonialCard';
import { ArticleGalleryModal } from '../components/common/ArticleGalleryModal';
import { ApparelProductCard } from '../components/common/ApparelProductCard';
import { NotFoundPage } from './NotFoundPage';
import type { ApparelProduct } from '../types';

interface BrandDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({ slug, navigate }) => {
  const { getBrandBySlug, projects, testimonials, collections, fetchCollections, settings } = useCMS();
  const brand = getBrandBySlug(slug);

  const [activeVisualAngle, setActiveVisualAngle] = useState<'hero' | 'techpack' | 'detail'>('hero');
  const [galleryItem, setGalleryItem] = useState<{ product: ApparelProduct; initialIndex: number } | null>(null);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  if (!brand) {
    return <NotFoundPage navigate={navigate} message={`Brand "${slug}" not found in archive.`} />;
  }

  // Filter projects & testimonials for this brand
  const brandProjects = projects.filter(
    (p) => p.brandId === brand.id || (p.brandName && p.brandName.toLowerCase().trim() === brand.name.toLowerCase().trim())
  );
  const brandTestimonial = testimonials.find(
    (t) => t.brandName && t.brandName.toLowerCase().trim() === brand.name.toLowerCase().trim()
  );

  // Query live database-backed collections
  const brandCollections = collections.filter((c) => c.brand_id === brand.id);
  const liveCollections = brandCollections.filter((c) => c.is_active);

  // Active Drop Collections & Completed Projects count
  const activeDropCollectionsCount = liveCollections.length;
  const completedProjectsCount =
    brandProjects.length > 0
      ? brandProjects.length
      : brandCollections.filter(
          (c) => (c.products && c.products.length > 0) || (c.total_products && c.total_products > 0)
        ).length;

  // Resolve dynamic visual angles for 3D visual stage
  const getBrandVisualAngles = () => {
    const matchingProject = brandProjects[0];
    let collectionImg = '';
    if (liveCollections.length > 0 && liveCollections[0].banner_image) {
      collectionImg = liveCollections[0].banner_image;
    }

    const hero =
      collectionImg ||
      matchingProject?.mockups?.heroMockup ||
      matchingProject?.mockups?.frontMockup ||
      matchingProject?.finalDesigns?.frontArtwork ||
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000';

    const techpack =
      matchingProject?.finalDesigns?.backArtwork ||
      matchingProject?.mockups?.backMockup ||
      matchingProject?.finalDesigns?.frontArtwork ||
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000';

    const detail =
      matchingProject?.finalDesigns?.closeups?.[0] ||
      matchingProject?.mockups?.detailCloseups?.[0] ||
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000';

    return { hero, techpack, detail };
  };

  const visuals = getBrandVisualAngles();

  const getActiveVisualUrl = () => {
    if (activeVisualAngle === 'techpack') return visuals.techpack;
    if (activeVisualAngle === 'detail') return visuals.detail;
    return visuals.hero;
  };

  // Structured Fallback Apparel Products for brands that do not have live CMS collections yet (e.g. Aastan)
  const fallbackStudioProducts: ApparelProduct[] = [
    {
      id: `${brand.id}-fallback-1`,
      collection_id: 'studio-capsule',
      category_id: 'cat-tee',
      category_name: 'Heavyweight Graphic Tee',
      title: `${brand.name} Cultural Heritage Oversized Tee`,
      slug: 'heritage-tee',
      description: `Heavyweight French cotton tee featuring bespoke cultural heritage graphic vector artwork designed by Tayyabs.Designs for ${brand.name}.`,
      images: [visuals.hero, visuals.techpack, visuals.detail],
      is_published: true,
      price: 85,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    },
    {
      id: `${brand.id}-fallback-2`,
      collection_id: 'studio-capsule',
      category_id: 'cat-hoodie',
      category_name: 'Cut & Sew Fleece Hoodie',
      title: `${brand.name} Atelier 450GSM Fleece Hoodie`,
      slug: 'fleece-hoodie',
      description: `450 GSM luxury French terry fleece hoodie with custom silicone drawstrings, drop shoulder cut, and high-density screenprint artwork.`,
      images: [visuals.techpack, visuals.hero, visuals.detail],
      is_published: true,
      price: 145,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
    },
    {
      id: `${brand.id}-fallback-3`,
      collection_id: 'studio-capsule',
      category_id: 'cat-jacket',
      category_name: 'Technical Outerwear',
      title: `${brand.name} Studio Utility Bomber Jacket`,
      slug: 'utility-jacket',
      description: `Water-resistant technical nylon bomber jacket featuring precision embroidery crests, custom zip hardware, and 100% factory tech pack compliance.`,
      images: [visuals.detail, visuals.hero, visuals.techpack],
      is_published: true,
      price: 195,
      sizes: ['S', 'M', 'L', 'XL'],
    },
  ];

  const cleanWhatsappNumber = (settings?.whatsappNumber || '923000000000').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hello Tayyabs.Designs! I visited the ${brand.name} atelier page on your website and would like to start a similar streetwear design project.`
  )}`;

  return (
    <div className="portfolio-page pt-28 pb-28 bg-[#101010] min-h-screen text-[#D1C7BB]">
      {/* Background Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b from-[#D96A3B]/[0.08] via-white/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-[#3A332D] pb-5">
          <button
            type="button"
            onClick={() => navigate('/brands')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A99E92] hover:text-[#F2EDE4] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Brands Directory
          </button>

          <span className="text-[10px] font-mono text-[#A99E92] uppercase tracking-widest liquid-glass bg-[#171614] px-3.5 py-1.5 rounded-full border border-[#3A332D] hidden sm:inline-block">
            ✦ STUDIO EXHIBITION ARCHIVE • {brand.name.toUpperCase()}
          </span>
        </div>

        {/* ============================================================ */}
        {/* 1. ULTRA-CREATIVE 3D ISOMETRIC ATELIER HERO STAGE */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden border border-[#F2EDE4]/15 bg-[#171614] shadow-[0_35px_110px_rgba(0,0,0,0.95)] backdrop-blur-2xl group transition-all duration-500 hover:border-[#F2EDE4]/30">
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
              alt={brand.name}
              className="w-full h-full object-cover object-center opacity-20 blur-2xl scale-110 filter contrast-125 saturate-150 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#171614] via-[#171614]/90 to-[#171614]/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-transparent to-[#171614]/70" />

            {/* Giant 3D Watermark Monogram */}
            <div className="absolute -right-12 -bottom-24 text-[18rem] md:text-[28rem] font-editorial-heading font-black text-white/[0.04] select-none tracking-tighter leading-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {brand.logo || brand.name.substring(0, 2)}
            </div>
          </div>

          <div className="relative z-10 p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row items-stretch justify-between gap-10">
            {/* Left Spotlight Narrative & 3D Specs Panel */}
            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D96A3B] text-[#101010] shadow-[0_5px_20px_rgba(255,255,255,0.3)]">
                    <Sparkles className="w-3.5 h-3.5 text-[#101010]" /> Atelier Exhibition
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#201C18]/90 text-[#D1C7BB] border border-[#F2EDE4]/20 backdrop-blur-md shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D1C7BB]" /> Verified Partner
                  </span>

                  <span className="text-[11px] font-mono text-[#A99E92] flex items-center gap-1.5 bg-[#101010]/90 px-3.5 py-1.5 rounded-full border border-[#3A332D] backdrop-blur-md">
                    <MapPin className="w-3.5 h-3.5 text-[#A99E92]" /> {brand.location}
                  </span>
                </div>

                {/* Title & Narrative */}
                <div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight leading-[1.02] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                    {brand.name}
                  </h1>
                  <p className="mt-4 text-sm md:text-base text-[#D1C7BB] font-light leading-relaxed max-w-xl">
                    {brand.description}
                  </p>
                </div>

                {/* 3D Inset Technical Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#D1C7BB]/40 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Active Drop Collections
                    </span>
                    <span className="text-base md:text-xl font-mono font-bold text-[#F2EDE4] flex items-center gap-1.5 mt-1">
                      {activeDropCollectionsCount}
                      <span className="text-[10px] text-[#D1C7BB] font-normal bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                        {activeDropCollectionsCount > 0 ? 'Live' : 'Standby'}
                      </span>
                    </span>
                  </div>

                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#F2EDE4]/30 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Case Studies
                    </span>
                    <span className="text-base md:text-xl font-mono font-bold text-[#F2EDE4] mt-1 block">
                      {completedProjectsCount}
                    </span>
                  </div>

                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#F2EDE4]/30 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Primary Silhouette
                    </span>
                    <span className="text-xs md:text-sm font-mono font-bold text-[#D1C7BB] uppercase truncate block mt-1">
                      {brand.categories[0] || 'Streetwear'}
                    </span>
                  </div>

                  <div className="bg-[#101010]/90 border border-[#3A332D] hover:border-[#F2EDE4]/30 p-4 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-300">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A99E92] block">
                      Collaboration Era
                    </span>
                    <span className="text-xs md:text-sm font-mono font-bold text-[#D1C7BB] block mt-1">
                      {brand.collaborationPeriod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#F2EDE4] via-[#F2EDE4] to-[#F2EDE4] hover:from-[#F2EDE4] hover:to-[#F2EDE4] text-[#101010] font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 transition-all duration-300 shadow-[0_15px_35px_rgba(255,255,255,0.2)] hover:shadow-[0_22px_50px_rgba(255,255,255,0.4)] hover:-translate-y-1 cursor-pointer"
                >
                  <span>Start a Project Like {brand.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {brand.websiteUrl && (
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 rounded-xl bg-[#101010]/90 text-[#D1C7BB] hover:text-[#F2EDE4] font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-[#3A332D] hover:border-[#F2EDE4] transition-all cursor-pointer"
                  >
                    <span>Brand Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-xl bg-[#101010]/90 text-[#F2EDE4] hover:text-[#F2EDE4] font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-white/20 hover:border-white/50 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Direct WhatsApp Spec Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right 3D Layered Interactive Visual Showcase Deck */}
            <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 flex flex-col justify-between space-y-4">
              <div className="relative group/deck">
                {/* 3D Stacked Deck Underneath Sheet (Layer 1) */}
                <div className="absolute -inset-2.5 rounded-2xl bg-[#101010] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform rotate-2 translate-x-3 translate-y-3 opacity-60 pointer-events-none transition-all duration-500" />

                {/* 3D Secondary Blueprint Sheet (Layer 0) */}
                <div className="absolute -inset-1 rounded-2xl bg-[#201C18] border border-[#3A332D] transform -rotate-1 -translate-x-2 -translate-y-1 opacity-80 pointer-events-none transition-all duration-500" />

                {/* Primary Interactive 3D Visual Card (Top Sheet) */}
                <div className="relative aspect-[4/5] min-h-[420px] rounded-2xl overflow-hidden border border-[#F2EDE4]/20 bg-[#201C18] shadow-[0_30px_80px_rgba(0,0,0,0.95)] transition-all duration-700 ease-out group-hover/deck:scale-[1.01] group-hover/deck:border-[#F2EDE4]/50">
                  <img
                    src={getActiveVisualUrl()}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center group-hover/deck:scale-108 transition-transform duration-700 filter contrast-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/25 to-transparent opacity-85" />

                  {/* Top Floating 3D Monogram & View Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="w-12 h-12 rounded-xl bg-[#101010]/90 backdrop-blur-xl border border-[#F2EDE4]/40 flex items-center justify-center font-editorial-heading font-black text-lg text-[#F2EDE4] shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                      {brand.logo || brand.name.substring(0, 2)}
                    </div>

                    <span className="px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-[#101010]/90 text-[#D1C7BB] border border-[#F2EDE4]/20 backdrop-blur-xl shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D1C7BB]" /> {activeVisualAngle.toUpperCase()} VIEW
                    </span>
                  </div>

                  {/* Bottom Elevated 3D Lookbook Bar */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#101010]/90 backdrop-blur-xl border border-[#F2EDE4]/20 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-[#A99E92] uppercase tracking-widest block">
                        Official Atelier Visual Showcase
                      </span>
                      <span className="text-xs font-bold text-[#F2EDE4] font-editorial-heading tracking-wide">
                        {brand.name} Studio Lookbook
                      </span>
                    </div>
                    <span className="w-9 h-9 rounded-full bg-[#D96A3B] text-[#101010] flex items-center justify-center shadow-[0_5px_15px_rgba(255,255,255,0.4)]">
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
                  01 / Hero Mockup
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
                  03 / Detail Closeups
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. DYNAMIC LIVE COLLECTION DROPS / STUDIO CAPSULE LOOKBOOK */}
        {/* ============================================================ */}
        {liveCollections.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-[#3A332D] pb-4">
              <Layers className="w-6 h-6 text-[#F2EDE4]" />
              <div>
                <h2 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
                  Active Collection Drops & Design Articles ({liveCollections.length})
                </h2>
                <p className="text-xs text-[#A99E92] font-mono">
                  Live database collections synced for {brand.name}.
                </p>
              </div>
            </div>

            {liveCollections.map((col) => {
              const publishedProducts = (col.products || []).filter((p) => p.is_published);

              return (
                <div key={col.id} className="liquid-glass bg-[#171614] border border-[#3A332D] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                  {/* Drop Banner & Details */}
                  <div className="relative h-48 rounded-xl overflow-hidden bg-[#101010] border border-[#3A332D]">
                    <img
                      src={col.banner_image}
                      alt={col.name}
                      className="w-full h-full object-cover filter contrast-110 brightness-95"
                      onError={(e) => {
                        const fallback = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200';
                        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-[#171614]/40 to-transparent" />
                    <div className="absolute bottom-5 left-6 space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#F2EDE4] bg-white/10 px-2.5 py-1 rounded border border-white/20">
                        Live Drop Collection
                      </span>
                      <h3 className="font-editorial-heading font-black text-3xl text-[#F2EDE4]">
                        {col.name}
                      </h3>
                      {col.description && (
                        <p className="text-xs text-[#D1C7BB] max-w-xl line-clamp-2 font-light">
                          {col.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Published Articles Grid - Scaled-Up Creative Design */}
                  {publishedProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {publishedProducts.map((prod) => (
                        <ApparelProductCard
                          key={prod.id}
                          product={prod}
                          onOpenGallery={(productItem, idx) =>
                            setGalleryItem({ product: productItem, initialIndex: idx })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* High-Impact Fallback Studio Capsule Lookbook Showcase */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A332D] pb-4">
              <div className="flex items-center gap-3">
                <Box className="w-6 h-6 text-[#D1C7BB]" />
                <div>
                  <h2 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
                    Studio Capsule Collection & Factory Tech Packs
                  </h2>
                  <p className="text-xs text-[#A99E92] font-mono">
                    Official apparel line engineered by Tayyabs.Designs for {brand.name}.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-[#D1C7BB] border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Factory Production Approved
              </span>
            </div>

            {/* Scaled-Up Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fallbackStudioProducts.map((prod) => (
                <ApparelProductCard
                  key={prod.id}
                  product={prod}
                  onOpenGallery={(productItem, idx) =>
                    setGalleryItem({ product: productItem, initialIndex: idx })
                  }
                />
              ))}
            </div>

            {/* Factory Technical Specifications Grid Card */}
            <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#3A332D] pb-4">
                <h3 className="font-editorial-heading font-black text-xl text-[#F2EDE4] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D1C7BB]" /> Factory Tech Pack Specifications for {brand.name}
                </h3>
                <span className="text-[10px] font-mono text-[#A99E92] uppercase">STUDIO SPEC CODE: #TB-{brand.name.substring(0, 3).toUpperCase()}-2025</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#101010] border border-[#3A332D] space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#A99E92] block">Fabric Construction</span>
                  <span className="text-sm font-bold text-[#F2EDE4] block">280 - 450 GSM Heavyweight</span>
                  <span className="text-[10px] text-[#A99E92] block">French Oxford & Terry Fleece</span>
                </div>

                <div className="p-4 rounded-xl bg-[#101010] border border-[#3A332D] space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#A99E92] block">Print & Embroidery</span>
                  <span className="text-sm font-bold text-[#F2EDE4] block">High-Density Screenprint</span>
                  <span className="text-[10px] text-[#A99E92] block">3D Puff & Precision Crest Embroidery</span>
                </div>

                <div className="p-4 rounded-xl bg-[#101010] border border-[#3A332D] space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#A99E92] block">Tech Pack Assets</span>
                  <span className="text-sm font-bold text-[#D1C7BB] block">Graded Spec Sheets Included</span>
                  <span className="text-[10px] text-[#A99E92] block">AI / PDF Vector Files Ready</span>
                </div>

                <div className="p-4 rounded-xl bg-[#101010] border border-[#3A332D] space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-[#A99E92] block">Silhouette & Fit</span>
                  <span className="text-sm font-bold text-[#F2EDE4] block">Custom Boxy Streetwear Cut</span>
                  <span className="text-[10px] text-[#A99E92] block">Drop Shoulder & Heavy Ribbing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. PROJECTS COMPLETED FOR THIS BRAND */}
        {/* ============================================================ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#3A332D] pb-4">
            <h2 className="text-2xl font-editorial-heading font-black text-[#F2EDE4] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F2EDE4]" /> Atelier Case Studies for {brand.name}
            </h2>
            <span className="text-xs font-mono text-[#A99E92]">
              Showing {brandProjects.length > 0 ? brandProjects.length : 1} Completed Project
            </span>
          </div>

          {brandProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brandProjects.map((project) => (
                <ProjectCard key={project.id} project={project} navigate={navigate} />
              ))}
            </div>
          ) : (
            /* Styled Dynamic Inset Project Card for Brands without explicit project entry */
            <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-8 rounded-2xl space-y-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#201C18] text-[#D1C7BB] border border-[#3A332D]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Capsule Project Completed
                </span>
                <h3 className="font-editorial-heading font-black text-2xl text-[#F2EDE4]">
                  {brand.name} Streetwear Graphic & Tech Pack Suite
                </h3>
                <p className="text-xs text-[#D1C7BB] leading-relaxed font-light">
                  Complete design direction, artwork vector files, pantone colorways, and factory-graded technical packs developed for {brand.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="px-6 py-3.5 rounded-xl bg-[#D96A3B] hover:bg-[#E98156] text-[#101010] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shrink-0 transition-all shadow-lg cursor-pointer"
              >
                <span>Request Full Case Study PDF</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Client Testimonial if available */}
        {brandTestimonial && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-editorial-heading font-bold text-[#F2EDE4]">
              Client Partner Feedback
            </h3>
            <TestimonialCard testimonial={brandTestimonial} navigate={navigate} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. HIGH-IMPACT ULTRA-MODERN CTA SECTION */}
        {/* ============================================================ */}
        <div className="relative rounded-3xl overflow-hidden border border-[#F2EDE4]/20 bg-gradient-to-r from-[#171614] via-[#201C18] to-[#171614] p-8 md:p-14 text-center space-y-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          {/* Ambient Glow Background Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D96A3B]/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#3A332D] text-[#F2EDE4] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D1C7BB]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em]">
                Elevate Your Label to Global Industry Standards
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight leading-tight">
              Start a Project Similar to {brand.name}
            </h3>

            <p className="text-xs md:text-sm text-[#D1C7BB] max-w-lg mx-auto font-light leading-relaxed">
              Build your own distinctive streetwear graphics, 100% factory-ready tech packs, or performance sportswear lines with Tayyabs.Designs.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-[#D96A3B] hover:bg-[#E98156] text-[#101010] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_15px_35px_rgba(255,255,255,0.25)] hover:shadow-[0_20px_45px_rgba(255,255,255,0.4)] hover:-translate-y-1 inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>Start Your Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#101010] hover:bg-[#201C18] text-[#F2EDE4] font-bold text-xs uppercase tracking-widest rounded-xl border border-white/20 hover:border-white/50 transition-all inline-flex items-center gap-2.5 cursor-pointer shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Full-Screen High-Res Article Gallery Modal */}
      <ArticleGalleryModal
        isOpen={Boolean(galleryItem)}
        onClose={() => setGalleryItem(null)}
        product={galleryItem?.product || null}
        initialIndex={galleryItem?.initialIndex || 0}
      />
    </div>
  );
};



