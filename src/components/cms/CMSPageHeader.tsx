import Link from 'next/link';

interface Props {
  title: string;
  createHref: string;
  createLabel: string;
}

export default function CMSPageHeader({
  title,
  createHref,
  createLabel,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-serif font-bold text-brand-deep">{title}</h1>
      <Link
        href={createHref}
        className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
      >
        + {createLabel}
      </Link>
    </div>
  );
}
