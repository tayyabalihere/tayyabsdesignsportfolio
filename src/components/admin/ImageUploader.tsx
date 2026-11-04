import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle, Loader2, Plus, Star, ArrowLeft, ArrowRight, Link, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  values?: string[];
  onChange?: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  values = [],
  onChange,
  onMultipleChange,
  multiple = false,
  label = 'Design Showcase Images',
  helperText = 'Hold Ctrl or Shift to select multiple images at once, or drag & drop files (PNG, JPG, WebP max 10MB)',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize safe array for values
  const safeValues: string[] = (() => {
    if (Array.isArray(values)) return values;
    if (typeof values === 'string' && (values as string).trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(values);
        return Array.isArray(parsed) ? parsed : [values];
      } catch {
        return [values];
      }
    }
    return values ? [values] : [];
  })();

  const imagesList = multiple ? safeValues : value ? [value] : [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const validFiles = filesArray.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setError('Please select valid image file(s) (PNG, JPG, WebP, SVG, etc.).');
      return;
    }

    const overSized = validFiles.find((f) => f.size > 15 * 1024 * 1024);
    if (overSized) {
      setError('Each image file size must be less than 15MB.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach((f) => formData.append('images', f));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        let newUrls: string[] = [];
        if (Array.isArray(data.urls) && data.urls.length > 0) {
          newUrls = data.urls;
        } else if (Array.isArray(data.files) && data.files.length > 0) {
          newUrls = data.files.map((f: any) => (typeof f === 'string' ? f : f.url)).filter(Boolean);
        } else if (data.url) {
          newUrls = [data.url];
        }

        if (multiple && onMultipleChange) {
          onMultipleChange([...safeValues, ...newUrls]);
        } else if (onChange && newUrls.length > 0) {
          onChange(newUrls[0]);
        }
      } else {
        // Fallback: FileReader Base64 in case server fails
        const fallbackUrls: string[] = await Promise.all(
          validFiles.map(
            (file) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve((e.target?.result as string) || '');
                reader.readAsDataURL(file);
              })
          )
        );

        if (multiple && onMultipleChange) {
          onMultipleChange([...safeValues, ...fallbackUrls]);
        } else if (onChange && fallbackUrls.length > 0) {
          onChange(fallbackUrls[0]);
        }
      }
    } catch (err) {
      console.warn('Upload API unreachable, fallback to FileReader base64:', err);
      const fallbackUrls: string[] = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve((e.target?.result as string) || '');
              reader.readAsDataURL(file);
            })
        )
      );

      if (multiple && onMultipleChange) {
        onMultipleChange([...safeValues, ...fallbackUrls]);
      } else if (onChange && fallbackUrls.length > 0) {
        onChange(fallbackUrls[0]);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Always clear input value to allow selecting identical file again or new files
    e.target.value = '';
  };

  const handleTriggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setError(null);
    if (multiple && onMultipleChange) {
      onMultipleChange([...safeValues, trimmed]);
    } else if (onChange) {
      onChange(trimmed);
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (multiple && onMultipleChange) {
      const updated = safeValues.filter((_, idx) => idx !== indexToRemove);
      onMultipleChange(updated);
    } else if (onChange) {
      onChange('');
    }
  };

  const handleClearAll = () => {
    if (multiple && onMultipleChange) {
      onMultipleChange([]);
    } else if (onChange) {
      onChange('');
    }
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (multiple && onMultipleChange && indexToPrimary > 0) {
      const target = safeValues[indexToPrimary];
      const rest = safeValues.filter((_, idx) => idx !== indexToPrimary);
      onMultipleChange([target, ...rest]);
    }
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (!multiple || !onMultipleChange) return;
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= safeValues.length) return;

    const updated = [...safeValues];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onMultipleChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#F2EDE4]">
            {label} {multiple && `(${imagesList.length} Selected)`}
          </label>
          {multiple && imagesList.length > 0 && (
            <span className="text-[10px] bg-[#201C18] border border-[#D1C7BB]/30 px-2 py-0.5 rounded text-[#D1C7BB] font-mono">
              Card 1 is Cover Photo
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#D1C7BB] hover:text-[#F2EDE4] flex items-center gap-1 transition-colors underline"
          >
            <Link className="w-3 h-3" /> {showUrlInput ? 'Hide URL Input' : '+ Add via URL'}
          </button>

          {multiple && imagesList.length > 1 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-[#F2EDE4] hover:text-[#D1C7BB] flex items-center gap-1 transition-colors underline ml-2"
            >
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Optional URL Input Bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-[#201C18] border border-[#D1C7BB]/25 rounded">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
            placeholder="Paste image link: https://images.unsplash.com/..."
            className="flex-1 bg-[#101010] border border-[#D1C7BB]/30 rounded px-3 py-1.5 text-xs text-[#F2EDE4] focus:outline-none focus:border-[#F2EDE4]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="px-3 py-1.5 bg-[#D1C7BB] hover:bg-[#D96A3B] text-[#101010] text-xs font-bold rounded transition-colors disabled:opacity-50"
          >
            Add Image
          </button>
        </div>
      )}

      {/* Multi-Image Gallery Grid */}
      {imagesList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {imagesList.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className={`relative group rounded border overflow-hidden bg-[#201C18] aspect-square flex items-center justify-center transition-all ${
                idx === 0
                  ? 'border-[#D1C7BB] ring-1 ring-[#D1C7BB]/40 shadow-lg'
                  : 'border-[#D1C7BB]/20 hover:border-[#D1C7BB]/60'
              }`}
            >
              <img
                src={url}
                alt={`Item image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600';
                }}
              />

              {/* Cover Badge or Index Badge */}
              {idx === 0 ? (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#101010]/90 border border-[#D1C7BB]/60 rounded text-[9px] font-black uppercase text-[#F2EDE4] flex items-center gap-1 shadow">
                  <Star className="w-2.5 h-2.5 text-[#F2EDE4] fill-[#F2EDE4]" /> Cover
                </div>
              ) : (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#101010]/80 border border-[#D1C7BB]/30 rounded text-[9px] font-mono text-[#D1C7BB]">
                  #{idx + 1}
                </div>
              )}

              {/* Hover Action Overlay */}
              <div className="absolute inset-0 bg-[#101010]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 backdrop-blur-xs">
                {/* Top Overlay Actions: Move buttons */}
                <div className="flex items-center justify-between w-full">
                  {multiple && idx > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'left')}
                      title="Move earlier"
                      className="p-1 bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] rounded border border-[#D1C7BB]/30 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  ) : <div />}

                  {multiple && idx < imagesList.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'right')}
                      title="Move later"
                      className="p-1 bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] rounded border border-[#D1C7BB]/30 transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Center / Bottom Overlay Actions */}
                <div className="flex items-center justify-center gap-2">
                  {multiple && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      title="Set as cover image"
                      className="px-2 py-1 bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] text-[10px] font-bold rounded border border-[#D1C7BB]/40 transition-colors flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" /> Make Cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove image"
                    className="p-1.5 bg-[#201C18] hover:bg-[#F2EDE4] text-[#F2EDE4] hover:text-[#101010] rounded border border-white/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleTriggerBrowse}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
          isDragging
            ? 'border-[#F2EDE4] bg-[#D1C7BB]/15 scale-[0.99]'
            : 'border-[#D1C7BB]/30 bg-[#101010] hover:border-[#D1C7BB] hover:bg-[#201C18]/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml,image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleFileSelect}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-[#D1C7BB] py-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F2EDE4]" />
            <span className="text-xs font-semibold">Uploading image files to server...</span>
          </div>
        ) : (
          <>
            <div className="w-11 h-11 rounded-full bg-[#201C18] border border-[#D1C7BB]/30 flex items-center justify-center text-[#D1C7BB] group-hover:scale-110 transition-transform">
              {multiple && imagesList.length > 0 ? (
                <Plus className="w-6 h-6 text-[#F2EDE4]" />
              ) : (
                <UploadCloud className="w-6 h-6 text-[#F2EDE4]" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-[#F2EDE4]">
                {multiple && imagesList.length > 0
                  ? '+ Add more images to this article'
                  : 'Click to select images or drag & drop here'}
              </p>
              <p className="text-[11px] text-[#A99E92] max-w-md mx-auto">{helperText}</p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTriggerBrowse();
              }}
              className="mt-1 px-4 py-1.5 bg-[#201C18] hover:bg-[#F2EDE4] text-[#D1C7BB] hover:text-[#101010] border border-[#D1C7BB]/40 hover:border-[#F2EDE4] rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {multiple ? 'Select Multiple Files' : 'Browse File'}
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-[#F2EDE4] mt-1 bg-[#201C18] p-2 rounded border border-[#F2EDE4]/30">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#D1C7BB]" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

