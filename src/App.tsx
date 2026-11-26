import React, { useState, useEffect, lazy, Suspense } from 'react';
import { CMSProvider, useCMS } from './context/CMSContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/contact/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
const ShopPage = lazy(() => import('./pages/ShopPage').then(module => ({ default: module.ShopPage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then(module => ({ default: module.WorkPage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then(module => ({ default: module.BrandsPage })));
const BrandDetailPage = lazy(() => import('./pages/BrandDetailPage').then(module => ({ default: module.BrandDetailPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(module => ({ default: module.ServicesPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
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
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  // Dynamic SEO Metadata Update
  useEffect(() => {
    let desc = settings.metaDescription;
    if (currentPath === '/work' || currentPath === '/works') {

      desc = 'Explore streetwear graphics, cultural garments, jerseys, and tech pack case studies by Tayyabs.Designs.';
    } else if (currentPath.startsWith('/work/')) {
      const slug = currentPath.replace('/work/', '');
      const proj = projects.find((p) => p.slug === slug);
      if (proj) {

        desc = proj.projectOverview.brief || desc;
      }
    } else if (currentPath === '/brands') {

      desc = 'Directory of fashion brands, streetwear labels, and sportswear teams collaborated with Tayyabs.Designs.';
    } else if (currentPath.startsWith('/brands/')) {
      const slug = currentPath.replace('/brands/', '');
      const brand = brands.find((b) => b.slug === slug);
      if (brand) {

        desc = brand.description || desc;
      }
    } else if (currentPath === '/services') {

      desc = '11 specialized apparel design services: streetwear graphics, cultural garments, jerseys, tech packs, and line sheets.';
    }
    document.title = 'TAYYABS DESIGNS';
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
    if (currentPath === '/work' || currentPath === '/works') {
      return <WorkPage navigate={navigate} queryParams={searchParams} />;
    }
    if (currentPath.startsWith('/work/')) {
      const slug = currentPath.replace('/work/', '');
      return <ProjectDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/shop') return <ShopPage navigate={navigate} />;
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
    <div className="min-h-screen bg-[#050505] text-[#f4f4f0] relative selection:bg-[#D1C7BB] selection:text-[#101010]">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
      />
      <main className="relative z-10">
        <Suspense fallback={<div className="min-h-screen pt-40 text-center text-white/60" role="status">Loading portfolio…</div>}>
          {renderCurrentPage()}
        </Suspense>
      </main>
      <Footer navigate={navigate} />
      <FloatingWhatsApp navigate={navigate} />
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
