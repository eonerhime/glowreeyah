'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlugField from './SlugField';
import PublishToggle from './PublishToggle';
import TagSelector from './TagSelector';
import MediaPicker from './MediaPicker';

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
  song?: SongData;
  tags: TagType[];
  albums: AlbumType[];
}

export default function SongForm({ song, tags, albums }: Props) {
  const router = useRouter();
  const isEdit = !!song?._id;

  const [form, setForm] = useState<SongData>({
    title: song?.title ?? '',
    slug: song?.slug ?? '',
    albumId: song?.albumId ?? '',
    trackNumber: song?.trackNumber ?? '',
    description: song?.description ?? '',
    lyrics: song?.lyrics ?? '',
    storyBehindSong: song?.storyBehindSong ?? '',
    audioUrl: song?.audioUrl ?? '',
    videoUrl: song?.videoUrl ?? '',
    coverImageUrl: song?.coverImageUrl ?? '',
    tags: song?.tags ?? [],
    isPublished: song?.isPublished ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        isEdit ? `/api/songs/${song!._id}` : '/api/songs',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Save failed');
      router.push('/cms/songs');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
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
      <SlugField
        sourceValue={form.title}
        value={form.slug}
        onChange={(slug: string) => setForm((f) => ({ ...f, slug }))}
      />

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
        <input
          type="number"
          min={1}
          value={form.trackNumber}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              trackNumber: e.target.value ? Number(e.target.value) : '',
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Song'}
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
