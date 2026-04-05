'use client';
import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

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

interface Props {
  photos: Photo[];
  videos: Video[];
}

export default function GalleryGrid({ photos, videos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {photos.length === 0 && videos.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-10">No media yet.</p>
      )}

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {/* Photos */}
        {photos.map((photo, i) => (
          <button
            key={photo._id}
            onClick={() => setLightboxIndex(i)}
            className="block w-full rounded-lg overflow-hidden relative group break-inside-avoid"
          >
            <Image
              src={photo.url}
              alt={photo.caption || 'Gallery photo'}
              width={400}
              height={400}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {photo.caption && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}

        {/* Videos */}
        {videos.map((video) => (
          <a
            key={video._id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-lg overflow-hidden group break-inside-avoid"
          >
            {video.thumbnailUrl ? (
              <Image
                src={video.thumbnailUrl}
                alt={video.caption || 'Video'}
                width={400}
                height={225}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full aspect-video bg-brand-deep flex items-center justify-center">
                <span className="text-white/40 text-sm">Video</span>
              </div>
            )}
            {/* Play badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/60 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl group-hover:bg-brand-teal transition-colors">
                ▶
              </span>
            </div>
            {/* Video label */}
            <div className="absolute top-2 left-2">
              <span className="bg-black/70 text-white text-xs px-2 py-0.5 rounded-full uppercase tracking-wide">
                {video.platform}
              </span>
            </div>
            {video.caption && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs">{video.caption}</p>
              </div>
            )}
          </a>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(photos.length - 1, (i ?? 0) + 1))
          }
        />
      )}
    </>
  );
}
