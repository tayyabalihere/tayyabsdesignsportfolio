import React from 'react';
import { Hero } from '../components/home/Hero';
import { SelectedWork } from '../components/home/SelectedWork';
import { ProjectStories } from '../components/home/ProjectStories';
import { CategoryGateways } from '../components/home/CategoryGateways';
import { BrandTicker } from '../components/home/BrandTicker';
import { AboutPreview } from '../components/home/AboutPreview';
import { ProcessStepper } from '../components/home/ProcessStepper';
import { InquiryCTA } from '../components/home/InquiryCTA';

export const HomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <div className="portfolio-home space-y-0">
    <Hero navigate={navigate} />
    <div id="selected-work"><SelectedWork navigate={navigate} /></div>
    <ProjectStories navigate={navigate} />
    <CategoryGateways navigate={navigate} />
    <BrandTicker navigate={navigate} />
    <AboutPreview navigate={navigate} />
    <ProcessStepper />
    <InquiryCTA navigate={navigate} />
  </div>
);

