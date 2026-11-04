import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const SiteSettingsManager: React.FC = () => {
  const { settings, updateSettings, resetToDemoData } = useCMS();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-[#D1C7BB]/15 pb-4">
        <h3 className="font-editorial-heading font-black text-xl text-[#F2EDE4]">
          Site Contact & SEO Settings
        </h3>
        <p className="text-xs text-[#A99E92]">
          Update direct contact channels, WhatsApp links, email address, and SEO defaults.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#201C18] border border-[#F2EDE4]/30 rounded text-[#F2EDE4] text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#D1C7BB]" /> Site Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 p-6 rounded-sm space-y-6 text-xs text-[#D1C7BB]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-2">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+1 (555) 829-9227"
              className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-3 rounded text-[#F2EDE4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              placeholder="contact@tayyabsdesigns.com"
              className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-3 rounded text-[#F2EDE4] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-2">
            Consultation Booking URL
          </label>
          <input
            type="text"
            value={formData.consultationLink}
            onChange={(e) => setFormData({ ...formData, consultationLink: e.target.value })}
            placeholder="https://cal.com/tayyabs-designs/consultation"
            className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-3 rounded text-[#F2EDE4] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-2">
            Hero Statement Slogan
          </label>
          <input
            type="text"
            value={formData.heroSlogan}
            onChange={(e) => setFormData({ ...formData, heroSlogan: e.target.value })}
            className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-3 rounded text-[#F2EDE4] focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-[#D1C7BB]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all website projects and settings back to initial demo data?')) {
                resetToDemoData();
                setFormData({ ...settings });
              }
            }}
            className="px-4 py-2 border border-white/20 text-[#F2EDE4] hover:bg-white/10 rounded flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-[#D1C7BB] text-[#101010] font-bold uppercase tracking-wider rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

