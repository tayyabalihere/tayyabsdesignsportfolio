import React, { useState, useRef, lazy, Suspense } from 'react';
import { gmailInquiryUrl } from '../data/contactLinks';
import { ArrowLeft, CheckCircle, ArrowUpRight, Image, Compass, PenTool, ZoomIn } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ProjectCard } from '../components/common/ProjectCard';
const GarmentViewer3D = lazy(() => import('../components/common/GarmentViewer3D').then(module => ({ default: module.GarmentViewer3D })));
import { Badge } from '../components/common/Badge';
import { NotFoundPage } from './NotFoundPage';

interface ProjectDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, navigate }) => {
  const { getProjectBySlug, projects, settings } = useCMS();
  const project = getProjectBySlug(slug);

  const [activeArtworkTab, setActiveArtworkTab] = useState<'front' | 'back'>('front');
  const [show3D, setShow3D] = useState(false);

  // Magnifier Zoom Lens state
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const artworkRef = useRef<HTMLDivElement>(null);

  if (!project) {
    return <NotFoundPage navigate={navigate} message={`Project "${slug}" was not found.`} />;
  }

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.brandId === project.brandId))
    .slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!artworkRef.current) return;
    const { left, top, width, height } = artworkRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  const currentArtwork =
    activeArtworkTab === 'back' && project.finalDesigns.backArtwork
      ? project.finalDesigns.backArtwork
      : project.finalDesigns.frontArtwork;

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <button
          onClick={() => navigate('/work')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A99E92] hover:text-[#D1C7BB] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Selected Work
        </button>

        {/* HERO */}
        <div className="space-y-8 border-b border-[#D1C7BB]/15 pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="dark">{project.brandName}</Badge>
            <Badge variant="outline">{project.category}</Badge>
            <span className="text-xs font-mono text-[#A99E92] border border-[#D1C7BB]/15 px-2 py-0.5 rounded">
              Year {project.year}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#D1C7BB] ml-auto">
              Role: <strong className="text-[#F2EDE4]">{project.designerRole}</strong>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight leading-[0.95]">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.servicesProvided.map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] uppercase tracking-wider text-[#D1C7BB] bg-[#201C18] px-3 py-1 rounded border border-[#D1C7BB]/20"
              >
                {srv}
              </span>
            ))}
          </div>

          <div className="relative aspect-[16/9] liquid-glass bg-[#171614] rounded-2xl overflow-hidden border border-[#D1C7BB]/25 shadow-2xl">
            <img
              src={project.mockups.heroMockup || project.finalDesigns.frontArtwork}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* OVERVIEW & BRIEF */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-[#D1C7BB]/15 pb-16">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              01 // Overview & Brief
            </span>
            <h2 className="text-2xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
              Project Overview
            </h2>
            <p className="text-sm md:text-base text-[#D1C7BB]/90 leading-relaxed font-light">
              {project.projectOverview.brief}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D1C7BB]/10 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#A99E92] block">Target Audience</span>
                <span className="font-bold text-[#F2EDE4]">{project.projectOverview.targetAudience}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#A99E92] block">Garment Type</span>
                <span className="font-bold text-[#F2EDE4]">{project.projectOverview.garmentType}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-8 rounded-2xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              02 // The Problem
            </span>
            <h3 className="font-editorial-heading font-bold text-xl text-[#F2EDE4]">
              Design Challenge
            </h3>
            <p className="text-xs md:text-sm text-[#D1C7BB]/90 leading-relaxed">
              {project.designChallenge}
            </p>
          </div>
        </div>

        {/* CREATIVE DIRECTION */}
        <div className="space-y-8 border-b border-[#D1C7BB]/15 pb-16">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#D1C7BB]" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              03 // Concept & Visual Rules
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
            Creative Direction
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase text-[#A99E92] block">Core Concept</span>
              <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.concept}</p>
            </div>

            <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase text-[#A99E92] block">Mood & Aesthetic</span>
              <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.mood}</p>
            </div>

            <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase text-[#A99E92] block">Typography Direction</span>
              <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.typography}</p>
            </div>

            <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase text-[#A99E92] block">Illustration Style</span>
              <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.illustration}</p>
            </div>

            {project.creativeDirection.culturalInspiration && (
              <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
                <span className="text-[10px] uppercase text-[#A99E92] block">Cultural Inspiration</span>
                <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.culturalInspiration}</p>
              </div>
            )}

            <div className="liquid-glass bg-[#171614] p-6 border border-[#D1C7BB]/15 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase text-[#A99E92] block">Garment Placement Rules</span>
              <p className="font-bold text-[#F2EDE4] text-sm">{project.creativeDirection.placement}</p>
            </div>
          </div>
        </div>

        {/* DESIGN PROCESS */}
        <div className="space-y-8 border-b border-[#D1C7BB]/15 pb-16">
          <div className="flex items-center gap-3">
            <PenTool className="w-5 h-5 text-[#D1C7BB]" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              04 // Iteration & Development
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
            Design Process & Tech Preparation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#D1C7BB]">
            <div className="p-6 liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded space-y-2">
              <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                Sketches & Rough Layouts
              </span>
              <p>{project.designProcess.sketchesNote}</p>
            </div>

            <div className="p-6 liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded space-y-2">
              <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                Vector Profiling & Node Cleanups
              </span>
              <p>{project.designProcess.roughsNote}</p>
            </div>

            <div className="p-6 liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded space-y-2">
              <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                Typography Scale & Kerning Tests
              </span>
              <p>{project.designProcess.typographyTestsNote}</p>
            </div>

            <div className="p-6 liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded space-y-2">
              <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                Print Technique & Separation Testing
              </span>
              <p>{project.designProcess.placementTestingNote}</p>
            </div>
          </div>
        </div>

        {/* 3D INTERACTIVE GARMENT INSPECTION VIEWER */}
        <div className="space-y-6 border-b border-[#D1C7BB]/15 pb-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block mb-1">
                3D Interactive Showroom
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
                Garment & Print Inspection
              </h2>
            </div>
          </div>
          {show3D ? <Suspense fallback={<p className="p-8 text-center" role="status">Loading 3D preview…</p>}><GarmentViewer3D project={project} /></Suspense> : <div className="p-10 text-center"><p className="mb-5 text-white/60">Explore the garment in an interactive 3D preview.</p><button className="studio-pill" onClick={() => setShow3D(true)}>Open 3D preview</button></div>}
        </div>

        {/* FINAL DESIGNS SHOWCASE WITH INTERACTIVE MAGNIFIER LENS */}
        <div className="space-y-8 border-b border-[#D1C7BB]/15 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block mb-1">
                05 // Vector Artwork Assets
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4] flex flex-wrap items-center gap-3">
                Final Artwork & Graphics
                <span className="text-xs font-mono font-normal text-[#D1C7BB] bg-[#201C18] px-2.5 py-1 rounded border border-[#D1C7BB]/20 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" /> Hover to Magnify Print Details
                </span>
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveArtworkTab('front')}
                className={`px-4 py-2 text-xs uppercase font-bold rounded transition-colors ${
                  activeArtworkTab === 'front'
                    ? 'bg-[#D96A3B] text-[#101010]'
                    : 'liquid-glass bg-[#171614] text-[#A99E92] border border-[#D1C7BB]/15'
                }`}
              >
                Front Artwork
              </button>
              {project.finalDesigns.backArtwork && (
                <button
                  onClick={() => setActiveArtworkTab('back')}
                  className={`px-4 py-2 text-xs uppercase font-bold rounded transition-colors ${
                    activeArtworkTab === 'back'
                      ? 'bg-[#D96A3B] text-[#101010]'
                      : 'liquid-glass bg-[#171614] text-[#A99E92] border border-[#D1C7BB]/15'
                  }`}
                >
                  Back Artwork
                </button>
              )}
            </div>
          </div>

          {/* Interactive Magnifier Canvas Area */}
          <div
            ref={artworkRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative liquid-glass bg-[#171614] border border-[#D1C7BB]/25 p-4 md:p-8 rounded-2xl overflow-hidden cursor-crosshair group"
          >
            <img
              src={currentArtwork}
              alt={`${project.title} final artwork`}
              className="w-full max-h-[700px] object-contain mx-auto rounded"
            />

            {/* Magnifier Zoom Lens */}
            {zoomPos.show && (
              <div
                className="absolute w-44 h-44 rounded-full border-2 border-[#F2EDE4] shadow-[0_0_30px_rgba(255,255,255,0.4)] pointer-events-none z-30 overflow-hidden bg-[#101010]"
                style={{
                  left: `calc(${zoomPos.x}% - 88px)`,
                  top: `calc(${zoomPos.y}% - 88px)`,
                }}
              >
                <div
                  className="w-full h-full bg-no-repeat rounded-full"
                  style={{
                    backgroundImage: `url(${currentArtwork})`,
                    backgroundSize: '250%',
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
              </div>
            )}
          </div>

          {project.finalDesigns.closeups.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-[#A99E92] block">
                Close-up Design Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.finalDesigns.closeups.map((img, idx) => (
                  <div key={idx} className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 rounded overflow-hidden p-2">
                    <img src={img} alt="Closeup detail" className="w-full aspect-[4/3] object-cover rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MOCKUPS AND APPLICATIONS */}
        <div className="space-y-8 border-b border-[#D1C7BB]/15 pb-16">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-[#D1C7BB]" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              06 // Garment Applications
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
            Product Mockups & Presentations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-3 rounded">
              <img src={project.mockups.frontMockup} alt="Front mockup" className="w-full aspect-[4/5] object-cover rounded" />
              <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-[#A99E92] mt-2">
                Front View Presentation
              </span>
            </div>

            {project.mockups.backMockup && (
              <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-3 rounded">
                <img src={project.mockups.backMockup} alt="Back mockup" className="w-full aspect-[4/5] object-cover rounded" />
                <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-[#A99E92] mt-2">
                  Back View Presentation
                </span>
              </div>
            )}

            {project.mockups.sideView && (
              <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-3 rounded">
                <img src={project.mockups.sideView} alt="Side view" className="w-full aspect-[4/5] object-cover rounded" />
                <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-[#A99E92] mt-2">
                  Side Seam View
                </span>
              </div>
            )}
          </div>
        </div>

        {/* CLIENT FEEDBACK */}
        {project.clientFeedback && project.clientFeedback.verified && (
          <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 p-8 md:p-12 rounded-2xl space-y-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#D1C7BB]" />
              <span className="text-xs uppercase tracking-widest font-bold text-[#D1C7BB]">
                Verified Client Feedback & Drop Response
              </span>
            </div>

            <p className="text-lg md:text-2xl font-serif italic text-[#F2EDE4] leading-relaxed">
              "{project.clientFeedback.quote}"
            </p>

            <div className="flex items-center justify-between border-t border-[#D1C7BB]/10 pt-4 text-xs">
              <div>
                <span className="font-bold text-[#F2EDE4] block">{project.clientFeedback.name}</span>
                <span className="text-[#A99E92]">{project.clientFeedback.role} • {project.clientFeedback.brand}</span>
              </div>

              {project.verifiedResults?.collectionResponse && (
                <div className="text-right">
                  <span className="text-[10px] text-[#A99E92] block">Result</span>
                  <span className="font-bold text-[#D1C7BB]">{project.verifiedResults.collectionResponse}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RELATED WORK */}
        {relatedProjects.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
              Related Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} navigate={navigate} aspectRatio="landscape" compact />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/40 p-10 md:p-14 rounded-2xl text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-editorial-heading font-black text-[#F2EDE4]">
            Need a distinctive design direction for your clothing brand? Start a project with Tayyabs.Designs.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3.5 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#E98156] transition-colors inline-flex items-center gap-2 shadow-xl"
            >
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#101010] text-[#F2EDE4] border border-[#D1C7BB]/30 hover:border-[#F2EDE4] font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center gap-2"
            >
              Discuss on WhatsApp <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={gmailInquiryUrl(settings.emailAddress, project.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#101010] text-[#F2EDE4] border border-[#D1C7BB]/30 hover:border-[#F2EDE4] font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center gap-2"
            >
              Send Direct Email <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};



