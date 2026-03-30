'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlugField from './SlugField';
import TagSelector from './TagSelector';
import MediaPicker from './MediaPicker';

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
      const res = await fetch(
        isEdit ? `/api/albums/${album!._id}` : '/api/albums',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Save failed');
      router.push('/cms/albums');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
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
      <SlugField
        sourceValue={form.title}
        value={form.slug}
        onChange={(slug: string) => setForm((f) => ({ ...f, slug }))}
      />

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
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Album'}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
