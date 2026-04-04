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

type Tab = 'library' | 'upload';

export default function MediaPicker({ value, onChange }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('library');

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function loadAssets() {
    fetch('/api/media')
      .then((r) => r.json())
      .then((d) => setAssets(d.data ?? []));
  }

  useEffect(() => {
    if (open) loadAssets();
  }, [open]);

  async function handleUpload() {
    if (!file) return setUploadError('Please select a file.');
    if (!altText) return setUploadError('Alt text is required.');

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', altText);
      formData.append('type', 'image');

      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      // Select the newly uploaded image immediately
      onChange(data.data.url);
      setOpen(false);
      setFile(null);
      setAltText('');
      loadAssets();
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-brand-teal text-brand-teal'
        : 'border-transparent text-gray-500 hover:text-brand-deep'
    }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Cover Image
      </label>

      {/* Preview + trigger */}
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

      {/* Panel */}
      {open && (
        <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              type="button"
              className={tabClass('library')}
              onClick={() => setTab('library')}
            >
              Library
            </button>
            <button
              type="button"
              className={tabClass('upload')}
              onClick={() => setTab('upload')}
            >
              Upload new
            </button>
          </div>

          {/* Library tab */}
          {tab === 'library' && (
            <div className="p-3 grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
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
              {assets.filter((a) => a.type === 'image').length === 0 && (
                <p className="col-span-4 text-xs text-gray-400 text-center py-6">
                  No images yet — switch to Upload to add one.
                </p>
              )}
            </div>
          )}

          {/* Upload tab */}
          {tab === 'upload' && (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="text-sm text-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alt text <span className="text-red-400">*</span>
                </label>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                />
              </div>
              {uploadError && (
                <p className="text-red-500 text-xs">{uploadError}</p>
              )}
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {uploading ? 'Uploading…' : 'Upload & select'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
