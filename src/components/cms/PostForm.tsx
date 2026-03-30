'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SlugField from './SlugField';
import PublishToggle from './PublishToggle';
import TagSelector from './TagSelector';
import RichTextEditor from './RichTextEditor';
import MediaPicker from './MediaPicker';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

interface PostData {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  tags: string[];
  isPublished: boolean;
}

interface Props {
  post?: PostData;
  tags: TagType[];
}

export default function PostForm({ post, tags }: Props) {
  const router = useRouter();
  const isEdit = !!post?._id;

  const [form, setForm] = useState<PostData>({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    category: post?.category ?? 'blog',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    coverImageUrl: post?.coverImageUrl ?? '',
    tags: post?.tags ?? [],
    isPublished: post?.isPublished ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        isEdit ? `/api/posts/${post!._id}` : '/api/posts',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Save failed');
      router.push('/cms/posts');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await fetch(`/api/posts/${post!._id}`, { method: 'DELETE' });
    router.push('/cms/posts');
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

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        >
          <option value="blog">Blog</option>
          <option value="devotional">Devotional</option>
          <option value="story">Story</option>
        </select>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Excerpt
        </label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Body */}
      <RichTextEditor
        value={form.body}
        onChange={(body: string) => setForm((f) => ({ ...f, body }))}
      />

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
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Post'}
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
