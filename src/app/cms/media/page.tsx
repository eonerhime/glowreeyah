'use client';
// src/app/cms/media/page.tsx
import { useState, useEffect, useCallback } from 'react';
import MediaUploader from '@/components/cms/MediaUploader';

interface Asset {
  _id: string;
  url: string;
  altText: string;
  type: string;
}

export default function CMSMediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/media');
    const data = await res.json();
    setAssets(data.data ?? []);
    setSelected(new Set()); // clear selection on reload
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── selection helpers ──────────────────────────────────────
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === assets.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(assets.map((a) => a._id)));
    }
  }

  // ── single delete (per-card button) ───────────────────────
  async function deleteSingle(id: string) {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAssets((prev) => prev.filter((a) => a._id !== id));
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    } catch {
      alert('Delete failed — please try again.');
    } finally {
      setDeleting(false);
    }
  }

  // ── bulk delete ────────────────────────────────────────────
  async function deleteSelected() {
    if (selected.size === 0) return;
    if (
      !confirm(
        `Delete ${selected.size} file${selected.size > 1 ? 's' : ''}? This cannot be undone.`
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      const deletedIds = new Set(selected);
      setAssets((prev) => prev.filter((a) => !deletedIds.has(a._id)));
      setSelected(new Set());
    } catch {
      alert('Delete failed — please try again.');
    } finally {
      setDeleting(false);
    }
  }

  const allSelected = assets.length > 0 && selected.size === assets.length;
  const someSelected = selected.size > 0;

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-brand-deep">
          Media Library
        </h1>

        {someSelected && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50
                       text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {deleting ? 'Deleting…' : `Delete ${selected.size} selected`}
          </button>
        )}
      </div>

      {/* ── Uploader ── */}
      <MediaUploader onUploaded={load} />

      {/* ── Toolbar (select-all + count) ── */}
      {assets.length > 0 && (
        <div className="flex items-center gap-3 mt-8 mb-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-brand-teal cursor-pointer"
            />
            {allSelected ? 'Deselect all' : 'Select all'}
          </label>
          {someSelected && (
            <span className="text-sm text-gray-400">
              {selected.size} of {assets.length} selected
            </span>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <p className="text-sm text-gray-400 mt-6">Loading…</p>
      ) : assets.length === 0 ? (
        <p className="text-sm text-gray-400 mt-6">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const isSelected = selected.has(asset._id);

            return (
              <div
                key={asset._id}
                className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100
                            ring-2 transition-all cursor-pointer
                            ${isSelected ? 'ring-brand-teal' : 'ring-transparent'}`}
                onClick={() => toggleOne(asset._id)}
              >
                {/* Thumbnail or audio placeholder */}
                {asset.type === 'audio' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-brand-deep/10 gap-1 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-brand-teal shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    <span className="text-xs text-gray-500 text-center leading-tight line-clamp-2">
                      {asset.altText}
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.altText}
                    className="object-cover w-full h-full"
                  />
                )}

                {/* Checkbox — top-left, always visible when selected, else on hover */}
                <div
                  className={`absolute top-2 left-2 transition-opacity
                              ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOne(asset._id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(asset._id)}
                    className="w-4 h-4 rounded accent-brand-teal cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Hover overlay — Copy URL + Delete */}
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity flex flex-col items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigator.clipboard.writeText(asset.url)}
                    className="text-white text-xs bg-brand-teal hover:bg-brand-teal/80
                               px-2 py-1 rounded w-20 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => deleteSingle(asset._id)}
                    disabled={deleting}
                    className="text-white text-xs bg-red-500 hover:bg-red-600
                               disabled:opacity-50 px-2 py-1 rounded w-20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
