interface Props {
  published: boolean;
}

export default function StatusBadge({ published }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${
          published
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}
