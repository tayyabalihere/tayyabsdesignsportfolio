import type { Project } from '../types';

const originalMockups: Record<string, string> = {
  'bikhata-persian-carpet-tee': '/uploads/persian-carpet-tee.png',
  'pakistani-truck-art-tee': '/uploads/truck-art-tee.png',
  'stray-pets-loves-tee': '/uploads/stray-pets-tee.png',
  'palestine-olive-dome-bomber': '/uploads/palestine-bomber-jacket.png',
  'elzari-spider-web-jersey': '/uploads/elzari-spider-jersey.png',
};
export function withOriginalArtwork(project: Project): Project {
  const original = originalMockups[project.slug];
  if (!original || !project.mockups.heroMockup.startsWith('data:image/svg')) return project;
  return { ...project, mockups: { ...project.mockups, heroMockup: original } };
}
