import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ImageUploader({ images = [], onChange, maxImages = 10 }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error('Please select valid image files.');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const newImages = [...images];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target.result) {
          newImages.push(e.target.result);
          onChange([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-900 bg-white'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900">
          <Upload className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Click or Drag & Drop Photos</h3>
        <p className="text-sm text-gray-500 mb-2">High resolution photos attract up to 3x more inquiries.</p>
        <p className="text-xs text-gray-400 font-medium">PNG, JPG, WEBP up to 10MB each (Max {maxImages} photos)</p>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Selected Photos ({images.length}/{maxImages})
            </h4>
            <span className="text-xs text-gray-500">First photo will be the main cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((imgObj, idx) => {
              const src = typeof imgObj === 'string' ? imgObj : imgObj.url;
              return (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 bg-gray-100 shadow-sm">
                  <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase">
                      Cover
                    </span>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    {idx > 0 && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); handleMove(idx, -1); }} 
                        className="p-1.5 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors"
                        title="Move left"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); handleMove(idx, 1); }} 
                        className="p-1.5 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors"
                        title="Move right"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); handleRemove(idx); }} 
                      className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

