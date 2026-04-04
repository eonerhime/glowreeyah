'use client';

interface Props {
  label: string;
  value: string;
  maxLength: number;
  rows?: number;
  onChange: (v: string) => void;
}

export default function CharCountInput({
  label,
  value,
  maxLength,
  rows,
  onChange,
}: Props) {
  const remaining = maxLength - value.length;
  const isOver = remaining < 0;
  const isWarning = remaining >= 0 && remaining <= 20;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span
          className={`text-xs font-mono tabular-nums
            ${isOver ? 'text-red-500 font-semibold' : ''}
            ${isWarning ? 'text-amber-500' : ''}
            ${!isOver && !isWarning ? 'text-gray-400' : ''}
          `}
        >
          {remaining < 0 ? remaining : `${remaining} left`}
        </span>
      </div>

      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-colors
            ${
              isOver
                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                : 'border-gray-300 focus:ring-brand-teal'
            }`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none transition-colors
            ${
              isOver
                ? 'border-red-400 focus:ring-red-300 bg-red-50'
                : 'border-gray-300 focus:ring-brand-teal'
            }`}
        />
      )}
    </div>
  );
}
