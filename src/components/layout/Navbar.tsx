import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
interface NavbarProps { currentPath: string; navigate: (path: string) => void; }
export const Navbar = ({ currentPath, navigate }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 80);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    let anchor = previous;
    let direction = 0;
    const update = () => {
      const next = Math.max(0, window.scrollY);
      const nextDirection = Math.sign(next - previous);
      if (nextDirection && nextDirection !== direction) anchor = previous;
      if (nextDirection) direction = nextDirection;
      setScrolled(next > 80);
      if (next < 100) setHidden(false);
      else if (Math.abs(next - anchor) > 12) {
        setHidden(next > anchor);
        anchor = next;
      }
      previous = next;
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { setHidden(false); }, [currentPath, open]);
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date()), 60000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open'); }, [open]);
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [open]);
  const go = (path: string) => { navigate(path); setOpen(false); };
  return <header className={`reference-nav ${currentPath === '/' ? 'over-portrait' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''} ${hidden && !open ? 'is-scroll-hidden' : ''}`}><button className="reference-wordmark" onClick={() => go('/')} aria-label="Tayyabs.Designs home">TAYYABS<span>®</span></button><div className="reference-nav-center"><button className="nav-studio-mark" aria-label="Home" onClick={() => go('/')}><img src="/studio-mark.svg" width="28" height="28" alt="" /></button><nav className={`reference-nav-links ${open ? 'is-open' : ''}`} id="portfolio-menu" aria-label="Main navigation">{[{name:'Works',path:'/work'}, {name:'Shop',path:'/shop'}, {name:'Contact',path:'/contact'}].map(link => <button key={link.path} aria-current={currentPath.startsWith(link.path) ? 'page' : undefined} onClick={() => go(link.path)}>{link.name}</button>)}</nav></div><div className="reference-availability"><div><span className="inquiry-dot" /><span>Open for project inquiries<small>{new Intl.DateTimeFormat('en-US', { month:'short',year:'numeric',timeZone:'Asia/Karachi' }).format(clock)}</small></span></div><div className="reference-clock"><time>{new Intl.DateTimeFormat('en-US',{hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'Asia/Karachi'}).format(clock)}</time><small>(GMT+5)</small></div></div><button className="reference-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="portfolio-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></header>;
};
