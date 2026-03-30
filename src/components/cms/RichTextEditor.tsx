'use client';
import dynamic from 'next/dynamic';
import type { MDEditorProps } from '@uiw/react-md-editor';

const MDEditor = dynamic<MDEditorProps>(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Body
      </label>
      <MDEditor
        value={value}
        onChange={(v: string | undefined) => onChange(v ?? '')}
        height={400}
      />
    </div>
  );
}
