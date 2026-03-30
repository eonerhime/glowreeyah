'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MediaUploader from '@/components/cms/MediaUploader';

interface MediaAssetType {
  _id: string;
  url: string;
  altText: string;
  type: string;
}

export default function CMSMediaPage() {
  const [assets, setAssets] = useState<MediaAssetType[]>([]);

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((d) => setAssets(d.data ?? []));
  }, []);

  function reload() {
    fetch('/api/media')
      .then((r) => r.json())
      .then((d) => setAssets(d.data ?? []));
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Media Library
      </h1>
      <MediaUploader onUploaded={reload} />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {assets.map((a: MediaAssetType) => (
          <div
            key={a._id}
            className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            {a.type === 'image' && (
              <Image
                src={a.url}
                alt={a.altText}
                fill
                className="object-cover"
              />
            )}
            {a.type !== 'image' && (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 uppercase">
                {a.type}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(a.url)}
                className="text-white text-xs bg-brand-teal px-2 py-1 rounded"
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
        {assets.length === 0 && (
          <p className="col-span-full text-center text-gray-400 text-sm py-10">
            No media uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
