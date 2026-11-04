import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '../common/Logo';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  blueprintMode?: boolean;
  onToggleBlueprint?: () => void;
}
export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  const go = (path: string) => { navigate(path); setOpen(false); };
  const links = [{ name: 'Work', path: '/work' }, { name: 'Brands', path: '/brands' }, { name: 'About', path: '/about' }, { name: 'Services', path: '/services' }, { name: 'Contact', path: '/contact' }];
  return <header className="editorial-nav">
    <button className="editorial-wordmark" onClick={() => go('/')} aria-label="Tayyabs.Designs home"><Logo size={30} variant="metallic" /><span>Tayyabs.Designs<span className="wordmark-dot">®</span></span></button>
    <nav className={open ? 'editorial-links is-open' : 'editorial-links'} aria-label="Main navigation">
      {links.map(link => <button key={link.path} aria-current={currentPath === link.path ? 'page' : undefined} onClick={() => go(link.path)}>{link.name}</button>)}
    </nav>
    <button className="nav-inquiry" aria-label="Let’s talk" onClick={() => go('/contact')}><span>Let’s talk</span><ArrowUpRight size={17} /></button>
    <button className="editorial-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
  </header>;
};


