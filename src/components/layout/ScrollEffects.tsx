import { useEffect, useRef } from 'react';
import './scroll-effects.css';

const REVEAL_TARGETS = 'h1, h2, .editorial-section-heading, .project-card, .brand-card, .story, .category-card, .liquid-glass, form, [data-scroll-reveal]';

type OriginalStyles = {
  opacity: string; translate: string; rotate: string; scale: string;
  clipPath: string; transformOrigin: string; willChange: string;
};
type MediaStyles = { translate: string; scale: string; willChange: string; offset: number };
type SectionState = { inside: boolean; initiallyVisible: boolean; animation?: Animation };
const SECTION_TARGETS = 'main section, main .portfolio-page > .max-w-7xl > *, footer, [data-scroll-section]';

export function ScrollEffects({ currentPath }: { currentPath: string }) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main || currentPath.startsWith('/admin')) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = window.matchMedia('(max-width: 767px)');
    const tracked = new Map<HTMLElement, OriginalStyles>();
    const pending = new Set<HTMLElement>();
    const animations = new Set<Animation>();
    const media = new Map<HTMLElement, MediaStyles>();
    const activeMedia = new Set<HTMLElement>();
    const sections = new Map<HTMLElement, SectionState>();
    let previousScroll = window.scrollY;
    let scrollDirection = 1;
    let progressFrame = 0;
    let scanFrame = 0;
    let disposed = false;

    const updateProgress = () => {
      progressFrame = 0;
      if (window.scrollY !== previousScroll) scrollDirection = window.scrollY > previousScroll ? 1 : -1;
      previousScroll = window.scrollY;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (!motion.matches) activeMedia.forEach(element => {
        const original = media.get(element);
        if (!original || !element.isConnected) return;
        const rect = element.getBoundingClientRect();
        const center = rect.top - original.offset + rect.height / 2;
        const zoom = smallScreen.matches ? 1.06 : 1.1;
        // Keep the image covering its frame throughout the parallax movement.
        const amplitude = Math.max(0, Math.min(smallScreen.matches ? 10 : 22, element.clientHeight * (zoom - 1) / 2 - 1));
        original.offset = Math.max(-amplitude, Math.min(amplitude, (window.innerHeight / 2 - center) / window.innerHeight * amplitude * 2));
        element.style.translate = `0 ${original.offset.toFixed(2)}px`;
        element.style.scale = String(zoom);
        element.style.willChange = 'translate';
      });
    };
    const scheduleProgress = () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    };
    const restore = (element: HTMLElement) => {
      const original = tracked.get(element);
      if (!original) return;
      element.style.opacity = original.opacity;
      element.style.translate = original.translate;
      element.style.rotate = original.rotate;
      element.style.scale = original.scale;
      element.style.clipPath = original.clipPath;
      element.style.transformOrigin = original.transformOrigin;
      element.style.willChange = original.willChange;
      element.classList.remove('scroll-light-pass');
      pending.delete(element);
    };

    const reveal = (element: HTMLElement, immediate = false) => {
      observer?.unobserve(element);
      if (!pending.has(element)) return;
      if (immediate || motion.matches || !element.isConnected) {
        restore(element);
        return;
      }

      const siblings = element.parentElement ? Array.from(element.parentElement.children) : [];
      const isGrid = element.parentElement && getComputedStyle(element.parentElement).display === 'grid';
      const index = Math.max(0, siblings.indexOf(element));
      const direction = index % 2 === 0 ? -1 : 1;
      const delay = isGrid ? index % (smallScreen.matches ? 1 : 3) * 110 : 0;
      const heading = element.matches('h1, h2, .editorial-section-heading');
      const card = element.matches('.project-card, .brand-card, .story, .category-card');
      const frames: Keyframe[] = heading ? [
        { opacity: 1, clipPath: 'inset(0 0 100% 0)', translate: '0 42px', rotate: 'x 18deg' },
        { opacity: 1, clipPath: 'inset(0 0 0% 0)', translate: '0 0', rotate: 'x 0deg' },
      ] : card ? [
        { opacity: 0.65, clipPath: 'inset(38% 0 38% 0 round 20px)', translate: `${direction * (smallScreen.matches ? 12 : 32)}px 54px`, rotate: `${direction * (smallScreen.matches ? 1.5 : 3.5)}deg`, scale: '0.94' },
        { opacity: 1, clipPath: 'inset(0% 0 0% 0 round 16px)', translate: `${direction * 4}px 8px`, rotate: `${direction * 0.4}deg`, scale: '0.995', offset: 0.65 },
        { opacity: 1, clipPath: 'inset(0% 0 0% 0 round 16px)', translate: '0 0', rotate: '0deg', scale: '1' },
      ] : [
        { opacity: 0.5, clipPath: 'inset(0 12% 0 0 round 22px)', translate: '0 32px', scale: '0.975' },
        { opacity: 1, clipPath: 'inset(0 0% 0 0 round 22px)', translate: '0 0', scale: '1' },
      ];
      element.style.willChange = 'opacity, translate, rotate, scale, clip-path';
      element.style.transformOrigin = '50% 100%';
      if (card) element.classList.add('scroll-light-pass');
      // Individual transforms preserve the existing interactive glass tilt.
      const animation = element.animate(
        frames,
        { duration: smallScreen.matches ? 850 : 1150, delay, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'both' },
      );
      animations.add(animation);
      void animation.finished.catch(() => undefined).then(() => {
        animations.delete(animation);
        animation.cancel();
        restore(element);
      });
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) reveal(entry.target as HTMLElement);
          });
        }, { threshold: 0, rootMargin: '0px 0px -32px 0px' })
      : null;

    const mediaObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) activeMedia.add(element);
            else {
              activeMedia.delete(element);
              const original = media.get(element);
              if (original) {
                element.style.translate = original.translate;
                element.style.scale = original.scale;
                element.style.willChange = original.willChange;
                original.offset = 0;
              }
            }
          });
          scheduleProgress();
        }, { rootMargin: '120px 0px', threshold: 0 })
      : null;

    const sectionObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            const state = sections.get(element);
            if (!state) return;
            if (state.animation) return;
            if (!entry.isIntersecting) {
              state.inside = false;
              state.initiallyVisible = false;
              return;
            }
            if (state.inside) return;
            state.inside = true;
            if (state.initiallyVisible) {
              state.initiallyVisible = false;
              return;
            }
            if (motion.matches || element.contains(document.activeElement)) return;
            // Observe the resting bounds, rather than retriggering on the
            // temporary animated position at the viewport edge.
            sectionObserver?.unobserve(element);
            const animation = element.animate([
              { opacity: 0.5, translate: `0 ${scrollDirection * (smallScreen.matches ? 20 : 38)}px`, scale: smallScreen.matches ? '0.99' : '0.975' },
              { opacity: 1, translate: '0 0', scale: '1' },
            ], { duration: smallScreen.matches ? 750 : 1050, easing: 'cubic-bezier(0.19, 1, 0.22, 1)', fill: 'both' });
            state.animation = animation;
            animations.add(animation);
            void animation.finished.catch(() => undefined).then(() => {
              animations.delete(animation);
              animation.cancel();
              if (state.animation === animation) state.animation = undefined;
              if (!disposed && element.isConnected) sectionObserver?.observe(element);
            });
          });
        }, { threshold: 0, rootMargin: '0px' })
      : null;

    const scan = () => {
      scanFrame = 0;
      if (disposed || motion.matches || !observer || typeof Element.prototype.animate !== 'function') return;
      // Cover full sections as well as their individual cards and headings.
      document.querySelectorAll<HTMLElement>(SECTION_TARGETS).forEach(element => {
        if (sections.has(element) || element.closest('[data-no-scroll-reveal]')) return;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (!rect.width || !rect.height || style.position === 'absolute' || style.position === 'fixed') return;
        sections.set(element, { inside: false, initiallyVisible: rect.top < window.innerHeight && rect.bottom > 0 });
        element.dataset.scrollSectionManaged = 'true';
        sectionObserver?.observe(element);
      });
      main.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach(element => {
        if (tracked.has(element) || sections.has(element) || element.closest('[data-no-scroll-reveal]')) return;
        if (element.parentElement?.closest('[data-scroll-managed]')) return;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (!rect.width || !rect.height || style.position === 'fixed' || style.position === 'absolute') return;
        if (element.matches('.liquid-glass') && (rect.width < 160 || rect.height < 80)) return;
        tracked.set(element, {
          opacity: element.style.opacity, translate: element.style.translate,
          rotate: element.style.rotate, scale: element.style.scale,
          clipPath: element.style.clipPath, transformOrigin: element.style.transformOrigin,
          willChange: element.style.willChange,
        });
        element.dataset.scrollManaged = 'true';
        // Keep the initial screen and previously passed content visible.
        if (rect.top < window.innerHeight || rect.bottom <= 0) return;
        pending.add(element);
        element.style.opacity = '0';
        observer.observe(element);
      });
      main.querySelectorAll<HTMLElement>('.story-image img, .project-card img, .brand-card img').forEach(element => {
        if (media.has(element) || element.closest('[data-no-scroll-reveal]')) return;
        media.set(element, { translate: element.style.translate, scale: element.style.scale, willChange: element.style.willChange, offset: 0 });
        mediaObserver?.observe(element);
      });
      scheduleProgress();
    };
    const scheduleScan = () => {
      if (!scanFrame) scanFrame = requestAnimationFrame(scan);
      scheduleProgress();
    };
    const showPending = () => {
      if (!motion.matches) return;
      animations.forEach(animation => animation.cancel());
      animations.clear();
      pending.forEach(element => reveal(element, true));
      media.forEach((original, element) => {
        element.style.translate = original.translate;
        element.style.scale = original.scale;
        element.style.willChange = original.willChange;
        original.offset = 0;
      });
    };
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      pending.forEach(element => {
        if (element.contains(event.target as Node)) reveal(element, true);
      });
    };

    const mutations = new MutationObserver(scheduleScan);
    mutations.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleScan);
    main.addEventListener('focusin', revealFocused);
    motion.addEventListener('change', showPending);
    scan();
    updateProgress();

    return () => {
      disposed = true;
      observer?.disconnect();
      sectionObserver?.disconnect();
      mediaObserver?.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(progressFrame);
      cancelAnimationFrame(scanFrame);
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleScan);
      main.removeEventListener('focusin', revealFocused);
      motion.removeEventListener('change', showPending);
      animations.forEach(animation => animation.cancel());
      sections.forEach((_, element) => delete element.dataset.scrollSectionManaged);
      tracked.forEach((_, element) => {
        restore(element);
        delete element.dataset.scrollManaged;
      });
      media.forEach((original, element) => {
        element.style.translate = original.translate;
        element.style.scale = original.scale;
        element.style.willChange = original.willChange;
      });
    };
  }, [currentPath]);

  return <div ref={progressRef} className="scroll-reading-progress" aria-hidden="true" />;
}
