import React, { useState, useEffect } from 'react';
import { X, Layers, Sparkles, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { CollectionWithStats } from '../../types';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collectionData: { name: string; slug: string; description: string; banner_image: string; is_active: boolean }) => void;
  initialCollection?: CollectionWithStats | null;
  brandName?: string;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialCollection,
  brandName = 'Selected Brand',
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialCollection) {
      setName(initialCollection.name || '');
      setSlug(initialCollection.slug || '');
      setDescription(initialCollection.description || '');
      setBannerImage(initialCollection.banner_image || '');
      setIsActive(initialCollection.is_active !== undefined ? Boolean(initialCollection.is_active) : true);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setBannerImage('');
      setIsActive(true);
    }
  }, [initialCollection, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialCollection) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const banner =
      bannerImage ||
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200';
    const finalSlug = slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    onSave({
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
      banner_image: banner,
      is_active: isActive,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101010]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 w-full max-w-xl rounded-sm p-6 space-y-6 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D1C7BB]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#201C18] border border-[#D1C7BB]/30 flex items-center justify-center text-[#D1C7BB]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial-heading font-black text-lg text-[#F2EDE4]">
                {initialCollection ? 'Edit Collection Drop' : `New Collection Drop for ${brandName}`}
              </h3>
              <p className="text-xs text-[#A99E92]">
                Create a seasonal drop or capsule collection to organize apparel items.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded border border-[#D1C7BB]/20 text-[#A99E92] hover:text-[#F2EDE4] hover:border-[#F2EDE4] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Collection Name & Slug Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D1C7BB]" /> Collection / Drop Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Drop 1: Cyber Darkware"
                className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4] mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#D1C7BB]" /> URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="drop-1-cyber-darkware"
                className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors font-mono"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4] mb-1.5">
              Drop Story / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Tactical cybernetic streetwear capsule featuring heavyweight cottons..."
              rows={3}
              className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors"
            />
          </div>

          {/* Banner Image Uploader */}
          <ImageUploader
            value={bannerImage}
            onChange={(url) => setBannerImage(url)}
            label="Collection Cover Banner"
            helperText="Drag & drop collection banner image or click to browse"
          />

          {/* Visibility Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 bg-[#201C18] rounded border border-[#D1C7BB]/20">
            <div className="flex items-center gap-2">
              {isActive ? <Eye className="w-4 h-4 text-[#D1C7BB]" /> : <EyeOff className="w-4 h-4 text-[#A99E92]" />}
              <div>
                <span className="text-xs font-bold text-[#F2EDE4]">Collection Active Visibility</span>
                <p className="text-[11px] text-[#A99E92]">When active, this drop is instantly visible on live storefront</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-white/10 border-white/20 text-[#F2EDE4]'
                  : 'bg-[#101010] border-[#D1C7BB]/20 text-[#A99E92]'
              }`}
            >
              {isActive ? 'Active (Live)' : 'Hidden (Draft)'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D1C7BB]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#D1C7BB] border border-[#D1C7BB]/30 rounded hover:bg-[#201C18] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 bg-[#D1C7BB] hover:bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
            >
              {initialCollection ? 'Save Changes' : 'Create Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

