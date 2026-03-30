'use client';

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
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
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
        {allTags.length === 0 && (
          <p className="text-xs text-gray-400">
            No tags yet. Create tags in the Tags section.
          </p>
        )}
      </div>
    </div>
  );
}
