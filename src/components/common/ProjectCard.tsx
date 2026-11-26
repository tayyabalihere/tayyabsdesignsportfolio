import { portfolioImage } from '../../data/portfolioImages';
import React, { useState } from 'react';
import { ArrowUpRight, Shirt, Ruler, Sparkles, Layers, Zap } from 'lucide-react';
import type { Project } from '../../types';
import { Badge } from './Badge';

interface ProjectCardProps {
  project: Project;
  navigate: (path: string) => void;
  aspectRatio?: 'square' | 'portrait' | 'wide' | 'landscape';
  blueprintMode?: boolean;
  className?: string;
  compact?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  navigate,
  aspectRatio = 'portrait',
  blueprintMode: initialBlueprint = false,
  className = '',
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [isBlueprint, setIsBlueprint] = useState(initialBlueprint);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    wide: 'aspect-[16/10]',
    landscape: 'aspect-[4/3]',
  }[aspectRatio];

  const hasBackArtwork = Boolean(
    project.finalDesigns?.backArtwork || project.mockups?.backMockup
  );

  const currentImg =
    showBack && hasBackArtwork
      ? project.finalDesigns.backArtwork || project.mockups.backMockup
      : project.mockups.heroMockup || project.finalDesigns.frontArtwork;

  const resultMetric =
    project.verifiedResults?.salesImpact || project.verifiedResults?.collectionResponse;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowBack(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <>
      <style>{`
        @keyframes scanner {
          0%   { top: -4%; }
          100% { top: 104%; }
        }
        @keyframes cornerGrow {
          from { width: 6px; height: 6px; }
          to   { width: 14px; height: 14px; }
        }
        @keyframes badgeFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes metricPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          50%       { box-shadow: 0 0 10px 2px rgba(255,255,255,0.12); }
        }
        @keyframes arrowPing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
          60%       { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
        }
        @keyframes slideUpReveal {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowBorder {
          0%, 100% { border-color: rgba(255,255,255,0.6); box-shadow: 0 0 12px rgba(255,255,255,0.1); }
          50%       { border-color: rgba(255,255,255,1);   box-shadow: 0 0 28px rgba(255,255,255,0.25); }
        }

        .card-corner-tl,
        .card-corner-tr,
        .card-corner-bl,
        .card-corner-br {
          position: absolute;
          width: 8px;
          height: 8px;
          transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          z-index: 20;
          pointer-events: none;
        }
        .card-corner-tl { top: 8px; left: 8px; border-top: 1.5px solid #fff; border-left: 1.5px solid #fff; opacity: 0.35; }
        .card-corner-tr { top: 8px; right: 8px; border-top: 1.5px solid #fff; border-right: 1.5px solid #fff; opacity: 0.35; }
        .card-corner-bl { bottom: 8px; left: 8px; border-bottom: 1.5px solid #fff; border-left: 1.5px solid #fff; opacity: 0; }
        .card-corner-br { bottom: 8px; right: 8px; border-bottom: 1.5px solid #fff; border-right: 1.5px solid #fff; opacity: 0; }

        .project-card:hover .card-corner-tl,
        .project-card:hover .card-corner-tr { width: 16px; height: 16px; opacity: 1; }
        .project-card:hover .card-corner-bl,
        .project-card:hover .card-corner-br { width: 16px; height: 16px; opacity: 1; }

        .project-card:hover .card-glow-border {
          animation: glowBorder 2.5s ease-in-out infinite;
        }

        .badge-stagger-1 { animation: badgeFadeUp 0.35s ease forwards 0s; }
        .badge-stagger-2 { animation: badgeFadeUp 0.35s ease forwards 0.07s; }
        .badge-stagger-3 { animation: badgeFadeUp 0.35s ease forwards 0.14s; }

        .metric-pill { animation: metricPulse 3s ease-in-out infinite; }

        .project-card:hover .arrow-btn {
          animation: arrowPing 1.4s ease-in-out infinite;
        }

        .title-reveal { animation: slideUpReveal 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
      `}</style>

      <article
        data-cursor="open"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => navigate(`/work/${project.slug}`)}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(12px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease',
        }}
        className={`project-card group relative liquid-glass bg-[#171614] border transition-colors duration-300 rounded-xl overflow-hidden cursor-pointer flex flex-col h-full card-glow-border ${
          isBlueprint
            ? 'border-[#F2EDE4]/60 bg-[#101010] shadow-[0_0_25px_rgba(255,255,255,0.15)]'
            : 'border-[#3A332D] hover:shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08)]'
        } ${className}`}
      >
        {/* ── Animated Corner Brackets ── */}
        <div className="card-corner-tl" />
        <div className="card-corner-tr" />
        <div className="card-corner-bl" />
        <div className="card-corner-br" />

        {/* ── Media Image Frame ── */}
        <div className={`relative w-full ${aspectClasses} bg-[#171614] overflow-hidden flex-shrink-0`}>

          {/* Image */}
          <img
            src={portfolioImage(currentImg || '')}
            alt={`${project.title} - ${project.brandName} apparel design`}
            loading="lazy"
            className={`w-full h-full ${compact ? 'object-contain' : 'object-cover'} object-center transition-all duration-700 ease-out group-hover:scale-[1.07] ${
              isBlueprint ? 'invert brightness-90 opacity-85 contrast-125' : ''
            }`}
          />

          {/* Subtle dark vignette that lifts on hover */}
          {!isBlueprint && (
            <div className={`absolute inset-0 bg-gradient-to-t from-[#171614] to-transparent ${compact ? 'opacity-15 group-hover:opacity-0' : 'opacity-80 group-hover:opacity-50'} transition-opacity duration-500`} />
          )}

          {/* ── Neon White Scanline ── */}
          {isHovered && !isBlueprint && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute w-full"
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 60%, transparent 100%)',
                  boxShadow: '0 0 18px 4px rgba(255,255,255,0.35)',
                  animation: 'scanner 1.4s linear infinite',
                }}
              />
            </div>
          )}

          {/* ── Blueprint Overlay ── */}
          {isBlueprint && (
            <div className="absolute inset-0 bg-grain pointer-events-none opacity-90 flex flex-col justify-between p-3 border border-[#F2EDE4]/40">
              <div className="flex justify-between items-center text-[9px] font-mono text-[#D1C7BB] bg-[#101010]/90 px-2 py-0.5 border border-[#F2EDE4]/30">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-[#F2EDE4]" /> TECH SPEC 1:1
                </span>
                <span>GSM: 460 | REF: {project.id.toUpperCase()}</span>
              </div>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#F2EDE4]/25" />
                <div className="absolute h-full w-[1px] bg-[#F2EDE4]/25" />
              </div>
              <div className="text-[9px] font-mono text-[#D1C7BB] bg-[#101010]/90 px-2 py-0.5 border border-[#F2EDE4]/30 text-right">
                FACTORY READY SEPARATIONS
              </div>
            </div>
          )}

          {/* ── Top Badges ── */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <Badge variant="dark" className="shadow-md">
              {project.brandName}
            </Badge>
            <span className="text-[10px] font-mono tracking-widest text-[#D1C7BB]/90 bg-[#101010]/80 px-2 py-0.5 border border-[#3A332D] rounded backdrop-blur-sm">
              {project.year}
            </span>
          </div>

          {/* ── Hover Controls (Front / Back + Blueprint) ── */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
            {hasBackArtwork && isHovered && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowBack(!showBack); }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#101010]/90 border border-[#F2EDE4]/40 text-[#F2EDE4] hover:bg-[#F2EDE4] hover:text-[#101010] transition-all rounded shadow-md"
                style={{ animation: 'slideUpReveal 0.25s ease forwards' }}
              >
                <Shirt className="w-3 h-3" />
                {showBack ? 'Front' : 'Back'}
              </button>
            )}
            {isHovered && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsBlueprint(!isBlueprint); }}
                className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border transition-all shadow-md ${
                  isBlueprint
                    ? 'bg-[#D96A3B] text-[#101010] border-[#F2EDE4]'
                    : 'bg-[#101010]/90 text-[#D1C7BB] border-[#F2EDE4]/30 hover:border-[#F2EDE4]'
                }`}
                title="Toggle Spec Blueprint Mode"
                style={{ animation: 'slideUpReveal 0.3s ease forwards 0.05s' }}
              >
                <Layers className="w-3 h-3" />
                {isBlueprint ? 'Normal' : 'Blueprint'}
              </button>
            )}
          </div>

          {/* ── Animated Arrow Button ── */}
          <div className={`arrow-btn absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-[#101010]/80 border border-[#F2EDE4]/30 flex items-center justify-center text-[#F2EDE4] group-hover:bg-[#F2EDE4] group-hover:text-[#101010] transition-all duration-300 shadow-md`}>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
        </div>

        {/* ── Content Body ── */}
        <div className={`${compact ? 'p-4 space-y-3' : 'p-5 space-y-4'} flex-1 flex flex-col justify-between liquid-glass bg-[#171614]`}>
          <div className="space-y-2">

            {/* Category + Role row */}
            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#A99E92]">
              <span className="truncate flex items-center gap-1">
                <span className={`w-1 h-1 rounded-full bg-[#F2EDE4] inline-block transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                {project.category}
              </span>
              {!compact && <span className="font-mono text-[#525866] ml-2 shrink-0">{project.designerRole}</span>}
            </div>

            {/* Title */}
            <h3
              className={`font-editorial-heading font-bold ${compact ? 'text-base min-h-[2.75rem]' : 'text-lg sm:text-xl'} text-[#F2EDE4] leading-snug line-clamp-2 transition-colors duration-300 ${
                isHovered ? 'text-[#F2EDE4]' : 'text-[#D1C7BB]'
              }`}
            >
              {project.title}
            </h3>

            {/* Verified Metric */}
            {!compact && resultMetric && (
              <div className="metric-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201C18] border border-[#F2EDE4]/15 text-[#D1C7BB] text-[10px] font-mono">
                <Zap className="w-3 h-3 text-[#F2EDE4] shrink-0" />
                <span className="truncate">{resultMetric}</span>
              </div>
            )}
          </div>

          {/* Services + CTA */}
          <div className="pt-3 border-t border-[#3A332D] flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {project.servicesProvided.slice(0, 2).map((srv, idx) => (
                <span
                  key={idx}
                  className={`text-[9px] uppercase tracking-wider text-[#A99E92] bg-[#201C18] px-2 py-0.5 rounded border border-[#3A332D] transition-colors duration-200 group-hover:border-[#F2EDE4]/20 group-hover:text-[#AAAAAA] badge-stagger-${idx + 1}`}
                >
                  {srv}
                </span>
              ))}
              {project.servicesProvided.length > 2 && (
                <span className="text-[9px] uppercase tracking-wider text-[#A99E92] bg-[#201C18] px-1.5 py-0.5 rounded border border-[#3A332D]">
                  +{project.servicesProvided.length - 2}
                </span>
              )}
            </div>

            <span className="text-[10px] uppercase tracking-wider font-bold text-[#A99E92] group-hover:text-[#F2EDE4] transition-colors duration-300 flex items-center gap-1 shrink-0">
              <Sparkles className={`w-3 h-3 transition-all duration-300 ${isHovered ? 'opacity-100 text-[#F2EDE4]' : 'opacity-0'}`} />
              Case Study
            </span>
          </div>
        </div>
      </article>
    </>
  );
};

