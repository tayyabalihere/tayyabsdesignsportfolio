import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Compass, Flame, Ruler, RotateCw, Plus, MoveUpRight, Pause, Play } from 'lucide-react';
import { Hero3DGarment } from './Hero3DGarment';
import './hero-editorial.css';

export const Hero: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [view, setView] = useState<'front' | 'back' | '3d'>('front');
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const isBack = view === 'back';

  useEffect(() => () => cancelAnimationFrame(pointerFrame.current), []);

  const moveStage = (event: React.PointerEvent<HTMLDivElement>) => {
    if (view === '3d' || paused || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      stageRef.current?.style.setProperty('--stage-turn-x', (-y * 7).toFixed(2) + 'deg');
      stageRef.current?.style.setProperty('--stage-turn-y', (x * 9).toFixed(2) + 'deg');
    });
  };
  const resetStage = () => {
    cancelAnimationFrame(pointerFrame.current);
    stageRef.current?.style.setProperty('--stage-turn-x', '0deg');
    stageRef.current?.style.setProperty('--stage-turn-y', '0deg');
  };
  const changeView = (next: 'front' | 'back' | '3d') => { resetStage(); setView(next); };

  return <section className={paused ? 'original-hero creative-hero hero-motion-paused' : 'original-hero creative-hero'}>
    <div className="hero-atmosphere" aria-hidden="true"><div className="hero-orbit" /><div className="hero-ambient-light" /><span className="hero-outline-word">TAYYAB.</span></div>
    <div className="creative-hero-inner">
      <div className="hero-edition-row"><span><i /> INDEPENDENT CLOTHING DESIGNER</span><span>ART DIRECTION / APPAREL / CULTURE</span></div>
      <div className="creative-hero-layout">
        <div className="creative-hero-content">
          <p className="hero-kicker"><span className="hero-kicker-index">01 /</span> A POINT OF VIEW, MADE WEARABLE.</p>
          <h1 className="hero-heading-title font-editorial-heading" aria-label="Clothing identity">
            <span className="hero-type-line" aria-hidden="true">{'CLOTHING'.split('').map((letter, i) => <span key={i} style={{ '--letter-delay': i * 45 + 'ms' } as React.CSSProperties}>{letter}</span>)}</span>
            <span className="hero-type-line hero-type-identity" aria-hidden="true">{'IDENTITY'.split('').map((letter, i) => <span key={i} style={{ '--letter-delay': (i * 45 + 180) + 'ms', '--letter-tone': ['#F2EDE4', '#EEE2D4', '#E7CFBB', '#DFB99D', '#DC9F7E', '#DB8B61', '#D97748', '#D96A3B'][i] } as React.CSSProperties}>{letter}</span>)}</span>
            <span className="hero-title-star" aria-hidden="true">✳</span>
          </h1>
          <p className="hero-handwritten"><span>A story in</span> every thread.<svg viewBox="0 0 250 14" aria-hidden="true"><path d="M3 10 Q100 -2 246 6 M22 13 Q130 4 230 10" /></svg></p>
          <p className="creative-hero-description">Culture becomes a graphic. A graphic becomes a garment. I turn bold ideas into clothing with its own visual language.</p>
          <div className="hero-creative-actions">
            <button id="hero-view-my-work-btn" className="warm-primary-button hero-main-cta" onClick={() => navigate('/work')}><span>Explore my work</span><span className="hero-cta-icon"><ArrowUpRight size={18} /></span></button>
            <button id="hero-lets-work-together-btn" className="hero-secondary-action" onClick={() => navigate('/contact')}>Let’s create your next drop <ArrowUpRight size={17} /></button>
          </div>
          <div className="hero-discipline-list"><span><Flame size={13} />Streetwear graphics</span><span><Compass size={13} />Cultural apparel</span><span><Ruler size={13} />Tech packs</span></div>
          <div className="hero-word-loop" aria-label="Culture, expression and identity"><span>DESIGNED FOR</span><div aria-hidden="true"><span>culture.<br />expression.<br />identity.<br />culture.</span></div></div>
        </div>
        <div className="creative-art-direction">
          <div className="art-stage-caption"><span><i /> FROM THE STUDIO ARCHIVE</span><button onClick={() => { resetStage(); setPaused(!paused); }} aria-label={paused ? 'Play hero animation' : 'Pause hero animation'} aria-pressed={paused}>{paused ? <Play size={12} /> : <Pause size={12} />}</button></div>
          <div ref={stageRef} className={view === '3d' ? 'art-stage is-3d' : 'art-stage'} onPointerMove={moveStage} onPointerLeave={resetStage}>
            <div className="hero-stage-orbit" aria-hidden="true"><span /></div>
            <div className="hero-motion-stack">
              {view !== '3d' && <button className="art-back-sheet liquid-glass" onClick={() => changeView(isBack ? 'front' : 'back')} aria-label={isBack ? 'Show front artwork' : 'Show back artwork'}>
                <img src={isBack ? '/uploads/rebel-x-makan-front.png' : '/uploads/rebel-x-makan-back.png'} alt="" />
                <span>{isBack ? 'FRONT' : 'BACK'} ARTWORK <ArrowUpRight size={13} /></span>
              </button>}
              <div className="liquid-glass garment-showcase creative-garment-card">
                <div className="showcase-topline"><span>REBEL X OUTFITS</span><span className="art-edition-tag">ARTICLE 001</span></div>
                {view === '3d' ? <Hero3DGarment /> : <button className="garment-artwork-button" onClick={() => navigate('/work/rebel-x-outfits-la-makan')} aria-label="Explore the La-Makan case study"><img key={view} src={isBack ? '/uploads/rebel-x-makan-back.png' : '/uploads/rebel-x-makan-front.png'} alt={isBack ? 'Original La-Makan back artwork with architectural illustration' : 'Original La-Makan navy tee with Rebel lettering and Urdu artwork'} fetchPriority="high" /><span className="hero-artwork-link">VIEW THE STORY <ArrowUpRight size={13} /></span></button>}
                <div className="artwork-card-footer"><div><span>CULTURAL HERITAGE / REINTERPRETED</span><h2>La–Makan<span>®</span></h2></div><button onClick={() => navigate('/work/rebel-x-outfits-la-makan')} aria-label="Open La-Makan project"><MoveUpRight size={21} /></button></div>
              </div>
              {view !== '3d' && <div className="hero-detail-print"><img src={isBack ? '/uploads/rebel-x-makan-back-detail.png' : '/uploads/rebel-x-makan-front-detail.png'} alt="Original La-Makan graphic detail" /><span><Plus size={11} /> THE FINER DETAILS</span></div>}
            </div>
            {view !== '3d' && <div className="hero-art-seal" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="hero-seal-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs><text><textPath href="#hero-seal-circle">ORIGINAL ARTWORK · WEARABLE STORIES · </textPath></text></svg><span>✳</span></div>}
          </div>
          <div className="hero-art-footer"><div className="showcase-controls" role="group" aria-label="Garment view">{(['front', 'back', '3d'] as const).map(item => <button key={item} aria-pressed={view === item} onClick={() => changeView(item)} className={view === item ? 'is-active' : ''}>{item === '3d' ? <><RotateCw size={12} />3D view</> : item + ' view'}</button>)}</div><span className="hero-view-index">{isBack ? '02' : view === '3d' ? '03' : '01'}<span>/03</span></span></div>
        </div>
      </div>
      <div className="creative-hero-baseline"><span>DESIGNED WITH INTENT. <span>WORN WITH IDENTITY.</span></span><a href="#selected-work"><span className="hero-scroll-icon"><ArrowDown size={14} /></span>SCROLL TO EXPLORE</a><span className="hero-baseline-mark">TAYYABS.DESIGNS ©</span></div>
    </div>
  </section>;
};
