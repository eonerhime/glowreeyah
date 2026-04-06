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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  function handleCopy(id: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Media Library
      </h1>
      <MediaUploader onUploaded={reload} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {assets.map((a: MediaAssetType) => (
          <div
            key={a._id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Preview */}
            <div className="relative aspect-square bg-gray-100">
              {a.type === 'image' && (
                <Image
                  src={a.url}
                  alt={a.altText}
                  fill
                  className="object-cover"
                />
              )}
              {a.type === 'audio' && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                  <span className="text-4xl">🎵</span>
                  <audio controls src={a.url} className="w-full" />
                </div>
              )}
              {a.type === 'video' && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <span className="text-4xl">🎬</span>
                  <span className="text-xs text-gray-400">Video</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p
                className="text-xs font-medium text-brand-deep truncate"
                title={a.altText}
              >
                {a.altText}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400 uppercase tracking-widest">
                  {a.type}
                </span>
                <button
                  onClick={() => handleCopy(a._id, a.url)}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all duration-200
                    ${
                      copiedId === a._id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-brand-teal hover:bg-brand-teal hover:text-white'
                    }`}
                >
                  {copiedId === a._id ? (
                    <>
                      <span>✓</span>
                      <span>Copied</span>
                    </>
                  ) : (
                    <span>Copy URL</span>
                  )}
                </button>
              </div>
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
