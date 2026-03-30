'use client';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export default function PublishToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${value ? 'bg-brand-teal' : 'bg-gray-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${value ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className="text-sm text-gray-700">
        {value ? 'Published' : 'Draft'}
      </span>
    </div>
  );
}
