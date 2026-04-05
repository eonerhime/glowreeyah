'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from './MediaPicker';
import slugify from 'slugify';

function deriveIsUpcoming(dateStr: string): boolean {
  if (!dateStr) return true;
  return new Date(dateStr) >= new Date();
}

interface EventData {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  description: string;
  externalLink: string;
  coverImageUrl: string;
  isUpcoming: boolean;
}

interface Props {
  event?: EventData;
}

export default function EventForm({ event }: Props) {
  const router = useRouter();
  const isEdit = !!event?._id;

  const [form, setForm] = useState<EventData>({
    title: event?.title ?? '',
    slug: event?.slug ?? '',
    date: event?.date ?? '',
    location: event?.location ?? '',
    description: event?.description ?? '',
    externalLink: event?.externalLink ?? '',
    coverImageUrl: event?.coverImageUrl ?? '',
    isUpcoming: event?.isUpcoming ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/events/${event!._id}` : '/api/events';
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

      router.push('/cms/events');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      console.error('Event save error:', e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await fetch(`/api/events/${event!._id}`, { method: 'DELETE' });
    router.push('/cms/events');
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
      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              date: e.target.value,
              isUpcoming: deriveIsUpcoming(e.target.value),
            }))
          }
          className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>
      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
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

      {/* Is Upcoming */}
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            form.isUpcoming
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {form.isUpcoming ? 'Upcoming' : 'Past event'}
        </span>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, isUpcoming: !f.isUpcoming }))}
          className="text-xs text-brand-teal hover:underline"
        >
          Mark as {form.isUpcoming ? 'past' : 'upcoming'}
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Auto-set from the date — override manually if needed.
      </p>
      {/* Actions */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
        </button>
        <button
          onClick={() => router.push('/cms/events')}
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
