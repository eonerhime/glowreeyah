'use client';
import { useState } from 'react';
import Image from 'next/image';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  externalLink?: string;
  coverImageUrl?: string;
  isUpcoming: boolean;
}

export default function EventCard({ event }: { event: Event }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Always-visible summary */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-lg text-brand-deep leading-snug">
              {event.title}
            </h3>
            <p className="text-sm text-brand-teal mt-0.5">
              {new Date(event.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
          </div>
          <span className="text-gray-400 text-sm shrink-0 mt-1">
            {open ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
          {event.coverImageUrl && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image
                src={event.coverImageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          {event.description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {event.description}
            </p>
          )}
          {event.externalLink && (
            <a
              href={event.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-teal text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-brand-teal/90 transition-colors"
            >
              More info →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
