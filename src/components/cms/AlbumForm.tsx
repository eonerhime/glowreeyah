'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import slugify from 'slugify';
import MediaPicker from './MediaPicker';
import TagSelector from './TagSelector';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

interface AlbumData {
  _id?: string;
  title: string;
  slug: string;
  releaseYear: number | '';
  coverImageUrl: string;
  description: string;
  tags: string[];
}

interface Props {
  album?: AlbumData;
  tags: TagType[];
}

export default function AlbumForm({ album, tags }: Props) {
  const router = useRouter();
  const isEdit = !!album?._id;

  const [form, setForm] = useState<AlbumData>({
    title: album?.title ?? '',
    slug: album?.slug ?? '',
    releaseYear: album?.releaseYear ?? '',
    coverImageUrl: album?.coverImageUrl ?? '',
    description: album?.description ?? '',
    tags: album?.tags ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/albums/${album!._id}` : '/api/albums';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: slugify(form.title, { lower: true, strict: true }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error
          ? JSON.stringify(data.error)
          : `HTTP ${res.status} — ${res.statusText}`;
        throw new Error(message);
      }

      router.push('/cms/albums');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      console.error('Album save error:', e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this album? This cannot be undone.')) return;
    await fetch(`/api/albums/${album!._id}`, { method: 'DELETE' });
    router.push('/cms/albums');
    router.refresh();
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          value={slugify(form.title, { lower: true, strict: true })}
          disabled
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed font-mono"
        />
        <p className="text-xs text-gray-400 mt-1">
          Auto-generated from title — not editable
        </p>
      </div>

      {/* Release Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Release Year
        </label>
        <input
          type="number"
          min={1900}
          max={new Date().getFullYear()}
          value={form.releaseYear}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              releaseYear: e.target.value ? Number(e.target.value) : '',
            }))
          }
          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Cover Image */}
      <MediaPicker
        value={form.coverImageUrl}
        onChange={(url: string) =>
          setForm((f) => ({ ...f, coverImageUrl: url }))
        }
      />

      {/* Tags */}
      <TagSelector
        allTags={tags}
        selected={form.tags}
        onChange={(tags: string[]) => setForm((f) => ({ ...f, tags }))}
      />

      {/* Actions */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Album'}
        </button>
        <button
          onClick={() => router.push('/cms/albums')}
          disabled={saving}
          className="px-5 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="ml-auto text-red-500 text-sm hover:underline cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
