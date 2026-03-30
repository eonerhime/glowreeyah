'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlugField from './SlugField';
import PublishToggle from './PublishToggle';
import MediaPicker from './MediaPicker';

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
      const res = await fetch(
        isEdit ? `/api/events/${event!._id}` : '/api/events',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Save failed');
      router.push('/cms/events');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
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
      <SlugField
        sourceValue={form.title}
        value={form.slug}
        onChange={(slug: string) => setForm((f) => ({ ...f, slug }))}
      />

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
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
      <PublishToggle
        value={form.isUpcoming}
        onChange={(val: boolean) => setForm((f) => ({ ...f, isUpcoming: val }))}
      />
      <p className="text-xs text-gray-400 -mt-4">
        Toggle off when the event has passed.
      </p>

      {/* Actions */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Event'}
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
