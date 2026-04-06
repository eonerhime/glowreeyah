'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TagSelector from './TagSelector';
import RichTextEditor from './RichTextEditor';
import MediaPicker from './MediaPicker';
import slugify from 'slugify';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

interface InitiativeData {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  coverImageUrl: string;
  externalLink: string;
  tags: string[];
}

interface Props {
  initiative?: InitiativeData;
  tags: TagType[];
}

export default function InitiativeForm({ initiative, tags }: Props) {
  const router = useRouter();
  const isEdit = !!initiative?._id;

  const [form, setForm] = useState<InitiativeData>({
    title: initiative?.title ?? '',
    slug: initiative?.slug ?? '',
    description: initiative?.description ?? '',
    body: initiative?.body ?? '',
    coverImageUrl: initiative?.coverImageUrl ?? '',
    externalLink: initiative?.externalLink ?? '',
    tags: initiative?.tags ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const url = isEdit
        ? `/api/initiatives/${initiative!._id}`
        : '/api/initiatives';
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

      router.push('/cms/initiatives');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      console.error('Initiative save error:', e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this initiative? This cannot be undone.')) return;
    await fetch(`/api/initiatives/${initiative!._id}`, { method: 'DELETE' });
    router.push('/cms/initiatives');
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

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Body */}
      <RichTextEditor
        value={form.body}
        onChange={(body: string) => setForm((f) => ({ ...f, body }))}
      />

      {/* External Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          External Link
        </label>
        <input
          type="url"
          value={form.externalLink}
          onChange={(e) =>
            setForm((f) => ({ ...f, externalLink: e.target.value }))
          }
          placeholder="https://..."
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
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Initiative'}
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
