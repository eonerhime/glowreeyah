'use client';
import { useState } from 'react';
import Image from 'next/image';
import GalleryGrid from './GalleryGrid';

interface Photo {
  _id: string;
  url: string;
  caption: string;
}

interface Video {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  platform: string;
}

interface GalleryItem {
  id: string;
  title: string;
  photos: Photo[];
  videos: Video[];
}

interface Props {
  eventGalleries: GalleryItem[];
  initiativeGalleries: GalleryItem[];
}

type Tab = 'events' | 'initiatives';

export default function GalleryTabs({
  eventGalleries,
  initiativeGalleries,
}: Props) {
  const [tab, setTab] = useState<Tab>('events');
  const [openGallery, setOpenGallery] = useState<string | null>(null);

  const galleries = tab === 'events' ? eventGalleries : initiativeGalleries;

  const tabClass = (t: Tab) =>
    `px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-brand-teal text-brand-teal'
        : 'border-transparent text-gray-500 hover:text-brand-deep'
    }`;

  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-10">
          <button
            className={tabClass('events')}
            onClick={() => {
              setTab('events');
              setOpenGallery(null);
            }}
          >
            Events
          </button>
          <button
            className={tabClass('initiatives')}
            onClick={() => {
              setTab('initiatives');
              setOpenGallery(null);
            }}
          >
            Initiatives
          </button>
        </div>

        {galleries.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No galleries yet.
          </p>
        )}

        {/* Gallery cards — closed state */}
        {openGallery === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((g) => (
              <button
                key={g.id}
                onClick={() => setOpenGallery(g.id)}
                className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {g.photos[0] ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={g.photos[0].url}
                      alt={g.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : g.videos[0] ? (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={g.videos[0].thumbnailUrl}
                      alt={g.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center">
                        ▶
                      </span>
                    </div>
                  </div>
                ) : null}
                <div className="p-4">
                  <h3 className="font-serif text-lg text-brand-deep">
                    {g.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {g.photos.length > 0 &&
                      `${g.photos.length} photo${g.photos.length !== 1 ? 's' : ''}`}
                    {g.photos.length > 0 && g.videos.length > 0 && ' · '}
                    {g.videos.length > 0 &&
                      `${g.videos.length} video${g.videos.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Open gallery */}
        {openGallery !== null &&
          (() => {
            const g = galleries.find((g) => g.id === openGallery)!;
            return (
              <div>
                <button
                  onClick={() => setOpenGallery(null)}
                  className="text-sm text-brand-teal hover:underline mb-6 flex items-center gap-1"
                >
                  ← Back to {tab}
                </button>
                <h2 className="font-serif text-3xl text-brand-deep mb-8">
                  {g.title}
                </h2>
                <GalleryGrid photos={g.photos} videos={g.videos} />
              </div>
            );
          })()}
      </div>
    </section>
  );
}
