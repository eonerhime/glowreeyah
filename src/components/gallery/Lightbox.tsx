'use client';
import { useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  _id: string;
  url: string;
  caption: string;
}

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const photo = photos[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-brand-teal transition-colors"
      >
        ✕
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 text-white text-3xl hover:text-brand-teal transition-colors px-2"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-4xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption || 'Gallery photo'}
          width={1200}
          height={800}
          className="object-contain w-full max-h-[75vh] rounded-lg"
        />
        {photo.caption && (
          <p className="text-white/70 text-sm text-center mt-3">
            {photo.caption}
          </p>
        )}
        <p className="text-white/40 text-xs text-center mt-1">
          {index + 1} / {photos.length}
        </p>
      </div>

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 text-white text-3xl hover:text-brand-teal transition-colors px-2"
        >
          ›
        </button>
      )}
    </div>
  );
}
