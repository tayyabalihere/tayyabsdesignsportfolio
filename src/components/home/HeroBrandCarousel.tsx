import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { animate, createScope } from 'animejs';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { withOriginalArtwork } from '../../data/projectArtwork';
import './hero-brand-carousel.css';

const designStories: Record<string, string> = {
  'rebel-x-outfits-la-makan': 'Cultural heritage,\nreimagined for the street.',
  'bikhata-persian-carpet-tee': 'Woven traditions.\nA contemporary voice.',
  'pakistani-truck-art-tee': 'The art of the road,\nmade wearable.',
  'stray-pets-loves-tee': 'A little rebellion.\nA lot of heart.',
  'palestine-olive-dome-bomber': 'Rooted in culture.\nCarried with pride.',
  'elzari-spider-web-jersey': 'Precision in every line.\nEnergy in every thread.',
};

export function HeroBrandCarousel({ navigate, align = 'center', variant = 'carousel' }: { navigate: (path: string) => void; align?: 'center' | 'start'; variant?: 'carousel' | 'stack' }) {
  const stacked = variant === 'stack';
  const sealId = `brand-seal-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const { projects } = useCMS();
  const designs = useMemo(() => {
    const brands = new Set<string>();
    return projects.map(withOriginalArtwork).filter(project => {
      if (project.isDraft || !project.mockups.heroMockup.startsWith('/uploads/') || brands.has(project.brandId)) return false;
      brands.add(project.brandId);
      return true;
    }).slice(0, 6);
  }, [projects]);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [stageHovered, setStageHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [spreadOpen, setSpreadOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const active = designs.length ? selected % designs.length : 0;
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const dragged = useRef(false);
  const step = (direction: number) => setSelected(value => (value + direction + designs.length) % designs.length);
  const expanded = stacked && (stageHovered || focused || spreadOpen);
  const playing = !paused && !hovered && !focused && !expanded && inView && pageVisible && !reducedMotion;

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(motion.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(entries => setInView(entries.some(entry => entry.isIntersecting)), { threshold: .25 });
    if (root.current) observer.observe(root.current);
    motion.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || designs.length < 2) return;
    const timer = window.setTimeout(() => setSelected(value => (value + 1) % designs.length), stacked ? 5000 : 3200);
    return () => window.clearTimeout(timer);
  }, [playing, active, designs.length, stacked]);

  useEffect(() => {
    const scope = createScope({ root, mediaQueries: { reduced: '(prefers-reduced-motion: reduce)' } }).add(self => {
      if (self?.matches.reduced || !designs.length) return;
      animate('.is-selected .hero-brand-art', { opacity: [.7, 1], scale: [1.025, 1], duration: 850, ease: 'out(4)' });
      animate('.is-selected .hero-brand-shine', { x: ['-150%', '150%'], opacity: [0, .5, 0], duration: 1100, ease: 'inOut(2)' });
      if (stacked) {
        const card = root.current?.querySelector('.hero-brand-card.is-selected');
        const shuffle = card?.animate([
          { translate: '0 20px', rotate: '-2.5deg', filter: 'brightness(.8)' },
          { translate: '0 -7px', rotate: '1deg', filter: 'brightness(1)', offset: .65 },
          { translate: '0 0', rotate: '0deg', filter: 'brightness(1)' },
        ], { duration: 1050, easing: 'cubic-bezier(.22,.8,.2,1)' });
        return () => shuffle?.cancel();
      }
    });
    return () => scope.revert();
  }, [active, designs.length, stacked]);

  if (!designs.length) return null;
  return <div ref={root} className={`hero-brand-carousel${align === 'start' ? ' is-left-aligned' : ''}${stacked ? ' is-brand-stack' : ''}${expanded ? ' is-expanded' : ''}${playing ? ' is-motion-live' : ''}`} data-no-scroll-reveal role="region" aria-roledescription="carousel" aria-label="Original designs by brand"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => { setHovered(false); setStageHovered(false); pointer.current = null; }}
    onPointerDownCapture={() => setFocused(false)}
    onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(true); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="hero-carousel-topline"><span>THE BRAND EDIT / ORIGINAL ARTWORK</span><span>DIFFERENT BRANDS. DISTINCT IDENTITIES.</span></div>
    <div className="hero-brand-stage"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setStageHovered(true); }}
      onPointerLeave={() => setStageHovered(false)}
      onPointerDown={event => { pointer.current = event.clientX; dragged.current = false; }}
      onPointerUp={event => {
        if (pointer.current === null) return;
        const distance = event.clientX - pointer.current;
        pointer.current = null;
        if (Math.abs(distance) > 45) { dragged.current = true; step(distance < 0 ? 1 : -1); }
      }}
      onPointerCancel={() => { pointer.current = null; }}
      onClickCapture={event => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}>
      <div className="hero-carousel-halo" aria-hidden="true" />
      {designs.map((project, index) => {
        let offset = (index - active + designs.length) % designs.length;
        if (offset > designs.length / 2) offset -= designs.length;
        const isActive = offset === 0;
        const visible = expanded || (stacked || align === 'start' ? offset >= 0 && offset <= 2 : Math.abs(offset) <= 1);
        const curveAt = (t: number) => stacked ? 0 : offset < 0 ? t * t : offset > 0 ? (1 - t) ** 2 : 0;
        const curveEdge = (t: number) => (curveAt(t) * .09 + (isActive ? 0 : .008)) * 100;
        const topEdge = Array.from({ length: 33 }, (_, i) => `${i / 32 * 100}% ${curveEdge(i / 32)}%`);
        const bottomEdge = Array.from({ length: 33 }, (_, i) => `${(32 - i) / 32 * 100}% ${100 - curveEdge((32 - i) / 32)}%`);
        return <button key={project.id} type="button" className={`hero-brand-card liquid-glass${isActive ? ' is-selected' : ''}`}
          style={{ '--slot': offset, '--distance': Math.abs(offset), '--side': Math.sign(offset), '--grid-x': index % 3 - 1, '--grid-y': Math.floor(index / 3), '--mobile-x': index % 2 - .5, '--mobile-y': Math.floor(index / 2), zIndex: 10 - Math.abs(offset), opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' } as CSSProperties}
          tabIndex={isActive || expanded ? 0 : -1} aria-hidden={!visible} aria-label={isActive || expanded ? `Explore ${project.brandName}: ${project.title.split('//')[0].trim()}` : `Show ${project.brandName} design`}
          onClick={() => isActive || expanded ? navigate(`/work/${project.slug}`) : setSelected(index)}>
          <div className="hero-brand-card-top"><span><i />{project.brandName}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
          <div className="hero-brand-art" style={{ clipPath: `polygon(${[...topEdge, ...bottomEdge].join(',')})` }}>
            <img className="hero-brand-accessible-image" src={project.mockups.heroMockup} alt={project.title} draggable={false} fetchPriority={index === 0 ? 'high' : 'auto'} />
            {!stacked && <div className="hero-brand-curved-art" aria-hidden="true">{Array.from({ length: 32 }, (_, slice) => {
              const curve = curveAt((slice + .5) / 32);
              return <span className="hero-brand-slice" key={slice} style={{ left: `${slice / 32 * 100}%`, '--curve': curve } as CSSProperties}>
                <img src={project.mockups.heroMockup} alt="" draggable={false} style={{ left: `calc(${-slice * 100}% + ${slice * .5}px)` }} />
              </span>;
            })}</div>}
            <span className="hero-brand-shine" aria-hidden="true" />
          </div>
          <div className="hero-brand-card-bottom"><span><small>{project.category}</small><strong>{project.title.split('//')[0].trim()}</strong></span><span className="hero-brand-open"><ArrowUpRight size={19} /></span></div>
          <div className="hero-brand-registration" aria-hidden="true"><span>DESIGNED BY TAYYABS.DESIGNS</span><span>{project.year}</span></div>
        </button>;
      })}
      {stacked && <div className="brand-original-seal" aria-hidden="true">
        <svg viewBox="0 0 100 100"><defs><path id={sealId} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" /></defs><text><textPath href={`#${sealId}`} textLength="226">ORIGINAL ARTWORK • WEARABLE STORIES • </textPath></text></svg>
        <span>✳</span>
      </div>}
      {stacked && <aside className="brand-story-note liquid-glass" aria-label="Design story">
        <span>{String(active + 1).padStart(2, '0')} / THE STORY</span>
        <p key={designs[active].id}>{designStories[designs[active].slug] || designs[active].creativeDirection.concept}</p>
        <i aria-hidden="true">+</i>
      </aside>}
    </div>
    <div className="hero-brand-controls">
      {stacked ? <button className="brand-stack-caption brand-stack-expand" onClick={() => setSpreadOpen(value => !value)} aria-expanded={expanded}>{spreadOpen ? 'Back to stack' : 'View all brands'} <ArrowUpRight size={12} /></button> : <>
      <button className="hero-carousel-arrow" onClick={() => step(-1)} aria-label="Previous brand design"><ArrowLeft size={18} /></button>
      <div className="hero-brand-pagination">{designs.map((project, index) => <button key={project.id} onClick={() => setSelected(index)} aria-label={`Show design ${index + 1}: ${project.brandName}`} aria-pressed={active === index}><span /></button>)}</div>
      <button className="hero-carousel-arrow" onClick={() => step(1)} aria-label="Next brand design"><ArrowRight size={18} /></button>
      </>}
      <button className="hero-carousel-arrow hero-autoplay-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume automatic rotation' : 'Pause automatic rotation'} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
    </div>
    <p className="hero-brand-current" aria-live={playing ? 'off' : 'polite'} aria-atomic="true"><span>{String(active + 1).padStart(2, '0')} / {String(designs.length).padStart(2, '0')}</span>{!stacked && designs[active].brandName}</p>
  </div>;
}
