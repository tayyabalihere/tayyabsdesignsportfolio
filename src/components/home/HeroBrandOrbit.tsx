import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { animate } from 'animejs';
import { Pause, Play } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { withOriginalArtwork } from '../../data/projectArtwork';
import './hero-brand-orbit.css';

const SURFACE_SLICES = 24;
const curvePoint = (t: number, bottom = false) => {
  const bend = `var(--bend-left,0) * ${t * t * 15}% + var(--bend-right,0) * ${(1 - t) ** 2 * 15}% + var(--bend-inset,0) * 1%`;
  return `${t * 100}% calc(${bottom ? `100% - (${bend})` : bend})`;
};
const surfaceClip = `polygon(${[
  ...Array.from({ length: 33 }, (_, i) => curvePoint(i / 32)),
  ...Array.from({ length: 33 }, (_, i) => curvePoint((32 - i) / 32, true)),
].join(',')})`;

export function HeroBrandOrbit({ navigate }: { navigate: (path: string) => void }) {
  const { projects } = useCMS();
  const designs = useMemo(() => {
    const brands = new Set<string>();
    return projects.map(withOriginalArtwork).filter(project => {
      if (project.isDraft || !project.mockups.heroMockup.startsWith('/uploads/') || brands.has(project.brandId)) return false;
      brands.add(project.brandId);
      return true;
    }).slice(0, 6);
  }, [projects]);
  const root = useRef<HTMLDivElement>(null);
  const clock = useRef({ angle: 0 });
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduced(motion.matches);
    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)));
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
    const element = root.current;
    if (!element || !designs.length) return;
    const cards = Array.from(element.querySelectorAll<HTMLElement>('[data-orbit-card]'));
    let width = element.clientWidth;
    let height = element.clientHeight;
    const draw = () => {
      const mobile = width <= 700;
      const radiusX = Math.min(width * (mobile ? .5 : .405), 595);
      const radiusY = height * (mobile ? .37 : .34);
      cards.forEach((card, index) => {
        const degrees = clock.current.angle + index * 360 / cards.length;
        const radians = degrees * Math.PI / 180;
        const x = Math.sin(radians) * radiusX;
        const y = -Math.cos(radians) * radiusY;
        const depth = (Math.cos(radians) + 1) / 2;
        const side = Math.sin(radians);
        card.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) perspective(850px) rotateY(${(-side * 38).toFixed(2)}deg) rotateZ(${(side * 5).toFixed(2)}deg) scale(${(.84 + depth * .16).toFixed(3)})`;
        card.style.setProperty('--bend-left', Math.max(0, -side).toFixed(3));
        card.style.setProperty('--bend-right', Math.max(0, side).toFixed(3));
        card.style.setProperty('--bend-inset', (Math.abs(side) * .8).toFixed(3));
        card.style.opacity = String(.66 + depth * .34);
        card.dataset.orbitAngle = (degrees % 360).toFixed(2);
      });
      element.dataset.ready = 'true';
    };
    draw();
    const resize = new ResizeObserver(() => { width = element.clientWidth; height = element.clientHeight; draw(); });
    resize.observe(element);
    const animation = animate(clock.current, {
      angle: [clock.current.angle, clock.current.angle + 360],
      duration: 65000, ease: 'linear', loop: true,
      autoplay: !paused && !focused && visible && pageVisible && !reduced,
      onUpdate: draw,
    });
    return () => { animation.cancel(); resize.disconnect(); clock.current.angle %= 360; };
  }, [designs, paused, focused, visible, pageVisible, reduced]);

  return <div className="hero-brand-orbit" ref={root} data-no-scroll-reveal aria-label="Orbit of original brand designs"
    onFocusCapture={event => { if (event.target.matches('[data-orbit-card]')) setFocused(true); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget) || !(event.relatedTarget instanceof Element && event.relatedTarget.matches('[data-orbit-card]'))) setFocused(false); }}>
    <div className="brand-orbit-guide" aria-hidden="true" />
    <div className="brand-orbit-cards">
      {designs.map((project, index) => <button key={project.id} data-orbit-card className="brand-orbit-card"
        aria-label={`Explore ${project.brandName}: ${project.title.split('//')[0].trim()}`} onClick={() => navigate(`/work/${project.slug}`)}>
        <div className="orbit-card-surface" style={{ clipPath: surfaceClip }}>
          <img className="orbit-card-accessible-image" src={project.mockups.heroMockup} alt={project.title} draggable={false} fetchPriority={index === 0 ? 'high' : 'auto'} />
          <div className="orbit-card-mesh" aria-hidden="true">{Array.from({ length: SURFACE_SLICES }, (_, slice) => {
            const t = (slice + .5) / SURFACE_SLICES;
            return <span key={slice} className="orbit-card-slice" style={{ left: `${slice / SURFACE_SLICES * 100}%`, '--curve-left': t * t, '--curve-right': (1 - t) ** 2 } as CSSProperties}>
              <img src={project.mockups.heroMockup} alt="" draggable={false} style={{ left: `${-slice * 100}%` }} />
            </span>;
          })}</div>
        </div>
        <span className="brand-orbit-card-label"><span>{project.brandName}</span><span>{String(index + 1).padStart(2, '0')}</span></span>
        <span className="brand-orbit-card-title">{project.title.split('//')[0].trim()}</span>
      </button>)}
    </div>
    <div className="brand-orbit-bottom"><span>ORBITING ORIGINALS / {String(designs.length).padStart(2, '0')} BRANDS</span>
      <button className="brand-orbit-toggle" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume card orbit' : 'Pause card orbit'} aria-pressed={paused}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Resume orbit' : 'Live orbit'}</span></button>
    </div>
  </div>;
}
