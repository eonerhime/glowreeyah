'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Initiative {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
}

export default function InitiativeCard({ item }: { item: Initiative }) {
  return (
    <Link
      href={`/impact/${item.slug}`}
      className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group w-full block"
    >
      {item.coverImageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            width={600}
            height={192}
            quality={75}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="font-serif text-xl text-brand-deep mb-2">
          {item.title}
        </h2>
        {item.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}
        <span className="inline-block mt-3 text-xs text-brand-teal font-medium">
          Read more →
        </span>
      </div>
    </Link>
  );
}
