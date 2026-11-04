import React, { useState } from 'react';
import { CheckCircle2, Layers } from 'lucide-react';
import { DimensionalHeading } from '../common/DimensionalHeading';
import { MagneticButton } from '../common/MagneticButton';

interface AboutPreviewProps {
  navigate: (path: string) => void;
}

export const AboutPreview: React.FC<AboutPreviewProps> = ({ navigate }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
    <section className="py-24 bg-[#101010] border-b border-[#3A332D] relative overflow-hidden">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#F2EDE4_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Dimensional Headline & 3D Stats */}
          <div className="lg:col-span-5 space-y-8">
            <DimensionalHeading
              eyebrow="03 // DESIGNER PROFILE"
              subtitle="Specialized in streetwear graphic direction, line sheet curation, and 1:1 factory print separations."
            >
              Translating Brand Identity Into Production Apparel
            </DimensionalHeading>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-5 rounded-xl shadow-xl hover:border-[#F2EDE4]/40 transition-all transform hover:-translate-y-1">
                <span className="block text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4] mb-1">
                  50+
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A99E92]">
                  Brand Collaborations
                </span>
              </div>

              <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-5 rounded-xl shadow-xl hover:border-[#F2EDE4]/40 transition-all transform hover:-translate-y-1">
                <span className="block text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4] mb-1">
                  200+
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A99E92]">
                  Apparel Graphics Delivered
                </span>
              </div>

              <div className="liquid-glass bg-[#171614] border border-[#3A332D] p-5 rounded-xl shadow-xl hover:border-[#F2EDE4]/40 transition-all transform hover:-translate-y-1 col-span-2">
                <span className="block text-3xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4] mb-1">
                  100%
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#A99E92]">
                  Factory & Printer Ready Tech Specs
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Layered Spatial Card */}
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
            className="lg:col-span-7 liquid-glass bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4]/60 p-8 sm:p-10 rounded-xl space-y-6 shadow-2xl transition-all duration-300 relative group"
          >
            {/* Corner Spec Markers */}
            <div className="absolute top-3 left-3 text-[9px] font-mono text-[#525866] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#F2EDE4]" /> STUDIO ARCHIVE PROFILE
            </div>

            <p className="text-sm md:text-base text-[#D1C7BB] leading-relaxed font-light pt-4">
              Tayyabs.Designs is an independent apparel design studio dedicated to clothing graphics, line sheet creative direction, and technical print production. With extensive experience across 50+ fashion brands globally, Tayyab transforms initial conceptual ideas into commercial garment collections.
            </p>

            <ul className="space-y-3 text-xs text-[#A99E92]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F2EDE4] shrink-0 mt-0.5" />
                <span className="text-[#D1C7BB]">Specialized expertise in heavy streetwear, cyber-gothic graphics, and heritage cultural iconography.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F2EDE4] shrink-0 mt-0.5" />
                <span className="text-[#D1C7BB]">Deep mastery of fabric GSM, screen printing separations (puff, discharge, metallic ink), and embroidery file specs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#F2EDE4] shrink-0 mt-0.5" />
                <span className="text-[#D1C7BB]">Hyper-realistic digital garment mockups engineered for pre-order e-commerce drops and lookbooks.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-[#3A332D]">
              <MagneticButton
                id="about-preview-more-btn"
                onClick={() => navigate('/about')}
                variant="primary"
              >
                More About Tayyab
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



