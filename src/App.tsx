import React, { useState, useEffect } from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { CustomCursor } from './components/common/CustomCursor';
import { SpatialPageTransition } from './components/layout/SpatialPageTransition';
import { ScrollEffects } from './components/layout/ScrollEffects';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/contact/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { BrandsPage } from './pages/BrandsPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [blueprintMode, setBlueprintMode] = useState<boolean>(false);
  const { settings, projects, brands } = useCMS();

  const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    params.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  };

  useEffect(() => {
    setSearchParams(parseQueryParams());

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(parseQueryParams());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    const [pathOnly] = path.split('?');
    setCurrentPath(pathOnly);
    setSearchParams(parseQueryParams());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic SEO Metadata Update
  useEffect(() => {
    let title = settings.metaTitle;
    let desc = settings.metaDescription;

    if (currentPath === '/work') {
      title = 'Selected Work | Tayyabs.Designs Apparel Portfolio';
      desc = 'Explore streetwear graphics, cultural garments, jerseys, and tech pack case studies by Tayyabs.Designs.';
    } else if (currentPath.startsWith('/work/')) {
      const slug = currentPath.replace('/work/', '');
      const proj = projects.find((p) => p.slug === slug);
      if (proj) {
        title = `${proj.title} (${proj.brandName}) | Tayyabs.Designs`;
        desc = proj.projectOverview.brief || desc;
      }
    } else if (currentPath === '/brands') {
      title = 'Client Brands Directory (50+ Collaborations) | Tayyabs.Designs';
      desc = 'Directory of fashion brands, streetwear labels, and sportswear teams collaborated with Tayyabs.Designs.';
    } else if (currentPath.startsWith('/brands/')) {
      const slug = currentPath.replace('/brands/', '');
      const brand = brands.find((b) => b.slug === slug);
      if (brand) {
        title = `${brand.name} Collaboration | Tayyabs.Designs`;
        desc = brand.description || desc;
      }
    } else if (currentPath === '/services') {
      title = 'Apparel Design Services | Tayyabs.Designs';
      desc = '11 specialized apparel design services: streetwear graphics, cultural garments, jerseys, tech packs, and line sheets.';
    } else if (currentPath === '/about') {
      title = 'About Designer | Tayyabs.Designs (50+ Brand Collaborations)';
    } else if (currentPath === '/contact') {
      title = 'Start a Clothing Project | Tayyabs.Designs Brief Form';
    } else if (currentPath === '/admin') {
      title = 'Admin CMS | Tayyabs.Designs';
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);
  }, [currentPath, settings, projects, brands]);

  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    if (currentPath === '/work') {
      return <WorkPage navigate={navigate} queryParams={searchParams} />;
    }

    if (currentPath.startsWith('/work/')) {
      const slug = currentPath.replace('/work/', '');
      return <ProjectDetailPage slug={slug} navigate={navigate} />;
    }

    if (currentPath === '/brands') {
      return <BrandsPage navigate={navigate} />;
    }

    if (currentPath.startsWith('/brands/')) {
      const slug = currentPath.replace('/brands/', '');
      return <BrandDetailPage slug={slug} navigate={navigate} />;
    }

    if (currentPath === '/services') {
      return <ServicesPage navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/admin') {
      return <AdminPage navigate={navigate} />;
    }

    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#D1C7BB] font-editorial-sub relative selection:bg-[#D1C7BB] selection:text-[#101010]">
      <CustomCursor />
      <ScrollEffects currentPath={currentPath} />

      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        blueprintMode={blueprintMode}
        onToggleBlueprint={() => setBlueprintMode(!blueprintMode)}
      />

      <main className="relative z-10">
        <SpatialPageTransition currentPath={currentPath}>
          {renderCurrentPage()}
        </SpatialPageTransition>
      </main>

      <Footer navigate={navigate} />
      <FloatingWhatsApp />
    </div>
  );
};

export function App() {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
}

export default App;


