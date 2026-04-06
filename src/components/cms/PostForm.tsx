'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import slugify from 'slugify';
import MediaPicker from './MediaPicker';
import PublishToggle from './PublishToggle';
import RichTextEditor from './RichTextEditor';
import TagSelector from './TagSelector';

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

function generateExcerpt(body: string, maxLength = 300): string {
  return body
    .replace(/#{1,6}\s+/g, '') // headings
    .replace(/\*\*?(.*?)\*\*?/g, '$1') // bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // code
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export default function PostForm({ post, tags }: Props) {
  const router = useRouter();
  const isEdit = !!post?._id;

  const [form, setForm] = useState<PostData>({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    category: post?.category ?? 'blog',
    excerpt: post?.excerpt || generateExcerpt(post?.body ?? ''),
    body: post?.body ?? '',
    coverImageUrl: post?.coverImageUrl ?? '',
    tags: post?.tags ?? [],
    isPublished: post?.isPublished ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!form.coverImageUrl) {
      setError('A cover image is required before saving.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const url = isEdit ? `/api/posts/${post!._id}` : '/api/posts';
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

      router.push('/cms/posts');
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      console.error('Post save error:', e);
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
          <span className="ml-2 text-xs font-normal text-gray-400">
            Auto-generated from body — edit to override
          </span>
        </label>
        <textarea
          rows={2}
          disabled
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Body */}
      <RichTextEditor
        value={form.body}
        onChange={(body: string) =>
          setForm((f) => ({
            ...f,
            body,
            excerpt:
              f.excerpt && f.excerpt !== generateExcerpt(f.body)
                ? f.excerpt // user has manually overridden — keep it
                : generateExcerpt(body), // still auto — update it
          }))
        }
      />

      {/* Cover Image */}
      <div>
        <MediaPicker
          value={form.coverImageUrl}
          onChange={(url: string) =>
            setForm((f) => ({ ...f, coverImageUrl: url }))
          }
        />
        {!form.coverImageUrl && (
          <p className="text-amber-600 text-xs mt-1">
            A cover image is required to publish this post.
          </p>
        )}
      </div>

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
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
        <button
          onClick={() => router.push('/cms/posts')}
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
