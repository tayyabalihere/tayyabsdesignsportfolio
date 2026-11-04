import React from 'react';
import { ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';
import { generateArtworkSvg } from '../data/artworkGenerator';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const workspaceMockup = generateArtworkSvg('minimal-techpack', 'TAYYABS WORKSPACE', 'front');

  const skillsList = [
    { title: 'Adobe Illustrator', desc: 'Precision vector node editing, print layout scaling, and stroke profiling.' },
    { title: 'Adobe Photoshop', desc: 'Complex raster graphics, vintage wash textures, and digital garment mockups.' },
    { title: 'CLO3D Apparel Modeling', desc: '3D digital garment avatar fitting, cloth drape, and seam pattern testing.' },
    { title: 'Screen Print Separations', desc: 'Spot color vector layering, Pantone PMS matching, puff/discharge print specs.' },
    { title: 'Embroidery File Specs', desc: 'Digitized DST/EMB file guides, thread density notes, stitch angle paths.' },
    { title: 'Production Tech Packs', desc: '1:1 scale placement sheets, measurement points, and factory-ready spec PDFs.' },
  ];

  const timelineEvents = [
    { year: '2022', title: 'Studio Inception', desc: 'Began independent clothing design practice specializing in streetwear graphic development.' },
    { year: '2023', title: '20+ Brand Benchmark', desc: 'Expanded international collaborations across Paris, London, and Los Angeles boutique fashion labels.' },
    { year: '2024', title: 'Full Collection Direction', desc: 'Pioneered end-to-end seasonal capsule direction, fightwear jerseys, and high-density puff print collections.' },
    { year: '2025 - 2026', title: '50+ Brand Archive', desc: 'Surpassed 50 verified brand collaborations with clients across Europe, North America, UAE, and Asia.' },
  ];

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="border-b border-[#D1C7BB]/15 pb-8">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block mb-2">
            Tayyabs.Designs • Designer Profile
          </span>
          <h1 className="text-4xl sm:text-6xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
            About Tayyabs.Designs
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#201C18] border border-[#D1C7BB]/20 text-[#D1C7BB] text-[10px] font-bold uppercase tracking-widest rounded">
              <ShieldCheck className="w-4 h-4" /> 50+ Global Brand Collaborations
            </div>

            <h2 className="text-3xl sm:text-5xl font-editorial-heading font-black text-[#F2EDE4]">
              "Designing Identity Into Every Thread."
            </h2>

            <p className="text-sm md:text-base text-[#D1C7BB]/90 leading-relaxed font-light">
              Tayyabs.Designs is an independent clothing design portfolio built through collaborations with more than 50 fashion brands. From culturally inspired garments to experimental streetwear graphics, every project is developed with its own visual identity, concept and purpose.
            </p>

            <p className="text-xs md:text-sm text-[#A99E92] leading-relaxed">
              I believe clothing is not merely fabric with a logo slapped on top—it is a physical medium of cultural expression and personal statement. My role is to bridge high-level artistic vision with exact technical print execution.
            </p>
          </div>

          <div className="lg:col-span-6 liquid-glass bg-[#171614] border border-[#D1C7BB]/25 p-4 rounded-2xl">
            <img
              src={workspaceMockup}
              alt="Tayyabs.Designs Workspace & Tech Pack Setup"
              className="w-full aspect-[4/3] object-cover rounded"
            />
            <span className="block text-center text-[10px] uppercase tracking-widest text-[#A99E92] mt-3">
              Tayyabs.Designs Tech Pack & Apparel Vector Studio
            </span>
          </div>
        </div>

        <div className="space-y-8 border-t border-[#D1C7BB]/15 pt-16">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#D1C7BB]" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92]">
              Technical Expertise
            </span>
          </div>

          <h2 className="text-3xl font-editorial-heading font-black text-[#F2EDE4]">
            Skills & Production Software
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsList.map((skill, idx) => (
              <div key={idx} className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 p-6 rounded space-y-2">
                <span className="font-bold text-[#F2EDE4] text-sm uppercase tracking-wider block">
                  {skill.title}
                </span>
                <p className="text-xs text-[#A99E92] leading-relaxed">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 border-t border-[#D1C7BB]/15 pt-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block">
            Milestones
          </span>
          <h2 className="text-3xl font-editorial-heading font-black text-[#F2EDE4]">
            Collaboration Timeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelineEvents.map((ev, idx) => (
              <div key={idx} className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 p-6 rounded space-y-3">
                <span className="text-sm font-mono font-bold text-[#D1C7BB] block">{ev.year}</span>
                <h3 className="font-bold text-[#F2EDE4] text-base">{ev.title}</h3>
                <p className="text-xs text-[#A99E92] leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 p-10 rounded text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
            Ready to collaborate on your brand's next collection?
          </h2>
          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3.5 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#E98156] transition-colors inline-flex items-center gap-2"
          >
            Start a Project <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};



