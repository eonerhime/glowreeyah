'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublishToggle from './PublishToggle';
import TagSelector from './TagSelector';
import MediaPicker from './MediaPicker';
import slugify from 'slugify';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

interface AlbumType {
  _id: string;
  title: string;
}

interface SongData {
  _id?: string;
  title: string;
  slug: string;
  albumId: string;
  trackNumber: number | '';
  description: string;
  lyrics: string;
  storyBehindSong: string;
  audioUrl: string;
  videoUrl: string;
  coverImageUrl: string;
  tags: string[];
  isPublished: boolean;
}

interface Props {
  song?:           SongData
  tags:            TagType[]
  albums:          AlbumType[]
  nextTrackNumber?: number
}

export default function SongForm({ song, tags, albums, nextTrackNumber }: Props) {
  const router = useRouter();
  const isEdit = !!song?._id;

  const [form, setForm] = useState<SongData>({
    title:           song?.title           ?? '',
    slug:            song?.slug            ?? '',
    albumId:         song?.albumId         ?? '',
    trackNumber:     song?.trackNumber     ?? nextTrackNumber ?? 1,
    description:     song?.description     ?? '',
    lyrics:          song?.lyrics          ?? '',
    storyBehindSong: song?.storyBehindSong ?? '',
    audioUrl:        song?.audioUrl        ?? '',
    videoUrl:        song?.videoUrl        ?? '',
    coverImageUrl:   song?.coverImageUrl   ?? '',
    tags:            song?.tags            ?? [],
    isPublished:     song?.isPublished     ?? true,
  })
  const [manualTrack, setManualTrack] = useState(false)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

 async function handleSubmit() {
  setSaving(true)
  setError('')
  try {
    const url    = isEdit ? `/api/songs/${song!._id}` : '/api/songs'
    const method = isEdit ? 'PATCH' : 'POST'

    console.log('Saving song — method:', method, 'url:', url)
    console.log('Payload:', {
      ...form,
      slug: slugify(form.title, { lower: true, strict: true }),
    })

    const res  = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        ...form,
        slug: slugify(form.title, { lower: true, strict: true }),
      }),
    })

    const data = await res.json()
    console.log('Response:', res.status, data)

    if (!res.ok) {
      const message = data?.error
        ? typeof data.error === 'object'
          ? Object.entries(data.error)
              .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
              .join(' | ')
          : data.error
        : `HTTP ${res.status} — ${res.statusText}`
      throw new Error(message)
    }

    router.push('/cms/songs')
    router.refresh()
  } catch (e: unknown) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
    console.error('Song save error:', e)
  } finally {
    setSaving(false)
  }
}

  async function handleDelete() {
    if (!confirm('Delete this song? This cannot be undone.')) return;
    await fetch(`/api/songs/${song!._id}`, { method: 'DELETE' });
    router.push('/cms/songs');
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

      {/* Album */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Album
        </label>
        <select
          value={form.albumId}
          onChange={(e) => setForm((f) => ({ ...f, albumId: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        >
          <option value="">Select an album</option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      {/* Track Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Track Number
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={form.trackNumber}
            disabled={!manualTrack && !isEdit}
            onChange={e => setForm(f => ({
              ...f,
              trackNumber: e.target.value ? Number(e.target.value) : ''
            }))}
            className={`w-32 border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-colors
              ${!manualTrack && !isEdit
                ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'border-gray-300 focus:ring-brand-teal'
              }`}
          />
          {!isEdit && (
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={manualTrack}
                onChange={e => setManualTrack(e.target.checked)}
                className="rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
              />
              Override auto-number
            </label>
          )}
        </div>
        {!manualTrack && !isEdit && (
          <p className="text-xs text-gray-400 mt-1">
            Auto-set to track {form.trackNumber} — check override to change
          </p>
        )}
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

      {/* Audio URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audio URL
        </label>
        <input
          type="url"
          value={form.audioUrl}
          onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video URL
        </label>
        <input
          type="url"
          value={form.videoUrl}
          onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Story Behind the Song */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Story Behind the Song
        </label>
        <textarea
          rows={4}
          value={form.storyBehindSong}
          onChange={(e) =>
            setForm((f) => ({ ...f, storyBehindSong: e.target.value }))
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Lyrics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lyrics
        </label>
        <textarea
          rows={8}
          value={form.lyrics}
          onChange={(e) => setForm((f) => ({ ...f, lyrics: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-teal outline-none"
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

      {/* Publish */}
      <PublishToggle
        value={form.isPublished}
        onChange={(val: boolean) =>
          setForm((f) => ({ ...f, isPublished: val }))
        }
      />

      {/* Actions */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          {(() => {
            try {
              const parsed = JSON.parse(error)
              return Object.entries(parsed).map(([field, messages]) => (
                <p key={field} className="text-red-600 text-sm">
                  {(messages as string[]).join(', ')}
                </p>
              ))
            } catch {
              return <p className="text-red-600 text-sm">{error}</p>
            }
          })()}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Song'}
        </button>
        <button
          onClick={() => router.push('/cms/songs')}
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
