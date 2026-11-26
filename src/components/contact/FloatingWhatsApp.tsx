import { useEffect, useState } from 'react';
import { ArrowUp, FileText } from 'lucide-react';
export const FloatingWhatsApp = ({ navigate }: { navigate: (path: string) => void }) => {
 const [visible, setVisible] = useState(() => window.scrollY > 100);
 useEffect(() => { const update = () => setVisible(window.scrollY > 100); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
 return <div className={`reference-quick-links ${visible ? 'is-visible' : ''}`} inert={!visible}><button onClick={() => window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})} aria-label="Back to top"><ArrowUp size={21}/></button><button className="quick-contact" onClick={() => navigate('/contact')} aria-label="Open project inquiry form"><FileText size={21}/></button></div>;
};
