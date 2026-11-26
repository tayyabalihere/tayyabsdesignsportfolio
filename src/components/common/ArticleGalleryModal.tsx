import React, { useState, useEffect, useRef } from 'react';
import { portfolioImage } from '../../data/portfolioImages';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { ApparelProduct } from '../../types';

interface ArticleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ApparelProduct | null;
  initialIndex?: number;
}

export const ArticleGalleryModal: React.FC<ArticleGalleryModalProps> = ({
  isOpen,
  onClose,
  product,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previousFocus?.focus();
  }, [isOpen]);

  // Normalize images array
  const images: string[] = (() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (typeof product.images === 'string' && (product.images as string).trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    if (product.image_url) return [product.image_url];
    return [];
  })();

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [])];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || !product || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Use createPortal to mount directly into document.body
  // This guarantees the modal is never constrained by parent CSS transforms, filters, or z-index stacking contexts
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-gallery-title"
      tabIndex={-1}
      className="fixed inset-0 top-0 left-0 w-screen h-screen z-[99999] bg-[#101010]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar Header */}
      <div
        className="h-14 sm:h-16 shrink-0 flex items-center justify-between w-full max-w-6xl mx-auto z-10 px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {product.category_name && (
            <span className="px-2.5 py-1 bg-[#201C18] border border-[#D1C7BB]/30 rounded text-xs font-bold uppercase tracking-wider text-[#F2EDE4]">
              {product.category_name}
            </span>
          )}
          <div>
            <h3 id="article-gallery-title" className="text-base sm:text-lg font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
              {product.title}
            </h3>
            {images.length > 1 && (
              <p className="text-[11px] text-[#A99E92] font-mono">
                Photo {currentIndex + 1} of {images.length}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original image in new tab"
            aria-label="Open original image in new tab"
            className="p-2.5 rounded bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] border border-[#D1C7BB]/25 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            title="Close viewer (Esc)"
            aria-label="Close image viewer"
            className="p-2.5 rounded bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] border border-[#D1C7BB]/25 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage - Constrained with min-h-0 so image is always centered without overflow */}
      <div
        className="flex-1 min-h-0 w-full max-w-6xl mx-auto relative flex items-center justify-center p-2 sm:p-4 my-2 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Button: Prev */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            title="Previous image (Left Arrow)"
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 p-3 sm:p-3.5 rounded-full bg-[#101010]/80 hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] border border-[#D1C7BB]/40 backdrop-blur shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* High-Resolution Center Image */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={portfolioImage(currentImage)}
            alt={`${product.title} - View ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain rounded-sm border border-[#D1C7BB]/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] transition-all duration-300 select-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200';
            }}
          />
        </div>

        {/* Navigation Button: Next */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            title="Next image (Right Arrow)"
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 p-3 sm:p-3.5 rounded-full bg-[#101010]/80 hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] border border-[#D1C7BB]/40 backdrop-blur shadow-2xl transition-all hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Bar: Thumbnails Strip & Description */}
      <div
        className="shrink-0 w-full max-w-4xl mx-auto flex flex-col items-center gap-2 z-10 px-2 pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 px-2 max-w-full">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                aria-pressed={currentIndex === idx}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#F2EDE4] ring-2 ring-[#F2EDE4] scale-105 shadow-lg'
                    : 'border-[#D1C7BB]/30 opacity-60 hover:opacity-100 hover:border-[#D1C7BB]'
                }`}
              >
                <img
                  src={portfolioImage(img, 'small')}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 bg-[#101010]/80 rounded text-[9px] font-mono text-[#F2EDE4]">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Article Description */}
        {product.description && (
          <p className="text-center text-xs text-[#D1C7BB] max-w-2xl mx-auto line-clamp-2 px-4">
            {product.description}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

