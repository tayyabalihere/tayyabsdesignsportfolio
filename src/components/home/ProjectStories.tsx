import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { withOriginalArtwork } from '../../data/projectArtwork';
import { useCMS } from '../../context/CMSContext';

export const ProjectStories: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { projects } = useCMS();
  const stories = projects.map(withOriginalArtwork).filter(p => !p.isDraft && p.mockups.heroMockup.startsWith('/uploads/')).slice(0, 6);
  return <section className="project-stories">
    <div className="editorial-section-heading"><div><p className="edition-label">A closer look</p><h2>Stories on fabric.</h2></div><span>Concept → artwork → garment</span></div>
    <div className="stories-grid">{stories.map((p, i) => <button className="story" key={p.id} onClick={() => navigate(`/work/${p.slug}`)}>
      <div className="story-image liquid-glass"><img loading="lazy" src={p.mockups.heroMockup} alt={p.title} /><span className="story-number">0{i + 1}</span><span className="story-arrow"><ArrowUpRight /></span></div>
      <div className="story-caption"><h3>{p.title.split(' // ')[0]}</h3><span>{p.category}</span></div>
    </button>)}</div>
    <button className="editorial-text-link" onClick={() => navigate('/work')}>Explore the complete archive <ArrowUpRight size={18} /></button>
  </section>;
};


