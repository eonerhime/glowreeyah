import SongPlayer from '@/components/music/SongPlayer';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Song from '@/models/Song';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ albumSlug: string; songSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug, songSlug } = await params;
  await connectDB();
  const song = await Song.findOne({ slug: songSlug }).lean();
  if (!song) return {};
  return {
    title: song.seo?.metaTitle || song.title,
    description: song.seo?.metaDescription || song.description,
    openGraph: {
      title: song.seo?.metaTitle || song.title,
      description: song.seo?.metaDescription || song.description,
      images: song.coverImageUrl ? [{ url: song.coverImageUrl }] : [],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title: song.seo?.metaTitle || song.title,
      description: song.seo?.metaDescription || song.description,
      images: song.coverImageUrl ? [song.coverImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${albumSlug}/${songSlug}`,
    },
  };
}

export default async function SongPage({ params }: Props) {
  const { albumSlug, songSlug } = await params;
  await connectDB();

  // const album = song.albumId as unknown as IAlbum;
  const album = (await Album.findOne({ slug: albumSlug }).lean()) as {
    _id: { toString(): string };
    title: string;
    slug: string;
    releaseYear: number;
    description?: string;
    coverImageUrl?: string;
  } | null;

  const rawSongs = await Song.find({ albumId: album?._id, isPublished: true })
    .sort({ trackNumber: 1 })
    .lean();

  const songs = rawSongs.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    slug: s.slug,
    trackNumber: s.trackNumber,
    description: s.description,
    audioUrl: s.audioUrl,
    coverImageUrl: s.coverImageUrl,
  }));

  const currentIndex = songs.findIndex((s) => s.slug === songSlug);
  const song = await Song.findOne({ slug: songSlug })
    .populate('albumId')
    .populate('tags')
    .lean();

  if (!song) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Glowreeyah',
    },
    ...(album && {
      inAlbum: {
        '@type': 'MusicAlbum',
        name: album.title,
      },
    }),
    ...(song.audioUrl && { contentUrl: song.audioUrl }),
    ...(song.description && { description: song.description }),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${albumSlug}/${songSlug}`,
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — album cover full width */}
      <div className="relative w-full h-64 md:h-80 bg-brand-deep">
        {(song.coverImageUrl || album?.coverImageUrl) && (
          <Image
            src={song.coverImageUrl || album?.coverImageUrl}
            alt={song.title}
            fill
            quality={80}
            className="object-cover object-top opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-brand-deep via-brand-deep/60 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-6">
          <Link
            href={`/music/${albumSlug}`}
            className="text-white/60 text-xs hover:text-white transition-colors"
          >
            ← Back to {album?.title ?? 'Album'}
          </Link>
        </div>

        {/* Track info overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-3xl mx-auto flex items-end gap-4">
            {album?.coverImageUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-lg">
                <Image
                  src={album.coverImageUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {song.trackNumber && (
                <p className="text-white/50 text-xs mb-1">
                  Track {song.trackNumber}
                </p>
              )}
              <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
                {song.title}
              </h1>
              {album && (
                <Link
                  href={`/music/${albumSlug}`}
                  className="text-brand-teal text-sm hover:underline mt-1 inline-block"
                >
                  {album.title}
                  {album.releaseYear && (
                    <span className="text-white/40 ml-2">
                      · {album.releaseYear}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-10 pb-24">
        {/* Audio player */}
        {song.audioUrl && (
          <SongPlayer
            audioUrl={song.audioUrl}
            title={song.title}
            albumSlug={albumSlug}
            songs={songs}
            currentIndex={currentIndex}
          />
        )}
        {/* Description */}
        {song.description && (
          <p className="text-gray-600 leading-relaxed mt-8 mb-2">
            {song.description}
          </p>
        )}

        {/* Story behind the song */}
        {song.storyBehindSong && (
          <section className="mt-8 p-6 bg-white rounded-xl border border-gray-100">
            <h2 className="font-serif text-xl text-brand-deep mb-3">
              The Story Behind the Song
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {song.storyBehindSong}
            </p>
          </section>
        )}

        {/* Lyrics */}
        {song.lyrics && (
          <section className="mt-8">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">Lyrics</h2>
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-sm bg-white p-6 rounded-xl border border-gray-100">
              {song.lyrics}
            </pre>
          </section>
        )}

        {/* Album details footer */}
        {album && (
          <div className="mt-12 pt-6 border-t border-gray-200 flex items-center gap-4">
            {album.coverImageUrl && (
              <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                <Image
                  src={album.coverImageUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">From the album</p>
              <Link
                href={`/music/${albumSlug}`}
                className="text-sm font-medium text-brand-deep hover:text-brand-teal transition-colors"
              >
                {album.title}
              </Link>
              {album.releaseYear && (
                <span className="text-xs text-gray-400 ml-2">
                  · {album.releaseYear}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
