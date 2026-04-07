'use client';
// src/components/cms/EventForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlugField from './SlugField';
import MediaPicker from './MediaPicker';

interface EventData {
  _id?: string;
  title?: string;
  slug?: string;
  date?: string;
  location?: string;
  description?: string;
  externalLink?: string;
  isUpcoming?: boolean;
  coverImageUrl?: string;
}

interface Props {
  event?: EventData;
}

// ── module-level helpers ───────────────────────────────────────
function deriveIsUpcoming(dateStr: string): boolean {
  if (!dateStr) return true;
  return new Date(dateStr) >= new Date();
}

function isPastEvent(event?: EventData): boolean {
  if (!event?._id) return false; // new events are always editable
  if (event.isUpcoming === false) return true;
  // fallback: check the date directly in case isUpcoming is stale
  if (event.date) return new Date(event.date) < new Date();
  return false;
}

// ─────────────────────────────────────────────────────────────
export default function EventForm({ event }: Props) {
  const router = useRouter();
  const isEdit = !!event?._id;
  const isPast = isPastEvent(event); // ← lock flag

  const [form, setForm] = useState({
    title: event?.title ?? '',
    slug: event?.slug ?? '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event?.location ?? '',
    description: event?.description ?? '',
    externalLink: event?.externalLink ?? '',
    isUpcoming: event?.isUpcoming ?? true,
    coverImageUrl: event?.coverImageUrl ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleDateChange(dateStr: string) {
    setForm((f) => ({
      ...f,
      date: dateStr,
      isUpcoming: deriveIsUpcoming(dateStr),
    }));
  }

  async function handleSubmit() {
    if (isPast) return;
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
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
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

  // shared input class — greyed out when past
  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm outline-none
    ${
      isPast
        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
        : 'border-gray-300 bg-white focus:ring-2 focus:ring-brand-teal'
    }`;

  return (
    <div className="max-w-2xl space-y-6">
      {/* ── Past-event notice banner ── */}
      {isPast && (
        <div
          className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700
                        text-sm px-4 py-3 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          This event has already taken place and cannot be edited.
        </div>
      )}

      {/* ── Title ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          value={form.title}
          onChange={(e) =>
            !isPast && setForm((f) => ({ ...f, title: e.target.value }))
          }
          readOnly={isPast}
          className={inputCls}
        />
      </div>

      {/* ── Slug ── */}
      {isPast ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input value={form.slug} readOnly className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">/{form.slug}</p>
        </div>
      ) : (
        <SlugField
          sourceValue={form.title}
          value={form.slug}
          onChange={(slug) => setForm((f) => ({ ...f, slug }))}
        />
      )}

      {/* ── Date ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => !isPast && handleDateChange(e.target.value)}
          readOnly={isPast}
          className={inputCls}
        />
      </div>

      {/* ── Location ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          value={form.location}
          onChange={(e) =>
            !isPast && setForm((f) => ({ ...f, location: e.target.value }))
          }
          readOnly={isPast}
          className={inputCls}
        />
      </div>

      {/* ── Description ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            !isPast && setForm((f) => ({ ...f, description: e.target.value }))
          }
          readOnly={isPast}
          className={inputCls}
        />
      </div>

      {/* ── External link ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          External Link
        </label>
        <input
          value={form.externalLink}
          onChange={(e) =>
            !isPast && setForm((f) => ({ ...f, externalLink: e.target.value }))
          }
          readOnly={isPast}
          className={inputCls}
        />
      </div>

      {/* ── Cover image ── */}
      {isPast ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <input value={form.coverImageUrl} readOnly className={inputCls} />
        </div>
      ) : (
        <MediaPicker
          value={form.coverImageUrl}
          onChange={(url) => setForm((f) => ({ ...f, coverImageUrl: url }))}
        />
      )}

      {/* ── Status pill ── */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
          }`}
        >
          {isPast ? 'Past event' : 'Upcoming'}
        </span>
      </div>

      {/* ── Actions ── */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        {/* Save button — disabled and muted for past events */}
        <button
          onClick={handleSubmit}
          disabled={isPast || saving}
          title={isPast ? 'Past events cannot be edited' : undefined}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              isPast
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-50'
            }`}
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Event'}
        </button>

        {/* Delete is still allowed on past events */}
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
