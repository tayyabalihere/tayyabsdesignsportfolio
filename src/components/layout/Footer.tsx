import { EndBrandReveal } from '../home/PortfolioMotion';
import { useCMS } from '../../context/CMSContext';
import { ArrowUpRight } from 'lucide-react';
export const Footer = ({ navigate }: { navigate: (path: string) => void }) => {
 const { settings } = useCMS();
 const socials = [
  { name: 'Instagram', url: settings.instagramUrl },
  { name: 'TikTok', url: settings.tiktokUrl },
  { name: 'Pinterest', url: settings.pinterestUrl },
 ];
 return <><footer className="reference-footer"><div className="reference-footer-grid"><div className="reference-footer-info"><div><span className="footer-label">( Email )</span><a className="footer-email" href={`mailto:${settings.emailAddress}`}>{settings.emailAddress}</a></div><div className="footer-status"><span className="footer-label">( Status )</span><span><i className="inquiry-dot" />Open for project inquiries</span></div><div><span className="footer-label">( Let's talk )</span><a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"><span className="inquiry-dot" />Start a conversation on WhatsApp</a></div></div><div className="reference-footer-links"><span className="footer-label">( Socials )</span><nav className="footer-socials" aria-label="Social profiles">{socials.map(social => social.url?.trim().startsWith('https://') ? <a key={social.name} href={social.url.trim()} target="_blank" rel="noopener noreferrer">{social.name}<ArrowUpRight size={16} aria-hidden="true" /></a> : <span key={social.name} aria-disabled="true">{social.name}<ArrowUpRight size={16} aria-hidden="true" /></span>)}</nav></div><div className="reference-footer-cta"><p>Have a project in mind? Let's build something clear, bold, and made to be worn.</p><button onClick={() => navigate('/contact')}>Work with Tayyab <span aria-hidden="true">+</span></button></div></div><div className="reference-footer-base"><span>© {new Date().getFullYear()} Tayyabs.Designs. All rights reserved.</span><button onClick={() => navigate('/admin')}>Studio login</button><button onClick={() => navigate('/contact')}>Work with Tayyab</button></div></footer><EndBrandReveal/></>;
};
