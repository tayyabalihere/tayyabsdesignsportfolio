import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

export function useSectionProgress<T extends HTMLElement>(update: (element: T, progress: number) => void) {
  const ref = useRef<T>(null);
  const callback = useRef(update);
  callback.current = update;
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let active = false;
    let frame = 0;
    const render = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      callback.current(element, reduced.matches ? 1 : progress);
    };
    const schedule = () => { if (active && !frame) frame = requestAnimationFrame(render); };
    const observer = new IntersectionObserver(entries => {
      active = entries[0].isIntersecting;
      element.classList.toggle('motion-in-view', active);
      if (active) schedule();
    }, { rootMargin: '80px' });
    observer.observe(element);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
  }, []);
  return ref;
}

export function MotionReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { element.classList.add('is-revealed'); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`motion-reveal ${className}`}>{children}</div>;
}

export function MotionMarquee<T>({ items, renderItem, className = '', duration = 56, reverse = false, label, minimumItems = 0 }: {
  items: T[]; renderItem: (item: T, index: number, duplicate: boolean) => ReactNode;
  className?: string; duration?: number; reverse?: boolean; label: string; minimumItems?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const update = () => element.classList.toggle('marquee-idle', !visible || document.hidden);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  if (!items.length) return null;
  const repetitions = Math.max(1, Math.ceil(minimumItems / items.length));
  const repeatedItems = Array.from({ length: repetitions * items.length }, (_, index) => items[index % items.length]);
  return <div ref={ref} className={`motion-marquee ${className} ${reverse ? 'is-reverse' : ''}`} aria-label={label}>
    <div className="motion-marquee-track" style={{ '--marquee-time': `${duration * repetitions}s` } as CSSProperties}>
      {[0, 1].map(copy => <div className="motion-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {repeatedItems.map((item, index) => <div className="motion-marquee-item" key={index} aria-hidden={index >= items.length ? true : undefined}>{renderItem(item, index % items.length, copy === 1 || index >= items.length)}</div>)}
      </div>)}
    </div>
  </div>;
}

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1500);
        element.textContent = Math.round(value * (1 - (1 - progress) ** 3)).toLocaleString();
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      element.textContent = '0';
      frame = requestAnimationFrame(tick);
    }, { threshold: .5 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span className="stat-value" ref={ref}>{value.toLocaleString()}</span>;
}

const about = "I'm Tayyab, an independent designer building my own approach across clothing, graphics and culture. I work with brands on apparel, visual identity and creative direction—from the first idea to the final garment.";

export function ScrollStatement() {
  const ref = useSectionProgress<HTMLElement>((element, progress) => {
    const words = element.querySelectorAll<HTMLElement>('.statement-word');
    const reveal = Math.max(0, Math.min(1, (progress - .16) / .56));
    words.forEach((word, index) => {
      const light = Math.max(0, Math.min(1, reveal * words.length - index));
      word.style.color = `rgb(${Math.round(48 + light * 195)} ${Math.round(60 + light * 184)} ${Math.round(69 + light * 175)})`;
    });
  });
  return <section ref={ref} className="scroll-statement" id="about"><div className="statement-sticky"><span className="section-label">( About )</span><h2 aria-label={about}>{about.split(' ').map((word, index) => <span className="statement-word" aria-hidden="true" key={index}>{word}{' '}</span>)}</h2></div></section>;
}

export function SignatureFeature({ navigate }: { navigate: (path: string) => void }) {
  const ref = useSectionProgress<HTMLElement>((element, progress) => {
    element.style.setProperty('--signature-drift', `${(progress - .5) * -180}px`);
  });
  const message = 'TAYYABS.DESIGNS. Everything we create starts with identity. ';
  return <section className="signature-feature" ref={ref} aria-label="Tayyabs.Designs studio">
    <div className="signature-markers" aria-hidden="true">{[0, 1, 2, 3].map(index => <span key={index}>+</span>)}</div>
    <div className="signature-center"><div className="signature-frame"><img src="/portrait/tayyab-mobile.webp" alt="Tayyab Ali" loading="lazy" decoding="async" width="640" height="853" /></div><button className="outline-link" onClick={() => navigate('/contact')}>Work with Tayyab</button></div>
    <div className="signature-type-rail" aria-hidden="true"><div>{message}{message}</div></div>
  </section>;
}

export function EndBrandReveal() {
  const ref = useSectionProgress<HTMLElement>((element) => {
    const rect = element.getBoundingClientRect();
    const reveal = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : Math.max(0, Math.min(1, (innerHeight - rect.top) / Math.max(1, rect.height)));
    element.style.setProperty('--end-offset', `${(1 - reveal) * 100}%`);
  });
  return <section className="end-brand-stage" ref={ref} aria-label="Tayyabs.Designs"><div className="end-brand-panel"><span className="end-brand-wordmark">TAYYABS<sup>®</sup></span><p>Everything<br />we create starts{' '}<br />with identity.</p></div></section>;
}
