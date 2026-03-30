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
  albumSlug: string;
}

export default function SongCard({ song, albumSlug }: Props) {
  return (
    <Link href={`/music/${albumSlug}/${song.slug}`}>
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-brand-teal transition-colors">
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
          <span className="text-xs text-brand-teal shrink-0">▶ Play</span>
        )}
      </div>
    </Link>
  );
}
