import type { Project } from '../../types';
import { portfolioImage } from '../../data/portfolioImages';

export function StudioProjectCard({ project, navigate, marquee = false, duplicate = false }: { project: Project; navigate: (path: string) => void; marquee?: boolean; duplicate?: boolean }) {
  return <a className={`reference-project ${marquee ? 'is-marquee-card' : ''} ${project.slug === 'rebel-x-outfits-la-makan' ? 'heritage-project' : ''}`} tabIndex={duplicate ? -1 : undefined} href={`/work/${project.slug}`} onClick={event => {
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) { event.preventDefault(); navigate(`/work/${project.slug}`); }
  }}>
    <div className="reference-project-image"><img src={portfolioImage(project.mockups.heroMockup)} alt={project.title} width="1000" height="1000" loading="lazy" decoding="async" /><span className="reference-project-overlay">View Work</span></div>
    <div className="reference-project-caption"><h3>{project.title.split('//')[0].trim()}</h3><span>{project.brandName}</span></div>
  </a>;
}
