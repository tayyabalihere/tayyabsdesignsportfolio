import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ArtworkRing } from '../components/home/ArtworkRing';
import { TypingName } from '../components/home/TypingName';
import { StudioProjectCard } from '../components/common/StudioProjectCard';
import { portfolioImage } from '../data/portfolioImages';
import { CountUp, MotionMarquee, MotionReveal, ScrollStatement, SignatureFeature } from '../components/home/PortfolioMotion';

const disciplines = [
 {title:'Apparel & Merchandise',text:'Original graphics for streetwear, tees and merchandise, from the first direction to artwork for your next drop.'},
 {title:'Cut & Sew Concepts',text:'Garment concepts, cohesive collections and considered details, developed with production in mind.'},
 {title:'Brand Identity',text:'Visual identities, custom lettering and graphics that give your brand a distinct point of view.'},
 {title:'Campaign Visuals',text:'Art direction and campaign graphics that bring the story of your next collection to life.'},
];
export const HomePage = ({navigate}: {navigate:(path:string)=>void}) => {
 const {projects,brands,testimonials,services}=useCMS();
 const [activeService,setActiveService]=useState<number|null>(null);
 const work=projects.filter(project=>!project.isDraft);
 const clients=brands.filter(brand=>brand.featured).slice(0,20);
 const quotes=testimonials.filter(item=>item.verified);
 const serviceWork=work.length?Array.from({length:8},(_,index)=>work[index%work.length]):[];
 const workRows=[work.slice(0,4),work.slice(Math.max(0,work.length-4))];
 return <div className="xara-home">
  <section className="portrait-hero" aria-labelledby="designer-title">
   <div className="portrait-stage"><picture><source media="(max-width:600px)" srcSet="/portrait/tayyab-mobile.webp"/><img className="hero-portrait" src="/portrait/tayyab-hero.webp" alt="Tayyab Ali, independent apparel designer" width="1086" height="1448" fetchPriority="high" decoding="async"/></picture></div>
   <ArtworkRing projects={work} navigate={navigate}/><div className="portrait-shade"/>
   <div className="portrait-intro"><img className="intro-symbol" src="/studio-mark.svg" alt="" width="28" height="28"/><TypingName/><p>Design Direction for Clothing Brands</p><div className="portrait-actions"><button onClick={()=>navigate('/work')}>View Work</button><button onClick={()=>navigate('/contact')}>Work with Tayyab</button></div></div>
  </section>
  <section className="client-strip" aria-label="Clients and collaborators"><MotionMarquee items={clients} className="client-marquee" duration={78} label="Client brands" renderItem={(brand,index,duplicate)=><button tabIndex={duplicate?-1:undefined} className={`client-mark mark-${index%4}`} onClick={()=>navigate(`/brands/${brand.slug}`)}>{/^(\/|http|data:)/.test(brand.logo)?<img src={portfolioImage(brand.logo,'small')} alt={brand.name} width="150" height="70" loading="lazy"/>:brand.name}</button>}/></section>
  <section className="reference-section services-section" id="services"><MotionReveal><div className="reference-heading"><h2><span>How we</span>{' '}<span>can help</span></h2><span>( Services )</span></div></MotionReveal>
   <div className="reference-services">{disciplines.map((service,index)=><article className={`reference-service ${activeService===index?'is-active':''}`} key={service.title}
    onPointerEnter={event=>{if(event.pointerType==='mouse'&&window.matchMedia('(hover: hover)').matches)setActiveService(index);}}
    onPointerLeave={event=>{if(event.pointerType==='mouse'&&!event.currentTarget.contains(document.activeElement))setActiveService(current=>current===index?null:current);}}
   ><h3><button className="reference-service-trigger" aria-expanded={activeService===index} aria-controls={`service-panel-${index}`} onClick={()=>setActiveService(activeService===index?null:index)}><span className="service-number">0{index+1}<i>.</i></span><span className="service-title">{service.title}</span><ArrowUpRight className="service-indicator" aria-hidden="true" strokeWidth={1.5}/></button></h3><div className="reference-service-panel" id={`service-panel-${index}`} inert={activeService!==index}><div className="service-panel-inner"><MotionMarquee items={serviceWork} className="service-marquee" duration={72} reverse={index%2===0} label={`${service.title} examples`} renderItem={(project,itemIndex,duplicate)=><button tabIndex={duplicate?-1:undefined} onClick={()=>navigate(`/work/${project.slug}`)} aria-label={`Explore ${project.title}`}><img src={portfolioImage((index===3?project.finalDesigns.frontArtwork:index===2&&itemIndex%2?project.finalDesigns.backArtwork:project.mockups.heroMockup) || project.mockups.heroMockup,'small')} alt={project.title} width="360" height="360" loading="lazy" decoding="async"/></button>}/></div></div></article>)}</div>
  </section>
  <section className="selected-section" id="selected-work"><MotionReveal><div className="reference-heading"><h2><span>Selected</span>{' '}<span>work</span></h2><span>( Works )</span></div></MotionReveal><div className="work-marquee-stack">{workRows.map((row,index)=><MotionMarquee key={index} items={row} className="work-marquee" duration={56} reverse={index===1} label={`Selected work row ${index+1}`} renderItem={(project,_,duplicate)=><StudioProjectCard project={project} navigate={navigate} marquee duplicate={duplicate}/>}/>)}</div></section>
  {quotes.length>0&&<section className="testimonials-section"><MotionReveal><div className="testimonial-heading"><div className="testimonial-proof"><strong><span aria-hidden="true">✳</span> {quotes.length}</strong><small>client stories</small></div><div><span className="section-label">( Testimonials )</span><h2>What was it like working with Tayyab?</h2></div></div></MotionReveal><MotionMarquee items={quotes} minimumItems={6} duration={Math.max(35,quotes.length*7)} className="testimonial-marquee" label="Client testimonials" renderItem={(quote)=><figure><span className="quote-mark" aria-hidden="true">“</span><blockquote>“{quote.quote}”</blockquote><figcaption><span className="client-initial" aria-hidden="true">{quote.clientName.charAt(0)}</span><span>{quote.clientName}<small>{quote.clientRole} · {quote.brandName}</small></span></figcaption></figure>}/></section>}
  <section className="reference-stats reference-section" aria-label="Portfolio overview">{[{value:brands.length,label:'Brands in the portfolio'},{value:work.length,label:'Projects in the archive'},{value:services.length,label:'Design services'},{value:new Set(work.flatMap(project=>project.garmentTypes)).size,label:'Garment formats'}].map(stat=><div key={stat.label}><strong><CountUp value={stat.value}/><span className="stat-suffix">+</span></strong><p>{stat.label}</p></div>)}</section>
  <ScrollStatement/><SignatureFeature navigate={navigate}/>
 </div>;
};
