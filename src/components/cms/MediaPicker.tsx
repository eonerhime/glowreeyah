'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MediaAsset {
  _id: string;
  url: string;
  altText: string;
  type: string;
}

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function MediaPicker({ value, onChange }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetch('/api/media')
        .then((r) => r.json())
        .then((d) => setAssets(d.data ?? []));
    }
  }, [open]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cover Image
      </label>
      <div className="flex items-center gap-3">
        {value && (
          <Image
            src={value}
            alt="Cover"
            width={80}
            height={80}
            className="rounded-lg object-cover w-20 h-20"
          />
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="text-sm text-brand-teal hover:underline"
        >
          {value ? 'Change image' : 'Select image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-sm text-red-400 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 border border-gray-200 rounded-xl p-3 grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {assets
            .filter((a) => a.type === 'image')
            .map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() => {
                  onChange(asset.url);
                  setOpen(false);
                }}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-teal transition-colors"
              >
                <Image
                  src={asset.url}
                  alt={asset.altText}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          {assets.length === 0 && (
            <p className="col-span-4 text-xs text-gray-400 text-center py-4">
              No images uploaded yet. Upload images in the Media section.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
