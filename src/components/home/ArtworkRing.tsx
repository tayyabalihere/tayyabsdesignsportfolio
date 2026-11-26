import { useEffect, useRef } from 'react';
import type { Project } from '../../types';
import { portfolioImage } from '../../data/portfolioImages';

export function ArtworkRing({ projects, navigate }: { projects: Project[]; navigate: (path: string) => void }) {
  const scene = useRef<HTMLDivElement>(null);
  const items = projects.length ? Array.from({ length: 8 }, (_, index) => projects[index % projects.length]) : [];
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const cards = [...element.querySelectorAll<HTMLElement>('.orbit-artwork')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let frame = 0;
    let last = 0;
    let angle = 24;
    const render = () => {
      cards.forEach((card, index) => {
        const rotation = angle + index * 360 / cards.length;
        const depth = Math.cos(rotation * Math.PI / 180);
        card.style.transform = `rotateY(${rotation.toFixed(3)}deg) translateZ(var(--orbit-radius)) translateY(${(24 + depth * 95).toFixed(2)}px)`;
        card.style.opacity = String(.775 + depth * .225);
        card.style.zIndex = String(Math.round(300 + depth * 100));
      });
    };
    const tick = (now: number) => {
      if (last && now - last < 32) { frame = requestAnimationFrame(tick); return; }
      if (last) angle -= Math.min(now - last, 64) * .007;
      last = now;
      render();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      render();
      if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    sync();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, [projects.map(project => project.id).join(',')]);
  return <div className="artwork-orbit" ref={scene} aria-label="Explore apparel projects"><div className="artwork-orbit-track">
    {items.map((project, index) => <button className="orbit-artwork" key={`${project.id}-${index}`} onClick={() => navigate(`/work/${project.slug}`)} aria-label={`View ${project.title}`}>
      <span className="orbit-face orbit-front"><img src={portfolioImage(project.mockups.heroMockup, 'small')} alt="" width="360" height="360" decoding="async" /></span>
      <span className="orbit-face orbit-back" aria-hidden="true"><img src={portfolioImage(project.mockups.heroMockup, 'small')} alt="" width="360" height="360" decoding="async" /></span>
    </button>)}
  </div></div>;
}
