'use client';
import { useState, useEffect } from 'react';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

export default function CMSTagsPage() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/tags')
      .then((r) => r.json())
      .then((d) => setTags(d.data ?? []));
  }, []);

  async function handleCreate() {
    if (!name.trim()) return setError('Name is required.');
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to create tag');
      const data = await res.json();
      setTags((prev) => [...prev, data.data]);
      setName('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this tag?')) return;
    await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    setTags((prev) => prev.filter((t) => t._id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Tags
      </h1>

      {/* Create */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Add New Tag</h2>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={saving}
            className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Adding...' : 'Add Tag'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* List */}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag._id}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm"
          >
            <span className="text-brand-deep">{tag.name}</span>
            <button
              onClick={() => handleDelete(tag._id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-gray-400 text-sm">No tags yet.</p>
        )}
      </div>
    </div>
  );
}
