import React, { useState } from 'react';
import { ShieldCheck, FolderGit2, Building, Layers, Settings, LogOut } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { AdminAuthModal } from '../components/admin/AdminAuthModal';
import { ProjectsManager } from '../components/admin/ProjectsManager';
import { BrandsManager } from '../components/admin/BrandsManager';
import { CollectionsManager } from '../components/admin/CollectionsManager';
import { SiteSettingsManager } from '../components/admin/SiteSettingsManager';

interface AdminPageProps {
  navigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { isAdmin, logoutAdmin } = useCMS();
  const [activeTab, setActiveTab] = useState<'collections' | 'projects' | 'brands' | 'settings'>('collections');

  if (!isAdmin) {
    return (
      <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminAuthModal />
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Top Header */}
        <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#201C18] border border-[#D1C7BB]/40 flex items-center justify-center text-[#D1C7BB]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-editorial-heading font-black text-2xl text-[#F2EDE4]">
                Tayyabs.Designs Admin CMS
              </h1>
              <p className="text-xs text-[#A99E92]">
                Authenticated Content, Collections & Apparel Inventory Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/work')}
              className="px-4 py-2 text-xs uppercase font-bold text-[#D1C7BB] border border-[#D1C7BB]/30 hover:border-[#F2EDE4] rounded transition-colors"
            >
              View Live Site
            </button>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2 text-xs uppercase font-bold text-[#F2EDE4] border border-white/20 hover:bg-white/10 rounded transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-[#D1C7BB]" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex border-b border-[#D1C7BB]/15 gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('collections')}
            className={`pb-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'collections'
                ? 'text-[#F2EDE4] border-b-2 border-[#D1C7BB]'
                : 'text-[#A99E92] hover:text-[#D1C7BB]'
            }`}
          >
            <Layers className="w-4 h-4" /> Collections & Inventory
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'projects'
                ? 'text-[#F2EDE4] border-b-2 border-[#D1C7BB]'
                : 'text-[#A99E92] hover:text-[#D1C7BB]'
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Manage Case Studies
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`pb-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'brands'
                ? 'text-[#F2EDE4] border-b-2 border-[#D1C7BB]'
                : 'text-[#A99E92] hover:text-[#D1C7BB]'
            }`}
          >
            <Building className="w-4 h-4" /> Client Brands
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'settings'
                ? 'text-[#F2EDE4] border-b-2 border-[#D1C7BB]'
                : 'text-[#A99E92] hover:text-[#D1C7BB]'
            }`}
          >
            <Settings className="w-4 h-4" /> Site Contact & SEO
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-4">
          {activeTab === 'collections' && <CollectionsManager />}
          {activeTab === 'projects' && <ProjectsManager navigate={navigate} />}
          {activeTab === 'brands' && <BrandsManager />}
          {activeTab === 'settings' && <SiteSettingsManager />}
        </div>
      </div>
    </div>
  );
};



