import Link from 'next/link';

interface Props {
  title: string;
  createHref: string;
  createLabel: string;
  backHref?: string; // Optional prop for the back button
  backLabel?: string; // Optional label for the back button
}

export default function CMSPageHeader({
  title,
  createHref,
  createLabel,
  backHref,
  backLabel = 'Back',
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-4 mb-8">
      {/* Title Section */}
      <h1 className="text-2xl font-serif font-bold text-brand-deep">{title}</h1>

      {/* Button Group: Stays on one row even on mobile */}
      <div className="flex flex-row items-center gap-3">
        {/* Only renders if backHref is passed */}
        {backHref && (
          <Link
            href={backHref}
            className="bg-gray-100 text-brand-deep px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200 whitespace-nowrap"
          >
            &larr; {backLabel}
          </Link>
        )}

        <Link
          href={createHref}
          className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors whitespace-nowrap"
        >
          + {createLabel}
        </Link>
      </div>
    </div>
  );
}
