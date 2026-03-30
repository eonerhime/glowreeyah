'use client';
import { useState } from 'react';

interface Props {
  onUploaded: () => void;
}

export default function MediaUploader({ onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [type, setType] = useState('image');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload() {
    if (!file) return setError('Please select a file.');
    if (!altText) return setError('Alt text is required.');

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', altText);
      formData.append('type', type);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      setFile(null);
      setAltText('');
      onUploaded();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-serif font-semibold text-brand-deep mb-4">
        Upload New File
      </h2>
      <div className="space-y-4">
        {/* File input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File
          </label>
          <input
            type="file"
            accept="image/*,audio/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-600"
          />
        </div>

        {/* Alt text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text <span className="text-red-400">*</span>
          </label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the file..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          >
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
