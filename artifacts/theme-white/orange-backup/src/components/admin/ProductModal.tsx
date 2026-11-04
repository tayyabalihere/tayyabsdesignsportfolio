import React, { useState, useEffect } from 'react';
import { X, Plus, Package, Tag, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { ApparelCategory, ApparelProduct } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<ApparelProduct, 'id'> | Partial<ApparelProduct>) => void;
  initialProduct?: ApparelProduct | null;
  collectionId: string;
  categories: ApparelCategory[];
  onAddCategory: (name: string) => Promise<ApparelCategory | void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  collectionId,
  categories,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  
  // Custom Category State
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title || '');
      setSlug(initialProduct.slug || '');
      setDescription(initialProduct.description || '');
      setCategoryId(initialProduct.category_id || (categories[0]?.id || ''));
      let existingImgs: string[] = [];
      if (Array.isArray(initialProduct.images)) {
        existingImgs = initialProduct.images;
      } else if (typeof initialProduct.images === 'string' && (initialProduct.images as string).trim()) {
        try {
          const parsed = JSON.parse(initialProduct.images);
          existingImgs = Array.isArray(parsed) ? parsed : [initialProduct.images];
        } catch {
          existingImgs = [initialProduct.images];
        }
      } else if (initialProduct.image_url) {
        existingImgs = [initialProduct.image_url];
      }
      setImages(existingImgs);
      setIsPublished(initialProduct.is_published !== undefined ? Boolean(initialProduct.is_published) : true);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setCategoryId(categories[0]?.id || 'cat-jerseys');
      setImages([]);
      setIsPublished(true);
    }
  }, [initialProduct, categories, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      const created = await onAddCategory(newCatName.trim());
      if (created) {
        setCategoryId(created.id);
      }
      setNewCatName('');
      setShowNewCatInput(false);
    } catch (err) {
      console.error('Failed to add category:', err);
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || images.length === 0) return;

    const finalSlug = slug.trim() || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    onSave({
      collection_id: collectionId,
      category_id: categoryId,
      title: title.trim(),
      slug: finalSlug,
      description: description.trim(),
      images,
      image_url: images[0],
      is_published: isPublished,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101010]/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/30 w-full max-w-2xl rounded-sm p-6 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D1C7BB]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#201C18] border border-[#D1C7BB]/30 flex items-center justify-center text-[#D1C7BB]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial-heading font-black text-lg text-[#F2EDE4]">
                {initialProduct ? 'Edit Apparel Item' : 'Add Apparel Item to Drop'}
              </h3>
              <p className="text-xs text-[#A99E92]">
                Configure item details, category, and attach presentation photos.
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
          {/* Title & Slug Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4] mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Pro Racing Cyber Jersey v1"
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
                placeholder="pro-racing-cyber-jersey-v1"
                className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors font-mono"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4] mb-1.5">
              Item Description & Fabric Specifications
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 460GSM heavyweight organic cotton t-shirt featuring discharge screen print..."
              rows={3}
              className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors"
            />
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#F2EDE4] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D1C7BB]" /> Garment Category *
              </label>

              <button
                type="button"
                onClick={() => setShowNewCatInput(!showNewCatInput)}
                className="text-xs text-[#D1C7BB] hover:text-[#F2EDE4] underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Add Custom Category
              </button>
            </div>

            {showNewCatInput && (
              <div className="flex gap-2 mb-3 bg-[#201C18] p-2.5 rounded border border-[#D1C7BB]/20">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Tank Tops, Accessories"
                  className="flex-1 bg-[#101010] border border-[#D1C7BB]/30 rounded p-2 text-xs text-[#F2EDE4]"
                />
                <button
                  type="button"
                  onClick={handleSaveCategory}
                  disabled={isAddingCat || !newCatName.trim()}
                  className="px-3 py-1.5 bg-[#D1C7BB] text-[#101010] text-xs font-bold rounded hover:bg-[#F2EDE4] disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            )}

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#101010] border border-[#D1C7BB]/30 rounded p-3 text-sm text-[#F2EDE4] focus:border-[#D1C7BB] focus:outline-none transition-colors"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="liquid-glass bg-[#171614] text-[#F2EDE4]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Multi-Image Drag & Drop Uploader */}
          <ImageUploader
            values={images}
            onMultipleChange={(urls) => setImages(urls)}
            multiple={true}
            label="Article Presentation Images (Multi-Upload Allowed) *"
            helperText="Hold Ctrl or Shift to select multiple images at once, or drag & drop files (PNG, JPG, WebP)"
          />

          {/* Visibility Switch */}
          <div className="flex items-center justify-between p-3.5 bg-[#201C18] rounded border border-[#D1C7BB]/20">
            <div className="flex items-center gap-2">
              {isPublished ? <Eye className="w-4 h-4 text-[#D1C7BB]" /> : <EyeOff className="w-4 h-4 text-[#A99E92]" />}
              <div>
                <span className="text-xs font-bold text-[#F2EDE4]">Publish Status</span>
                <p className="text-[11px] text-[#A99E92]">When published, this item appears immediately on live storefront</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                isPublished
                  ? 'bg-white/10 border-white/20 text-[#F2EDE4]'
                  : 'bg-[#101010] border-[#D1C7BB]/20 text-[#A99E92]'
              }`}
            >
              {isPublished ? 'Published (Live)' : 'Draft (Hidden)'}
            </button>
          </div>

          {/* Modal Actions */}
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
              disabled={!title.trim() || images.length === 0}
              className="px-6 py-2.5 bg-[#D1C7BB] hover:bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
            >
              {initialProduct ? 'Update Apparel Item' : 'Add to Drop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

