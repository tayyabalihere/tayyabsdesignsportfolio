import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package, Image } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import type { Brand, BrandCollection } from '../../types';

export const BrandsManager: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useCMS();
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    logo: string;
    description: string;
    location: string;
    collaborationPeriod: string;
    completedProjectsCount: number;
    categories: string[];
    featured: boolean;
    collectionsList: BrandCollection[];
    galleryImages: string[];
  }>({
    name: '',
    slug: '',
    logo: '',
    description: '',
    location: '',
    collaborationPeriod: '2025',
    completedProjectsCount: 1,
    categories: ['Streetwear'],
    featured: true,
    collectionsList: [],
    galleryImages: ['', '', ''],
  });

  const handleOpenNew = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      slug: '',
      logo: '',
      description: '',
      location: '',
      collaborationPeriod: '2025',
      completedProjectsCount: 1,
      categories: ['Streetwear'],
      featured: true,
      collectionsList: [],
      galleryImages: ['', '', ''],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b: Brand) => {
    setEditingBrand(b);
    const existingImgs = b.galleryImages || [];
    setFormData({
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      description: b.description,
      location: b.location,
      collaborationPeriod: b.collaborationPeriod,
      completedProjectsCount: b.completedProjectsCount,
      categories: b.categories,
      featured: b.featured,
      collectionsList: b.collectionsList ? b.collectionsList.map((col) => ({ ...col })) : [],
      galleryImages: [existingImgs[0] || '', existingImgs[1] || '', existingImgs[2] || ''],
    });
    setShowModal(true);
  };

  const handleAddCollectionItem = () => {
    setFormData((prev) => ({
      ...prev,
      collectionsList: [
        ...prev.collectionsList,
        { name: `Collection ${prev.collectionsList.length + 1}`, articleSummary: '' },
      ],
    }));
  };

  const handleUpdateCollectionItem = (index: number, field: keyof BrandCollection, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.collectionsList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, collectionsList: updated };
    });
  };

  const handleRemoveCollectionItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      collectionsList: prev.collectionsList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const logo = formData.logo || formData.name.substring(0, 2).toUpperCase();

    // Sanitize collectionsList to remove empty rows
    const cleanedCollectionsList = formData.collectionsList.filter(
      (c) => c.name.trim() !== '' || c.articleSummary.trim() !== ''
    );

    const brandPayload = {
      ...formData,
      slug,
      logo,
      collectionsList: cleanedCollectionsList,
      collectionsCount: cleanedCollectionsList.length,
      galleryImages: formData.galleryImages.filter((img) => img.trim() !== ''),
    };

    if (editingBrand) {
      updateBrand(editingBrand.id, brandPayload);
    } else {
      addBrand({
        ...brandPayload,
        verified: true,
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D1C7BB]/15 pb-4">
        <div>
          <h3 className="font-editorial-heading font-black text-xl text-[#F2EDE4]">
            Client Brands Directory ({brands.length})
          </h3>
          <p className="text-xs text-[#A99E92]">
            Manage fashion brand client profiles, project associations, and collection item counts.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 bg-[#D1C7BB] text-[#101010] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#F2EDE4] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Brand Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => {
          const breakdownCount = b.collectionsList ? b.collectionsList.length : 0;

          return (
            <div key={b.id} className="liquid-glass bg-[#171614] border border-[#D1C7BB]/15 p-5 rounded space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#201C18] text-[#D1C7BB] font-bold text-xs flex items-center justify-center border border-[#D1C7BB]/20">
                    {b.logo || b.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F2EDE4] text-sm">{b.name}</h4>
                    <span className="text-[10px] text-[#A99E92]">{b.location}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 border border-[#D1C7BB]/20 rounded text-[#D1C7BB] hover:text-[#F2EDE4]"
                    title="Edit Brand & Item Counts"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete brand client "${b.name}"?`)) deleteBrand(b.id);
                    }}
                    className="p-1.5 border border-white/20 rounded text-[#F2EDE4] hover:bg-white/10"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#A99E92] line-clamp-2">{b.description}</p>

              {/* Status indicator for collection breakdown */}
              <div className="pt-2 border-t border-[#D1C7BB]/10 flex items-center justify-between text-[10px] font-mono text-[#A99E92]">
                <span className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-[#D1C7BB]" /> Item Breakdown:
                </span>
                {breakdownCount > 0 ? (
                  <span className="text-[#F2EDE4] font-bold">{breakdownCount} Collections Configured</span>
                ) : (
                  <span className="text-[#A99E92]">Not Configured (Hidden)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#101010]/80 backdrop-blur flex items-center justify-center p-4">
          <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded space-y-5">
            <div className="flex items-center justify-between border-b border-[#D1C7BB]/15 pb-3">
              <h3 className="font-bold text-lg text-[#F2EDE4]">
                {editingBrand ? 'Edit Brand Client & Media Sub-Grid' : 'Add Brand Client'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#A99E92] hover:text-[#F2EDE4] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs text-[#D1C7BB]">
              <div>
                <label className="block font-bold mb-1 text-[#F2EDE4]">Brand Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. NOCTURNE ATELIER"
                  className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[#F2EDE4]">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Paris, France"
                    className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#F2EDE4]">Collaboration Era</label>
                  <input
                    type="text"
                    value={formData.collaborationPeriod}
                    onChange={(e) => setFormData({ ...formData, collaborationPeriod: e.target.value })}
                    placeholder="e.g. 2024 - 2025"
                    className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#F2EDE4]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#101010] border border-[#D1C7BB]/20 p-2.5 rounded text-[#F2EDE4]"
                />
              </div>

              {/* BRAND SUB-GRID STAGE IMAGES (3 EDITABLE FIELDS) */}
              <div className="bg-[#101010] border border-[#D1C7BB]/20 p-4 rounded space-y-3">
                <div>
                  <h4 className="font-bold text-[#F2EDE4] text-xs flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-[#D1C7BB]" /> Brand Sub-Grid Stage Images (3 Editable Fields)
                  </h4>
                  <p className="text-[10px] text-[#A99E92] mt-0.5">
                    Configure up to 3 image URLs displayed in the brand card's top visual sub-grid layout.
                  </p>
                </div>

                <div className="space-y-2">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#A99E92] w-12 shrink-0">Slot 0{idx + 1}:</span>
                      <input
                        type="text"
                        value={formData.galleryImages[idx] || ''}
                        onChange={(e) => {
                          const newImgs = [...formData.galleryImages];
                          newImgs[idx] = e.target.value;
                          setFormData({ ...formData, galleryImages: newImgs });
                        }}
                        placeholder={`Image ${idx + 1} URL (https://...)`}
                        className="flex-1 bg-[#201C18] border border-[#3A332D] p-2 rounded text-[#F2EDE4] text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* COLLECTION BREAKDOWN & ITEM COUNT SECTION */}
              <div className="bg-[#101010] border border-[#D1C7BB]/20 p-4 rounded space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#F2EDE4] text-xs flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-[#D1C7BB]" /> Collection Breakdown & Item Counts
                    </h4>
                    <p className="text-[10px] text-[#A99E92] mt-0.5">
                      Items will only appear under the brand on the public site once explicitly added here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCollectionItem}
                    className="px-2.5 py-1 bg-[#201C18] border border-[#D1C7BB]/30 hover:border-[#F2EDE4] text-[#D1C7BB] hover:text-[#F2EDE4] text-[10px] font-bold rounded flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                {formData.collectionsList.length === 0 ? (
                  <div className="p-3 bg-[#201C18]/50 border border-dashed border-[#3A332D] rounded text-center text-[10px] text-[#A99E92]">
                    No item counts added yet. Collection breakdown is currently hidden for this brand.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.collectionsList.map((col, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#201C18] p-2 rounded border border-[#3A332D]">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => handleUpdateCollectionItem(idx, 'name', e.target.value)}
                          placeholder="e.g. Collection 1"
                          className="flex-1 bg-[#101010] border border-[#3A332D] p-1.5 rounded text-[#F2EDE4] text-[11px]"
                        />
                        <input
                          type="text"
                          value={col.articleSummary}
                          onChange={(e) => handleUpdateCollectionItem(idx, 'articleSummary', e.target.value)}
                          placeholder="e.g. 1 T-shirt"
                          className="flex-1 bg-[#101010] border border-[#3A332D] p-1.5 rounded text-[#F2EDE4] text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCollectionItem(idx)}
                          className="p-1.5 text-[#F2EDE4] hover:text-[#F2EDE4] hover:bg-white/10 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D1C7BB]/15">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#D1C7BB]/20 rounded text-[#D1C7BB] hover:text-[#F2EDE4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D1C7BB] text-[#101010] font-bold rounded hover:bg-[#F2EDE4] transition-colors"
                >
                  Save Brand & Counts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

