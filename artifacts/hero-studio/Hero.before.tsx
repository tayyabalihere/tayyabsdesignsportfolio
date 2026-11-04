import React from 'react';
import { ArrowDown, ArrowUpRight, Compass, Flame, Ruler } from 'lucide-react';
import { HeroBrandCarousel } from './HeroBrandCarousel';
import './hero-editorial.css';

export const Hero: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return <section className="original-hero creative-hero centered-hero relative overflow-hidden border-b border-[#3A332D]">
    <div className="hero-atmosphere" aria-hidden="true"><div className="hero-orbit" /><span className="hero-outline-word">STUDIO</span></div>
    <div className="creative-hero-inner">
      <div className="hero-edition-row"><span><i /> INDEPENDENT CLOTHING DESIGNER</span><span>ART DIRECTION / APPAREL / CULTURE</span></div>
      <div className="creative-hero-layout">
        <div className="creative-hero-content">
          <p className="hero-kicker"><span>01 — THE DESIGN PRACTICE</span><span className="hero-kicker-line" /></p>
          <h1 className="hero-heading-title font-editorial-heading"><span>CLOTHING</span><span className="warm-chrome-text">IDENTITY</span><span className="hero-title-star" aria-hidden="true">✳</span></h1>
          <p className="hero-handwritten">A story in every thread.</p>
          <p className="creative-hero-description">Culture becomes a graphic. A graphic becomes a garment.<br className="hidden sm:block" /> I create clothing identities that have something to say.</p>
          <div className="hero-creative-actions">
            <button id="hero-view-my-work-btn" className="warm-primary-button" onClick={() => navigate('/work')}>Explore my work <ArrowUpRight size={18} /></button>
            <button id="hero-lets-work-together-btn" className="hero-secondary-action" onClick={() => navigate('/contact')}>Let’s build your next drop <ArrowUpRight size={17} /></button>
          </div>
          <div className="hero-discipline-list">
            <span><Flame size={13} />Streetwear graphics</span><span><Compass size={13} />Cultural apparel</span><span><Ruler size={13} />Tech packs</span>
          </div>
        </div>
        <HeroBrandCarousel navigate={navigate} />
     </div>
      <div className="creative-hero-baseline"><span>DESIGNED WITH INTENT. <span>WORN WITH IDENTITY.</span></span><a href="#selected-work">Discover the archive <ArrowDown size={15} /></a></div>
    </div>
  </section>;
};
