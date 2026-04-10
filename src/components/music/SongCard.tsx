'use client';

import Link from 'next/link';

export interface SongType {
  _id: string;
  title: string;
  slug: string;
  trackNumber?: number;
  description?: string;
  audioUrl?: string;
  coverImageUrl?: string;
}

interface Props {
  song: SongType;
  onPlay: (song: SongType) => void;
  nowPlaying: string | null;
  albumSlug: string;
}

export default function SongCard({
  song,
  onPlay,
  nowPlaying,
  albumSlug,
}: Props) {
  const isPlaying = nowPlaying === song._id;

  return (
    <div
      onClick={() => song.audioUrl && onPlay(song)}
      className={`flex items-center gap-4 p-4  bg-brand-deep rounded-xl border shadow-sm transition-colors cursor-pointer
        ${isPlaying ? 'border-brand-teal' : 'border-gray-100 hover:border-brand-teal'}`}
    >
      {song.trackNumber && (
        <span className="text-brand-teal font-serif text-lg w-6 text-center shrink-0">
          {song.trackNumber}
        </span>
      )}

      <div className="flex-1 min-w-0">
        <Link
          href={`/music/${albumSlug}/${song.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-brand-warm truncate hover:text-brand-teal transition-colors block"
        >
          {song.title}
        </Link>
        {song.description && (
          <p className="text-sm text-gray-400 truncate mt-0.5">
            {song.description}
          </p>
        )}
      </div>

      {song.audioUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(song);
          }}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
            ${
              isPlaying
                ? 'bg-brand-teal text-white'
                : 'bg-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-white'
            }`}
          aria-label={
            isPlaying ? `Now playing ${song.title}` : `Play ${song.title}`
          }
        >
          {isPlaying ? '■' : '▶'}
        </button>
      )}
    </div>
  );
}
