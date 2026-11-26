import manifest from './portfolio-images.json';
export function portfolioImage(source: string, size: 'small' | 'large' = 'large'): string {
  return (manifest as Record<string, { small: string; large: string }>)[source]?.[size] || source;
}
