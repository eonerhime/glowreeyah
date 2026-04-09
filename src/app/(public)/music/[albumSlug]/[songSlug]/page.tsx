import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import type { IAlbum } from '@/models/Album';
import type { Metadata } from 'next';
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

  const song = await Song.findOne({ slug: songSlug })
    .populate('albumId')
    .populate('tags')
    .lean();

  if (!song) notFound();

  // albumId is already populated — no second query needed
  const album = song.albumId as unknown as IAlbum;

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
    description: song.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${albumSlug}/${songSlug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="font-serif text-4xl text-brand-deep mb-2">{song.title}</h1>
      {song.audioUrl && (
        <audio controls src={song.audioUrl} className="w-full my-6" />
      )}
      {song.lyrics && (
        <section>
          <h2 className="font-serif text-2xl mb-4">Lyrics</h2>
          <pre className="whitespace-pre-wrap font-sans">{song.lyrics}</pre>
        </section>
      )}
    </article>
  );
}
