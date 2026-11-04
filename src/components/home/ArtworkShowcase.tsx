import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { animate, createScope } from 'animejs';
import { ArrowUpRight, MoveUpRight, Plus, RotateCw } from 'lucide-react';
import { Hero3DGarment } from './Hero3DGarment';
import './artwork-showcase.css';

export function ArtworkShowcase({ navigate }: { navigate: (path: string) => void }) {
  const [view, setView] = useState<'front' | 'back' | '3d'>('front');
  const root = useRef<HTMLDivElement>(null);
  const depth = useRef<HTMLDivElement>(null);
  const isBack = view === 'back';
  const project = () => navigate('/work/rebel-x-outfits-la-makan');

  useEffect(() => {
    const scope = createScope({ root, mediaQueries: { reduced: '(prefers-reduced-motion: reduce)' } }).add(self => {
      if (self?.matches.reduced || view === '3d') return;
      const card = animate('.folio-card-motion', {
        y: [30, 0], rotateY: [isBack ? -13 : 13, 0], scale: [.96, 1],
        opacity: [.5, 1], duration: 950, ease: 'out(4)', autoplay: false,
      });
      const sheet = animate('.folio-secondary', { x: [-22, 0], rotate: [0, 9], duration: 1100, ease: 'out(4)', autoplay: false });
      const detail = animate('.folio-detail', { y: [24, 0], rotate: [10, 4], opacity: [0, 1], delay: 180, duration: 900, ease: 'out(4)', autoplay: false });
      const shine = animate('.folio-light-pass', { x: ['-160%', '160%'], opacity: [0, .55, 0], duration: 1400, ease: 'inOut(2)', autoplay: false });
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        card.play(); sheet.play(); detail.play(); shine.play(); observer.disconnect();
      }, { threshold: .2 });
      if (root.current) observer.observe(root.current);
      return () => observer.disconnect();
    });
    return () => scope.revert();
  }, [view, isBack]);

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || view === '3d') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    depth.current?.style.setProperty('--folio-x', `${x * 7}deg`);
    depth.current?.style.setProperty('--folio-y', `${-y * 5}deg`);
    depth.current?.style.setProperty('--light-x', `${50 + x * 60}%`);
  };
  const resetTilt = () => {
    depth.current?.style.setProperty('--folio-x', '0deg');
    depth.current?.style.setProperty('--folio-y', '0deg');
    depth.current?.style.setProperty('--light-x', '50%');
  };

  return <div ref={root} className="creative-art-direction archive-showcase" data-no-scroll-reveal>
    <div className="art-stage-caption"><span>SELECTED ARTICLE / 001</span><span>CONCEPT → GARMENT</span></div>
    <div className={`art-stage folio-stage${view === '3d' ? ' is-3d' : ''}`} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div className="folio-depth" ref={depth}>
        <span className="art-cross art-cross-top" aria-hidden="true"><Plus size={19} /></span>
        {view !== '3d' && <>
          <div className="folio-outline" aria-hidden="true" />
          <button className="art-back-sheet liquid-glass folio-secondary" onClick={() => setView(isBack ? 'front' : 'back')} aria-label={isBack ? 'Show front artwork' : 'Show back artwork'}>
            <img src={`/uploads/rebel-x-makan-${isBack ? 'front' : 'back'}.png`} alt="" />
            <span>{isBack ? 'FRONT' : 'BACK'} / 02 <ArrowUpRight size={13} /></span>
          </button>
        </>}
        <div className="folio-card-motion">
          <div className="liquid-glass garment-showcase creative-garment-card folio-primary">
            <div className="showcase-topline"><span><i /> REBEL X OUTFITS</span><span className="folio-project-name">LA–MAKAN ↗</span></div>
            <div className="folio-art-window">
              {view === '3d' ? <Hero3DGarment /> : <button className="garment-artwork-button" onClick={project} aria-label="Explore the La-Makan case study">
                <img src={`/uploads/rebel-x-makan-${isBack ? 'back' : 'front'}.png`} alt={isBack ? 'Original La-Makan back artwork with architectural illustration' : 'Original La-Makan navy tee with Rebel lettering and Urdu artwork'} fetchPriority="high" />
                <span className="folio-image-caption">{isBack ? '02 — BACK PRINT' : '01 — FRONT PRINT'}</span>
                <span className="folio-light-pass" aria-hidden="true" />
              </button>}
            </div>
            <div className="artwork-card-footer folio-footer"><span>Cultural heritage,<br /><strong>reinterpreted.</strong></span><button onClick={project} aria-label="Open La-Makan project"><MoveUpRight size={20} /></button></div>
            <div className="folio-registration" aria-hidden="true"><span>ORIGINAL DESIGN / TD—001</span><span className="folio-barcode" /><span>© 2025</span></div>
          </div>
        </div>
        {view !== '3d' && <div className="art-note liquid-glass folio-detail">
          <div className="folio-detail-lens"><img src={`/uploads/rebel-x-makan-${isBack ? 'back' : 'front'}-detail.png`} alt="" /></div>
          <div><span>THE DETAILS MATTER</span><p>Original artwork.<br /><em>Wearable stories.</em></p></div>
          <span className="folio-detail-cross" aria-hidden="true">+</span>
        </div>}
      </div>
    </div>
    <div className="folio-control-row"><span className="folio-view-label">THE ARCHIVE <span>/ {isBack ? '02' : view === '3d' ? '03' : '01'}</span></span>
      <div className="showcase-controls" role="group" aria-label="Garment view">{(['front', 'back', '3d'] as const).map(item => <button key={item} aria-pressed={view === item} onClick={() => setView(item)} className={view === item ? 'is-active' : ''}>{item === '3d' ? <><RotateCw size={12} />3D view</> : item + ' view'}</button>)}</div>
    </div>
  </div>;
}
