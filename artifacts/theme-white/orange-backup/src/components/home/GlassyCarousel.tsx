import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';
import type { Project } from '../../types';

/* ─────────────────────────────────────────────
   Card dimensions (px)
───────────────────────────────────────────── */
const CARD_W = 300;
const CARD_H = 440;

/* ─────────────────────────────────────────────
   Per-offset visual config
   offset = index - activeIndex (wrapped)
───────────────────────────────────────────── */
interface SlotCfg {
  x: number;        // horizontal shift from center (px)
  z: number;        // depth shift (px)
  rotY: number;     // Y-rotation (deg)
  scale: number;
  opacity: number;
  blur: number;     // px
  brightness: number;
  zIndex: number;
}

function getSlotCfg(offset: number): SlotCfg {
  const abs = Math.abs(offset);
  const dir = offset >= 0 ? 1 : -1;

  if (offset === 0) return { x: 0,      z: 80,    rotY: 0,         scale: 1,    opacity: 1,    blur: 0,  brightness: 1,    zIndex: 30 };
  if (abs === 1)    return { x: dir*270, z: -20,   rotY: -dir*28,   scale: 0.80, opacity: 0.92, blur: 0.5, brightness: 0.92, zIndex: 20 };
  if (abs === 2)    return { x: dir*480, z: -100,  rotY: -dir*42,   scale: 0.63, opacity: 0.70, blur: 1.5, brightness: 0.80, zIndex: 10 };
  /* hidden */       return { x: dir*650, z: -180,  rotY: -dir*55,   scale: 0.50, opacity: 0,    blur: 14, brightness: 0.20, zIndex: 1  };
}

/* ─────────────────────────────────────────────
   Single Glass Card
───────────────────────────────────────────── */
interface CardProps {
  project: Project;
  offset: number;
  onSelect: () => void;
  navigate: (path: string) => void;
}

const GlassCard: React.FC<CardProps> = ({ project, offset, onSelect, navigate }) => {
  const c = getSlotCfg(offset);
  const isCenter = offset === 0;

  const img =
    project.mockups?.heroMockup ||
    project.finalDesigns?.frontArtwork ||
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80';

  const metric =
    undefined;

  /* Build the full transform — everything in one string so browser
     applies them left-to-right correctly */
  const transform = [
    /* 1. Center the card at (50%, 50%) of the stage */
    `translate(-50%, -50%)`,
    /* 2. Perspective for 3-D children */
    `perspective(1100px)`,
    /* 3. Fan out horizontally */
    `translateX(${c.x}px)`,
    /* 4. Push/pull in depth */
    `translateZ(${c.z}px)`,
    /* 5. Angle side cards */
    `rotateY(${c.rotY}deg)`,
    /* 6. Scale */
    `scale(${c.scale})`,
  ].join(' ');

  return (
    <div
      onClick={onSelect}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        transform,
        zIndex: c.zIndex,
        opacity: c.opacity,
        filter: `blur(${c.blur}px) brightness(${c.brightness})`,
        transition: 'transform 0.65s cubic-bezier(0.23,1,0.32,1), opacity 0.55s ease, filter 0.55s ease',
        cursor: 'pointer',
        transformOrigin: 'center center',
        willChange: 'transform, opacity, filter',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ── Glass shell ── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '22px',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(145deg,rgba(255,255,255,0.11) 0%,rgba(255,255,255,0.04) 55%,rgba(0,0,0,0.45) 100%)',
          backdropFilter: 'blur(22px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
          border: isCenter
            ? '1px solid rgba(255,255,255,0.38)'
            : '1px solid rgba(255,255,255,0.10)',
          boxShadow: isCenter
            ? '0 32px 90px rgba(0,0,0,0.90),0 0 0 1px rgba(255,255,255,0.14),inset 0 1px 0 rgba(255,255,255,0.22)'
            : '0 12px 35px rgba(0,0,0,0.55)',
        }}
      >
        {/* Hero image */}
        <img
          src={img}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center', background: '#F2EDE4',
          }}
        />

        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top,rgba(0,0,0,0.94) 0%,rgba(0,0,0,0.55) 42%,transparent 68%)',
          }}
        />

        {/* Top chrome shimmer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '56px',
            background: 'linear-gradient(to bottom,rgba(255,255,255,0.13) 0%,transparent 100%)',
            borderRadius: '22px 22px 0 0',
            pointerEvents: 'none',
          }}
        />

        {/* Top badges */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.90)',
              background: 'rgba(0,0,0,0.65)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '6px',
              padding: '3px 8px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {project.brandName}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontFamily: 'monospace',
              color: 'rgba(200,200,200,0.80)',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '6px',
              padding: '3px 8px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Bottom content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 18px 18px',
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(170,175,195,0.70)',
              marginBottom: '5px',
              fontFamily: 'monospace',
            }}
          >
            {project.category}
          </p>

          <h3
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#F2EDE4',
              lineHeight: 1.25,
              marginBottom: '10px',
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
            }}
          >
            {project.title}
          </h3>

          {metric && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '9px',
                fontFamily: 'monospace',
                color: 'rgba(220,220,235,0.82)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '6px',
                padding: '4px 9px',
                marginBottom: '12px',
                backdropFilter: 'blur(6px)',
                maxWidth: '100%',
              }}
            >
              <Zap size={9} color="rgba(255,255,255,0.85)" />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {metric}
              </span>
            </div>
          )}

          {/* CTA — only center card */}
          {isCenter && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/work/${project.slug}`);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(255,255,255,0.11)',
                border: '1px solid rgba(255,255,255,0.30)',
                borderRadius: '11px',
                color: '#F2EDE4',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(255,255,255,0.20)';
                b.style.borderColor = 'rgba(255,255,255,0.50)';
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = 'rgba(255,255,255,0.11)';
                b.style.borderColor = 'rgba(255,255,255,0.30)';
              }}
            >
              View Case Study
              <ArrowUpRight size={11} />
            </button>
          )}
        </div>

        {/* Center-card inner glow ring */}
        {isCenter && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '22px',
              boxShadow: 'inset 0 0 50px rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Dot indicators
───────────────────────────────────────────── */
const Dots: React.FC<{
  total: number;
  active: number;
  onDot: (i: number) => void;
}> = ({ total, active, onDot }) => (
  <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        type="button"
        aria-label={`Go to slide ${i + 1}`}
        onClick={() => onDot(i)}
        style={{
          width: i === active ? '26px' : '6px',
          height: '6px',
          borderRadius: '9999px',
          background:
            i === active ? '#D96A3B' : 'rgba(255,255,255,0.20)',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          transition: 'width 0.40s cubic-bezier(0.23,1,0.32,1), background 0.30s',
        }}
      />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   Arrow button
───────────────────────────────────────────── */
const ArrowBtn: React.FC<{
  dir: 'left' | 'right';
  onClick: () => void;
}> = ({ dir, onClick }) => (
  <button
    aria-label={dir === 'left' ? 'Previous project' : 'Next project'}
    type="button"
    onClick={onClick}
    style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.18)',
      color: 'rgba(255,255,255,0.80)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      flexShrink: 0,
      transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
    }}
    onMouseEnter={(e) => {
      const b = e.currentTarget as HTMLButtonElement;
      b.style.background = 'rgba(255,255,255,0.14)';
      b.style.borderColor = 'rgba(255,255,255,0.40)';
      b.style.transform = 'scale(1.08)';
    }}
    onMouseLeave={(e) => {
      const b = e.currentTarget as HTMLButtonElement;
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.borderColor = 'rgba(255,255,255,0.18)';
      b.style.transform = 'scale(1)';
    }}
  >
    {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
  </button>
);

/* ─────────────────────────────────────────────
   Main exported carousel
───────────────────────────────────────────── */
interface GlassyCarouselProps {
  projects: Project[];
  navigate: (path: string) => void;
}

export const GlassyCarousel: React.FC<GlassyCarouselProps> = ({ projects, navigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = projects.length;

  const go = useCallback(
    (dir: number) => setActiveIndex((p) => (p + dir + total) % total),
    [total]
  );

  /* Auto-play */
  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 4500);
  }, [go]);

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAuto]);

  /* Keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { go(-1); startAuto(); }
      if (e.key === 'ArrowRight') { go(1);  startAuto(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [go, startAuto]);

  /* Drag / swipe */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
  };
  const onPointerUp = () => {
    if (Math.abs(dragDelta.current) > 55) {
      go(dragDelta.current < 0 ? 1 : -1);
      startAuto();
    }
    setDragging(false);
    dragStartX.current = null;
  };

  if (!projects.length) return null;

  const STAGE_H = CARD_H + 100; // breathing room above/below

  return (
    <section
      data-scroll-section="featured-carousel"
      style={{
        background: '#101010',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '72px',
        paddingBottom: '60px',
      }}
    >
      {/* ── Ambient deep glow ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(140,150,175,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'gcPulse 7s ease-in-out infinite',
        }}
      />

      {/* ── Fine grid ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Keyframes */}
      <style>{`
        @keyframes gcPulse {
          0%,100% { opacity:.6; transform:translate(-50%,-50%) scale(1); }
          50%      { opacity:1;  transform:translate(-50%,-50%) scale(1.1); }
        }
      `}</style>

      {/* ── Section header ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '44px',
          position: 'relative',
          zIndex: 10,
          padding: '0 16px',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '10px',
            letterSpacing: '0.33em',
            textTransform: 'uppercase',
            color: 'rgba(170,175,200,0.52)',
            fontFamily: 'monospace',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.70)',
              boxShadow: '0 0 8px rgba(255,255,255,0.45)',
              display: 'inline-block',
            }}
          />
          01 // ARCHIVE HIGHLIGHTS
        </span>

        <h2
          style={{
            fontSize: 'clamp(28px,5vw,50px)',
            fontWeight: 900,
            color: '#F2EDE4',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: 0,
            textShadow: '0 0 60px rgba(255,255,255,0.07)',
          }}
        >
          Featured Case Studies
        </h2>
      </div>

      {/* ── 3-D Carousel Stage ── */}
      <div
        ref={undefined} /* no ref needed at section level */
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'relative',
          height: `${STAGE_H}px`,
          width: '100%',
          /* perspective at the container so all children share it */
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
          userSelect: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y',
          /* prevent cards bleeding outside on mobile */
          overflow: 'visible',
          zIndex: 2,
        }}
      >
        {projects.map((project, idx) => {
          let offset = idx - activeIndex;
          if (offset > total / 2)  offset -= total;
          if (offset < -total / 2) offset += total;

          return (
            <GlassCard
              key={project.id}
              project={project}
              offset={offset}
              onSelect={() => {
                if (offset !== 0) { setActiveIndex(idx); startAuto(); }
                else { navigate(`/work/${project.slug}`); }
              }}
              navigate={navigate}
            />
          );
        })}
      </div>

      {/* ── Controls (arrows + dots) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '36px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <ArrowBtn dir="left"  onClick={() => { go(-1); startAuto(); }} />
        <Dots
          total={total}
          active={activeIndex}
          onDot={(i) => { setActiveIndex(i); startAuto(); }}
        />
        <ArrowBtn dir="right" onClick={() => { go(1);  startAuto(); }} />
      </div>

      {/* ── Active project label strip ── */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '22px',
          position: 'relative',
          zIndex: 10,
          minHeight: '34px',
        }}
      >
        {projects[activeIndex] && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '7px 18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '99px',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Sparkles size={10} color="rgba(255,255,255,0.55)" />
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(195,200,220,0.70)',
                fontFamily: 'monospace',
              }}
            >
              {projects[activeIndex].title}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '10px' }}>•</span>
            <span
              style={{
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: 'rgba(150,155,175,0.55)',
                fontFamily: 'monospace',
              }}
            >
              {activeIndex + 1} / {total}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default GlassyCarousel;



