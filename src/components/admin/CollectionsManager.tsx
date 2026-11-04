import React, { useState } from 'react';
import {
  Plus,
  Building,
  Edit2,
  Trash2,
  Package,
  Tag,
  FolderOpen,
  Images,
  Eye,
  EyeOff,
  Maximize2,
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { ProductModal } from './ProductModal';
import { CollectionModal } from './CollectionModal';
import { ArticleGalleryModal } from '../common/ArticleGalleryModal';
import type { CollectionWithStats, ApparelProduct } from '../../types';

export const CollectionsManager: React.FC = () => {
  const {
    brands,
    collections,
    activeBrandId,
    setActiveBrandId,
    apparelCategories,
    addCollection,
    updateCollection,
    toggleCollectionActive,
    deleteCollection,
    addApparelProduct,
    updateApparelProduct,
    toggleProductPublished,
    deleteApparelProduct,
    addApparelCategory,
  } = useCMS();

  // Modal States
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionWithStats | null>(null);

  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<ApparelProduct | null>(null);

  // Inline Collection Name Editing state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineName, setInlineName] = useState<string>('');

  // Selected thumbnail index tracker for multi-image cards
  const [activeThumbMap, setActiveThumbMap] = useState<Record<string, number>>({});
  const [galleryProduct, setGalleryProduct] = useState<{ product: ApparelProduct; initialIndex: number } | null>(null);

  const currentBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
  const currentBrandCollections = collections.filter((c) => c.brand_id === activeBrandId);

  // Collection Modal Handlers
  const handleOpenNewCollection = () => {
    setEditingCollection(null);
    setIsColModalOpen(true);
  };

  const handleOpenEditCollection = (col: CollectionWithStats) => {
    setEditingCollection(col);
    setIsColModalOpen(true);
  };

  const handleSaveCollection = async (colData: { name: string; slug: string; description: string; banner_image: string; is_active: boolean }) => {
    if (editingCollection) {
      await updateCollection(editingCollection.id, colData);
    } else {
      await addCollection(activeBrandId, colData.name, colData.banner_image, colData.slug, colData.description);
    }
  };

  const handleDeleteCollection = async (col: CollectionWithStats) => {
    if (confirm(`Are you sure you want to delete "${col.name}"? This will also remove all apparel items in this drop.`)) {
      await deleteCollection(col.id);
    }
  };

  // Inline Name Editor
  const handleStartInlineEdit = (col: CollectionWithStats) => {
    setInlineEditId(col.id);
    setInlineName(col.name);
  };

  const handleSaveInlineEdit = async (col: CollectionWithStats) => {
    if (inlineName.trim() && inlineName.trim() !== col.name) {
      await updateCollection(col.id, { name: inlineName.trim() });
    }
    setInlineEditId(null);
  };

  // Product Modal Handlers
  const handleOpenAddProduct = (colId: string) => {
    setTargetCollectionId(colId);
    setEditingProduct(null);
    setIsProdModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ApparelProduct) => {
    setTargetCollectionId(prod.collection_id);
    setEditingProduct(prod);
    setIsProdModalOpen(true);
  };

  const handleSaveProduct = async (
    prodData: Omit<ApparelProduct, 'id'> | Partial<ApparelProduct>
  ) => {
    if (editingProduct) {
      await updateApparelProduct(editingProduct.id, prodData);
    } else {
      await addApparelProduct(prodData as Omit<ApparelProduct, 'id'>);
    }
  };

  const handleDeleteProduct = async (prod: ApparelProduct) => {
    if (confirm(`Delete apparel item "${prod.title}"?`)) {
      await deleteApparelProduct(prod.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Brand Selector Bar */}
      <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-6 rounded-sm space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#D1C7BB]/15 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#201C18] border border-[#D1C7BB]/30 rounded text-[10px] uppercase tracking-wider font-mono text-[#D1C7BB]">
                Multi-Collection Drops
              </span>
              <span className="text-xs text-[#A99E92]">
                {collections.length} Drop(s) for {currentBrand?.name}
              </span>
            </div>
            <h2 className="font-editorial-heading font-black text-2xl text-[#F2EDE4]">
              Brand Collections & Apparel Showcase
            </h2>
          </div>

          <button
            onClick={handleOpenNewCollection}
            className="px-5 py-2.5 bg-[#D1C7BB] text-[#101010] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#F2EDE4] transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Create Collection Drop
          </button>
        </div>

        {/* Brand Switcher Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#A99E92] mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#D1C7BB]" /> Select Active Client Brand:
          </label>

          <div className="flex flex-wrap gap-2.5">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBrandId(b.id)}
                className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeBrandId === b.id
                    ? 'bg-[#D1C7BB] text-[#101010] border-[#F2EDE4] shadow-md scale-[1.02]'
                    : 'bg-[#201C18] text-[#D1C7BB] border-[#D1C7BB]/20 hover:border-[#D1C7BB] hover:text-[#F2EDE4]'
                }`}
              >
                <div className="w-4 h-4 rounded bg-[#101010]/30 flex items-center justify-center font-mono text-[9px]">
                  {b.logo ? b.logo.substring(0, 2) : b.name.substring(0, 2)}
                </div>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Drops Overview List */}
      {currentBrandCollections.length === 0 ? (
        <div className="liquid-glass bg-[#171614] border border-dashed border-[#D1C7BB]/30 rounded-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#201C18] border border-[#D1C7BB]/30 flex items-center justify-center text-[#A99E92] mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-[#F2EDE4] text-base">No Collections Created Yet</h4>
            <p className="text-xs text-[#A99E92] max-w-md mx-auto mt-1">
              Start showcasing apparel drops for {currentBrand?.name} by creating your first collection.
            </p>
          </div>
          <button
            onClick={handleOpenNewCollection}
            className="px-5 py-2.5 bg-[#D1C7BB] text-[#101010] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#F2EDE4] transition-all"
          >
            Create Drop 1
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {currentBrandCollections.map((col) => {
            const hasProducts = col.products && col.products.length > 0;
            const isColActive = col.is_active !== undefined ? Boolean(col.is_active) : true;

            return (
              <div
                key={col.id}
                className={`liquid-glass bg-[#171614] border rounded-sm overflow-hidden shadow-2xl space-y-6 transition-all ${
                  isColActive ? 'border-[#D1C7BB]/25' : 'border-white/10 opacity-80 bg-[#101010]'
                }`}
              >
                {/* Collection Drop Cover Banner & Header Card */}
                <div className="relative h-52 md:h-60 w-full overflow-hidden bg-[#101010]">
                  <img
                    src={col.banner_image}
                    alt={col.name}
                    className={`w-full h-full object-cover transition-opacity ${isColActive ? 'opacity-60' : 'opacity-30 grayscale'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171614] via-[#171614]/40 to-transparent" />

                  {/* Top Action Buttons on Banner */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {/* Quick Active Visibility Toggle Button */}
                    <button
                      onClick={() => toggleCollectionActive(col.id)}
                      className={`px-3 py-1.5 rounded text-xs font-bold backdrop-blur flex items-center gap-1.5 border transition-all ${
                        isColActive
                          ? 'bg-white/10 border-white/20 text-[#F2EDE4] hover:bg-white/20'
                          : 'bg-[#201C18] border-[#3A332D] text-[#A99E92] hover:bg-[#29231F]'
                      }`}
                    >
                      {isColActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {isColActive ? 'Live on Site' : 'Hidden Drop'}
                    </button>

                    <button
                      onClick={() => handleOpenEditCollection(col)}
                      className="px-3 py-1.5 bg-[#101010]/80 hover:bg-[#101010] border border-[#D1C7BB]/30 rounded text-xs text-[#D1C7BB] hover:text-[#F2EDE4] backdrop-blur flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Drop
                    </button>

                    <button
                      onClick={() => handleDeleteCollection(col)}
                      className="px-3 py-1.5 bg-[#201C18] hover:bg-[#F2EDE4] border border-white/20 rounded text-xs text-[#F2EDE4] hover:text-[#101010] backdrop-blur flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Drop
                    </button>
                  </div>

                  {/* Collection Title & Aggregated Counter Summary */}
                  <div className="absolute bottom-4 left-6 right-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#D1C7BB] text-[#101010] rounded text-[10px] font-black uppercase tracking-wider">
                        {currentBrand?.name}
                      </span>
                      <span className="text-xs text-[#D1C7BB]/80 font-mono">
                        Slug: /{col.slug}
                      </span>
                      <span className="text-xs text-[#A99E92] font-mono">
                        ({col.total_products || col.products?.length || 0} Apparel Items)
                      </span>
                    </div>

                    {/* Inline Title Editor vs Static Heading */}
                    {inlineEditId === col.id ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <input
                          type="text"
                          value={inlineName}
                          onChange={(e) => setInlineName(e.target.value)}
                          className="bg-[#101010] border border-[#F2EDE4] rounded px-3 py-1.5 text-lg font-black text-[#F2EDE4] focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInlineEdit(col);
                            if (e.key === 'Escape') setInlineEditId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveInlineEdit(col)}
                          className="px-3 py-1.5 bg-[#D96A3B] text-[#101010] text-xs font-bold rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h3 className="font-editorial-heading font-black text-2xl md:text-3xl text-[#F2EDE4]">
                          {col.name}
                        </h3>
                        <button
                          onClick={() => handleStartInlineEdit(col)}
                          className="text-[#D1C7BB] hover:text-[#F2EDE4] opacity-80 hover:opacity-100 transition-opacity"
                          title="Inline edit drop title"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Item Counter Badges Grouped by Category */}
                <div className="px-6 py-4 bg-[#201C18] border-y border-[#D1C7BB]/15 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#A99E92] mr-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#D1C7BB]" /> Category Breakdown:
                    </span>

                    {col.categoryCounts && col.categoryCounts.length > 0 ? (
                      col.categoryCounts.map((cnt, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#101010] border border-[#D1C7BB]/30 rounded-full text-xs text-[#D1C7BB] flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="font-semibold text-[#F2EDE4]">{cnt.categoryName}:</span>
                          <span className="px-1.5 py-0.2 bg-[#D1C7BB] text-[#101010] rounded-full text-[10px] font-bold font-mono">
                            {cnt.count}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#A99E92] italic">
                        No articles added yet
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenAddProduct(col.id)}
                    className="px-4 py-2 bg-[#D1C7BB] hover:bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 shadow-md ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Apparel Item
                  </button>
                </div>

                {/* Design Showcase Articles Grid */}
                <div className="px-6 pb-6 space-y-4">
                  {!hasProducts ? (
                    <div className="p-8 border border-dashed border-[#D1C7BB]/20 rounded text-center text-xs text-[#A99E92] space-y-2">
                      <Package className="w-6 h-6 mx-auto text-[#A99E92]/60" />
                      <p>This collection drop has no apparel items yet.</p>
                      <button
                        onClick={() => handleOpenAddProduct(col.id)}
                        className="text-[#D1C7BB] hover:text-[#F2EDE4] underline font-bold"
                      >
                        + Add apparel item to {col.name}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {col.products?.map((prod) => {
                        const imgList: string[] = (() => {
                          if (Array.isArray(prod.images) && prod.images.length > 0) return prod.images;
                          if (typeof prod.images === 'string' && (prod.images as string).trim().startsWith('[')) {
                            try {
                              const parsed = JSON.parse(prod.images);
                              if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                            } catch {}
                          }
                          if (prod.image_url) return [prod.image_url];
                          return [];
                        })();
                        const activeIdx = activeThumbMap[prod.id] || 0;
                        const currentDisplayImg = imgList[activeIdx] || imgList[0] || '';
                        const isProdPublished = prod.is_published !== undefined ? Boolean(prod.is_published) : true;

                        return (
                          <div
                            key={prod.id}
                            className={`bg-[#101010] border rounded overflow-hidden group hover:border-[#D1C7BB]/60 transition-all flex flex-col justify-between ${
                              isProdPublished ? 'border-[#D1C7BB]/20' : 'border-white/10 opacity-70'
                            }`}
                          >
                            {/* Product Showcase Image Display */}
                            <div
                              onClick={() => setGalleryProduct({ product: prod, initialIndex: activeIdx })}
                              className="relative h-52 w-full overflow-hidden bg-[#201C18] cursor-pointer group/img"
                              title="Click to view design photos in full screen"
                            >
                              <img
                                src={currentDisplayImg}
                                alt={prod.title}
                                className={`w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300 ${!isProdPublished ? 'grayscale' : ''}`}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600';
                                }}
                              />

                              {/* Category Badge */}
                              <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#101010]/85 border border-[#D1C7BB]/30 backdrop-blur rounded text-[10px] font-bold text-[#F2EDE4]">
                                {prod.category_name || 'Apparel'}
                              </div>

                              {/* Multi-Image Count Pill */}
                              {imgList.length > 1 && (
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#101010]/90 border border-[#D1C7BB]/30 backdrop-blur rounded text-[10px] font-bold text-[#D1C7BB] flex items-center gap-1">
                                  <Images className="w-3 h-3 text-[#F2EDE4]" /> {imgList.length} Photos
                                </div>
                              )}

                              {/* Quick Actions (Published Toggle, Edit, Delete) */}
                              <div
                                className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProductPublished(prod.id);
                                  }}
                                  className={`p-1.5 rounded border backdrop-blur text-xs ${
                                    isProdPublished
                                      ? 'bg-white/10 border-white/20 text-[#F2EDE4]'
                                      : 'bg-[#201C18] border-[#3A332D] text-[#A99E92]'
                                  }`}
                                  title={isProdPublished ? 'Click to set as Draft' : 'Click to Publish'}
                                >
                                  {isProdPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditProduct(prod);
                                  }}
                                  className="p-1.5 bg-[#101010]/90 hover:bg-[#101010] text-[#D1C7BB] hover:text-[#F2EDE4] rounded border border-[#D1C7BB]/30"
                                  title="Edit article"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProduct(prod);
                                  }}
                                  className="p-1.5 bg-[#201C18] hover:bg-[#F2EDE4] text-[#F2EDE4] hover:text-[#101010] rounded border border-white/20"
                                  title="Delete article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Hover Overlay Button to View Full Size */}
                              <div className="absolute inset-0 bg-[#101010]/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-2 backdrop-blur-xs pointer-events-none">
                                <span className="px-3 py-1.5 bg-[#201C18]/95 border border-[#D1C7BB]/50 rounded-full text-xs font-bold text-[#F2EDE4] flex items-center gap-1.5 shadow-lg tracking-wider uppercase text-[10px]">
                                  <Maximize2 className="w-3.5 h-3.5 text-[#D1C7BB]" /> Open Photos
                                </span>
                              </div>
                            </div>

                            {/* Article Details & Multi-Image Selector Bar */}
                            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <h5
                                    onClick={() => setGalleryProduct({ product: prod, initialIndex: activeIdx })}
                                    className="font-bold text-sm text-[#F2EDE4] truncate cursor-pointer hover:text-[#D1C7BB] transition-colors"
                                    title="Click to view full size"
                                  >
                                    {prod.title}
                                  </h5>
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${isProdPublished ? 'text-[#F2EDE4] bg-white/10' : 'text-[#A99E92] bg-[#201C18]'}`}>
                                    {isProdPublished ? 'Live' : 'Draft'}
                                  </span>
                                </div>
                              </div>

                              {/* Multi-Image Thumbnail Switcher */}
                              {imgList.length > 1 && (
                                <div className="flex gap-1.5 pt-2 border-t border-[#D1C7BB]/10 overflow-x-auto">
                                  {imgList.map((thumbUrl, tIdx) => (
                                    <button
                                      key={tIdx}
                                      onClick={() =>
                                        setActiveThumbMap((prev) => ({
                                          ...prev,
                                          [prod.id]: tIdx,
                                        }))
                                      }
                                      className={`w-7 h-7 rounded overflow-hidden border transition-all shrink-0 ${
                                        activeIdx === tIdx
                                          ? 'border-[#F2EDE4] ring-1 ring-[#F2EDE4]'
                                          : 'border-[#D1C7BB]/20 opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      <img
                                        src={thumbUrl}
                                        alt={`Thumb ${tIdx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collection Modal */}
      <CollectionModal
        isOpen={isColModalOpen}
        onClose={() => setIsColModalOpen(false)}
        onSave={handleSaveCollection}
        initialCollection={editingCollection}
        brandName={currentBrand?.name}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={isProdModalOpen}
        onClose={() => setIsProdModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        collectionId={targetCollectionId}
        categories={apparelCategories}
        onAddCategory={addApparelCategory}
      />

      {/* High-Resolution Article Gallery Modal */}
      <ArticleGalleryModal
        isOpen={Boolean(galleryProduct)}
        onClose={() => setGalleryProduct(null)}
        product={galleryProduct?.product || null}
        initialIndex={galleryProduct?.initialIndex || 0}
      />
    </div>
  );
};

