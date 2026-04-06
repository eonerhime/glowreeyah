'use client';

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
}

export default function SongCard({ song, onPlay, nowPlaying }: Props) {
  const isPlaying = nowPlaying === song._id;

  return (
    <div
      className={`flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm transition-colors
        ${isPlaying ? 'border-brand-teal bg-brand-teal/5' : 'border-gray-100 hover:border-brand-teal'}`}
    >
      {song.trackNumber && (
        <span className="text-brand-teal font-serif text-lg w-6 text-center shrink-0">
          {song.trackNumber}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-brand-deep truncate">{song.title}</p>
        {song.description && (
          <p className="text-sm text-gray-400 truncate mt-0.5">
            {song.description}
          </p>
        )}
      </div>
      {song.audioUrl && (
        <button
          onClick={() => onPlay(song)}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
            ${
              isPlaying
                ? 'bg-brand-teal text-white'
                : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white'
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
