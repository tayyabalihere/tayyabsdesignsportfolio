import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <footer className="editorial-footer">
    <div><button className="editorial-wordmark" onClick={() => navigate('/')}>Tayyabs.Designs<span className="wordmark-dot">®</span></button><p>Independent clothing design.<br />Culture, graphics and wearable identities.</p></div>
    <nav aria-label="Footer navigation">{[{ label: 'Work', path: '/work' }, { label: 'Brands', path: '/brands' }, { label: 'Studio', path: '/about' }, { label: 'Services', path: '/services' }, { label: 'Contact', path: '/contact' }].map(link => <button key={link.path} onClick={() => navigate(link.path)}>{link.label}<ArrowUpRight size={13} /></button>)}</nav>
    <div className="footer-baseline"><span>© {new Date().getFullYear()} Tayyabs.Designs</span><span>Designing identity into every thread.</span><button onClick={() => navigate('/admin')}>Studio login</button></div>
  </footer>
);

