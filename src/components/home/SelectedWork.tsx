import React, { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { withOriginalArtwork } from '../../data/projectArtwork';
import { GlassyCarousel } from './GlassyCarousel';

interface SelectedWorkProps {
  navigate: (path: string) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ navigate }) => {
  const { projects } = useCMS();

  const featuredProjects = useMemo(() =>
    projects.map(withOriginalArtwork).filter((p) => p.isFeatured && !p.isDraft && p.mockups.heroMockup.startsWith('/uploads/')),
    [projects]
  );

  return (
    <div style={{ position: 'relative' }}>
      <GlassyCarousel projects={featuredProjects} navigate={navigate} />

      {/* View All link */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: '32px',
          background: '#101010',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <button
          type="button"
          data-scroll-reveal="archive-link"
          onClick={() => navigate('/work')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '8px',
            color: 'rgba(200,200,220,0.75)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#F2EDE4';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(200,200,220,0.75)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)';
          }}
        >
          View All Projects ({projects.length})
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  );
};


