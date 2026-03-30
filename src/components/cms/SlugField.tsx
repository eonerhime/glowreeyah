'use client';
import { useEffect } from 'react';
import slugify from 'slugify';

interface Props {
  sourceValue: string;
  value: string;
  onChange: (slug: string) => void;
}

export default function SlugField({ sourceValue, value, onChange }: Props) {
  useEffect(() => {
    if (!value) {
      onChange(slugify(sourceValue, { lower: true, strict: true }));
    }
  }, [sourceValue, onChange, value]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Slug
      </label>
      <input
        value={value}
        onChange={(e) =>
          onChange(slugify(e.target.value, { lower: true, strict: true }))
        }
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-teal outline-none"
      />
      <p className="text-xs text-gray-400 mt-1">URL: /{value}</p>
    </div>
  );
}
