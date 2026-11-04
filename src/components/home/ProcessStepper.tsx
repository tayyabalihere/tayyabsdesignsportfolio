import React, { useState } from 'react';
import { Search, Compass, PenTool, Sliders, CheckCircle } from 'lucide-react';
import { DimensionalHeading } from '../common/DimensionalHeading';

export const ProcessStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Discover',
      subtitle: 'Brief & Brand Identity Analysis',
      desc: 'We analyze your clothing brand story, target audience, garment cuts (oversized, classic, boxy), and collection objectives to clarify the design challenge.',
      icon: Search,
      deliverable: 'Project Scope & Aesthetic Goals',
    },
    {
      num: '02',
      title: 'Direction',
      subtitle: 'Moodboard & Visual Concept',
      desc: 'Developing curated visual references, typography directions, monochromatic color swatches, and preliminary sketch thumbnail concepts.',
      icon: Compass,
      deliverable: 'Creative Direction Moodboard',
    },
    {
      num: '03',
      title: 'Design',
      subtitle: 'Vector Artwork & Placement',
      desc: 'Executing custom vector illustrations, gothic typography letterforms, and positioning graphics onto 1:1 scale garment patterns with millimeter precision.',
      icon: PenTool,
      deliverable: 'Vector Artwork Drafts & Mockups',
    },
    {
      num: '04',
      title: 'Refine',
      subtitle: 'Feedback & Print Optimization',
      desc: 'Refining typography scales, tweaking line weights for screen printing or embroidery, and finalizing fabric colorways based on your feedback.',
      icon: Sliders,
      deliverable: 'Final Approved Design Deck',
    },
    {
      num: '05',
      title: 'Deliver',
      subtitle: 'Production Tech Packs & Print Files',
      desc: 'Generating spot-color print separations, PMS color callouts, print technique specifications (puff/discharge), and comprehensive factory tech pack PDFs.',
      icon: CheckCircle,
      deliverable: '100% Factory-Ready File Package',
    },
  ];

  const currentStep = steps[activeStep];
  const CurrentIcon = currentStep.icon;

  return (
    <section className="py-24 bg-[#101010] border-b border-[#3A332D] relative overflow-hidden">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#F2EDE4_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <DimensionalHeading
            eyebrow="04 // WORKFLOW METHODOLOGY"
            subtitle="Click through each stage to explore how we transition raw ideas into commercial clothing drops."
          >
            5-Stage Apparel Design Process
          </DimensionalHeading>
        </div>

        {/* 3D SPATIAL STEP NAVIGATOR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            const Icon = step.icon;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                id={`process-step-btn-${idx + 1}`}
                data-scroll-reveal="process-step"
                style={{
                  transform: isActive
                    ? 'perspective(1000px) translateZ(20px) translateY(-6px)'
                    : 'perspective(1000px) translateZ(0px)',
                  transformStyle: 'preserve-3d',
                }}
                className={`p-4 md:p-5 rounded-xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#201C18] border-[#F2EDE4] text-[#F2EDE4] shadow-[0_10px_30px_rgba(255,255,255,0.15)]'
                    : 'liquid-glass bg-[#171614] border-[#3A332D] text-[#A99E92] hover:border-[#F2EDE4]/40 hover:text-[#F2EDE4]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#F2EDE4]">{step.num}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2EDE4]' : 'text-[#A99E92]'}`} />
                </div>

                <span className="font-editorial-heading font-bold text-sm md:text-base uppercase tracking-wider block">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE STAGE 3D DETAIL PANEL */}
        <div
          style={{ transform: 'perspective(1000px) translateZ(10px)' }}
          className="liquid-glass bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4]/40 p-8 md:p-12 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl transition-all"
        >
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-widest text-[#101010] bg-[#F2EDE4] px-3 py-1 font-bold rounded">
                Stage {currentStep.num}
              </span>
              <h3 className="font-editorial-heading font-bold text-2xl md:text-3xl text-[#F2EDE4]">
                {currentStep.title} — {currentStep.subtitle}
              </h3>
            </div>

            <p className="text-sm md:text-base text-[#A99E92] leading-relaxed font-light">
              {currentStep.desc}
            </p>

            <div className="pt-4 flex items-center gap-3 border-t border-[#3A332D]">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A99E92]">Key Deliverable:</span>
              <span className="text-xs font-bold font-mono text-[#F2EDE4] bg-[#201C18] px-3 py-1 rounded border border-[#3A332D]">
                {currentStep.deliverable}
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#101010] border border-[#3A332D] rounded-xl text-center space-y-3 shadow-inner">
            <CurrentIcon className="w-10 h-10 text-[#F2EDE4] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F2EDE4]">
              {currentStep.title} VERIFIED
            </span>
            <span className="text-[10px] font-mono text-[#A99E92]">
              1:1 APPAREL TECH SPEC WORKFLOW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};


