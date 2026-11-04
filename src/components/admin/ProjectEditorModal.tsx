import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { Project } from '../../types';
import { useCMS } from '../../context/CMSContext';
import { generateArtworkSvg, generateGarmentMockupSvg } from '../../data/artworkGenerator';

interface ProjectEditorModalProps {
  projectToEdit?: Project | null;
  onClose: () => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  projectToEdit,
  onClose,
}) => {
  const { addProject, updateProject, brands } = useCMS();

  const [formData, setFormData] = useState<Partial<Project>>(() => {
    if (projectToEdit) return { ...projectToEdit };
    return {
      title: '',
      slug: '',
      brandId: brands[0]?.id || 'brand-1',
      brandName: brands[0]?.name || 'NOCTURNE ATELIER',
      year: new Date().getFullYear(),
      category: 'Streetwear',
      categories: ['Streetwear'],
      garmentTypes: ['Hoodies', 'T-shirts'],
      servicesProvided: ['Streetwear Graphic Design', 'Production-Ready Artwork'],
      designerRole: 'Lead Apparel Designer',
      projectOverview: {
        client: 'Client Name',
        brief: 'Project Brief description...',
        targetAudience: 'Streetwear enthusiasts',
        garmentType: 'Heavyweight Hoodie',
        coreObjective: 'Develop new visual identity',
      },
      designChallenge: 'Translating concepts into 6-color screen print files...',
      creativeDirection: {
        concept: 'Cyber Gothic Synergies',
        mood: 'Dark, metallic, futuristic',
        typography: 'Custom chrome typography',
        illustration: 'Vector biomechanical motifs',
        placement: 'Oversized back graphic & chest crest',
      },
      designProcess: {
        sketchesNote: '40 thumbnail sketches created',
        roughsNote: 'Bezier nodes profiled in Illustrator',
        typographyTestsNote: 'Kerning calibrated for puff print',
        colorExplorationsNote: 'Metallic silver ink passes',
        placementTestingNote: '1:1 tech pack positioning',
      },
      finalDesigns: {
        frontArtwork: generateArtworkSvg('streetwear-cyber', 'NEW GRAPHIC', 'front'),
        backArtwork: generateArtworkSvg('streetwear-cyber', 'BACK GRAPHIC', 'back'),
        closeups: [generateArtworkSvg('streetwear-cyber', 'CLOSEUP DETAIL', 'detail')],
        variations: [],
      },
      mockups: {
        heroMockup: generateGarmentMockupSvg('hoodie', 'NEW DROP', 'front'),
        frontMockup: generateGarmentMockupSvg('hoodie', 'NEW DROP', 'front'),
        backMockup: generateGarmentMockupSvg('hoodie', 'NEW DROP', 'back'),
        detailCloseups: [],
        collectionViews: [],
      },
      isFeatured: true,
      isDraft: false,
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const slug =
      formData.slug ||
      formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const selectedBrand = brands.find((b) => b.id === formData.brandId);

    const fullData = {
      ...formData,
      title: formData.title,
      slug,
      brandId: formData.brandId || 'brand-1',
      brandName: selectedBrand ? selectedBrand.name : formData.brandName || 'Brand',
      year: formData.year || 2025,
      category: formData.category || 'Streetwear',
      categories: formData.categories || ['Streetwear'],
      garmentTypes: formData.garmentTypes || ['Hoodies'],
      servicesProvided: formData.servicesProvided || ['Streetwear Graphic Design'],
      designerRole: formData.designerRole || 'Lead Designer',
      projectOverview: formData.projectOverview || {
        client: 'Client',
        brief: 'Brief',
        targetAudience: 'Audience',
        garmentType: 'Garment',
        coreObjective: 'Objective',
      },
      designChallenge: formData.designChallenge || 'Challenge',
      creativeDirection: formData.creativeDirection || {
        concept: 'Concept',
        mood: 'Mood',
        typography: 'Typography',
        illustration: 'Illustration',
        placement: 'Placement',
      },
      designProcess: formData.designProcess || {
        sketchesNote: '',
        roughsNote: '',
        typographyTestsNote: '',
        colorExplorationsNote: '',
        placementTestingNote: '',
      },
      finalDesigns: formData.finalDesigns || {
        frontArtwork: generateArtworkSvg('streetwear-cyber', formData.title),
        closeups: [],
        variations: [],
      },
      mockups: formData.mockups || {
        heroMockup: generateGarmentMockupSvg('hoodie', formData.title),
        frontMockup: generateGarmentMockupSvg('hoodie', formData.title),
        detailCloseups: [],
        collectionViews: [],
      },
      isFeatured: !!formData.isFeatured,
      isDraft: !!formData.isDraft,
    } as Project;

    if (projectToEdit) {
      updateProject(projectToEdit.id, fullData);
    } else {
      addProject(fullData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101010]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[#D1C7BB]/15 pb-4">
          <h3 className="font-editorial-heading font-black text-xl text-[#F2EDE4]">
            {projectToEdit ? 'Edit Project Case Study' : 'Create New Project Case Study'}
          </h3>
          <button onClick={onClose} className="p-2 text-[#A99E92] hover:text-[#F2EDE4]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs text-[#D1C7BB]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Cyber Gothic Capsule"
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
                Select Brand *
              </label>
              <select
                value={formData.brandId || ''}
                onChange={(e) => {
                  const b = brands.find((brand) => brand.id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    brandId: e.target.value,
                    brandName: b ? b.name : prev.brandName,
                  }));
                }}
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
                Primary Category
              </label>
              <select
                value={formData.category || 'Streetwear'}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
              >
                <option value="Streetwear">Streetwear</option>
                <option value="Cultural & Traditional">Cultural & Traditional</option>
                <option value="Typography-Based">Typography-Based Apparel</option>
                <option value="Illustration-Based">Illustration-Based Apparel</option>
                <option value="Jerseys & Sportswear">Jerseys & Sportswear</option>
                <option value="Collection Development">Collection Development</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={formData.year || 2025}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
                Designer Role
              </label>
              <input
                type="text"
                value={formData.designerRole || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, designerRole: e.target.value }))}
                placeholder="e.g. Lead Apparel Designer"
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
              Project Brief Overview
            </label>
            <textarea
              rows={2}
              value={formData.projectOverview?.brief || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  projectOverview: { ...prev.projectOverview!, brief: e.target.value },
                }))
              }
              className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#F2EDE4] uppercase tracking-wider mb-1">
              Design Challenge
            </label>
            <textarea
              rows={2}
              value={formData.designChallenge || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, designChallenge: e.target.value }))}
              className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 p-4 bg-[#101010] border border-[#D1C7BB]/15 rounded">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#F2EDE4]">
              <input
                type="checkbox"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="accent-[#D1C7BB]"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#F2EDE4]">
              <input
                type="checkbox"
                checked={formData.isDraft || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, isDraft: e.target.checked }))}
                className="accent-[#D1C7BB]"
              />
              <span>Save as Draft</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#D1C7BB]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-[#D1C7BB]/30 rounded text-[#D1C7BB]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#D1C7BB] text-[#101010] font-bold uppercase tracking-wider rounded flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

