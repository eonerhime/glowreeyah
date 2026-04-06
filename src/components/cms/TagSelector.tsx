'use client';
import { useState } from 'react';
import slugify from 'slugify';

interface TagType {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  allTags: TagType[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ allTags, selected, onChange }: Props) {
  const [tags, setTags] = useState<TagType[]>(allTags);
  const [input, setInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  async function handleCreate() {
    const name = input.trim();
    if (!name) return;

    // Prevent duplicates
    const exists = tags.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      // Just select it if it already exists
      if (!selected.includes(exists._id)) toggle(exists._id);
      setInput('');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug: slugify(name, { lower: true, strict: true }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed to create tag');

      const newTag: TagType = {
        _id: data.data._id,
        name: data.data.name,
        slug: data.data.slug,
      };
      setTags((prev) => [...prev, newTag]);
      onChange([...selected, newTag._id]);
      setInput('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setCreating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>

      {/* Existing tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <button
            key={tag._id}
            type="button"
            onClick={() => toggle(tag._id)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
              ${
                selected.includes(tag._id)
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-brand-teal'
              }`}
          >
            {tag.name}
          </button>
        ))}
        {tags.length === 0 && !input && (
          <p className="text-xs text-gray-400">
            No tags yet — type below to create one.
          </p>
        )}
      </div>

      {/* Inline create */}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New tag name…"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-teal outline-none w-48"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={!input.trim() || creating}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-teal text-white hover:bg-brand-teal/90 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {creating ? 'Adding…' : '+ Add'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
