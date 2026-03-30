import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { albumSlug: string; songSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB()
  const song = await Song.findOne({ slug: params.songSlug }).lean()
  if (!song) return {}
  return {
    title:       song.seo?.metaTitle       || song.title,
    description: song.seo?.metaDescription || song.description,
    openGraph: {
      title:       song.seo?.metaTitle       || song.title,
      description: song.seo?.metaDescription || song.description,
      images:      song.coverImageUrl ? [{ url: song.coverImageUrl }] : [],
      type:        'music.song',
    },
    twitter: {
      card:        'summary_large_image',
      title:       song.seo?.metaTitle       || song.title,
      description: song.seo?.metaDescription || song.description,
      images:      song.coverImageUrl ? [song.coverImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${params.albumSlug}/${params.songSlug}`,
    },
  }
}

export default async function SongPage({ params }: Props) {
  await connectDB();
  const song = await Song.findOne({ slug: params.songSlug })
    .populate('albumId')
    .populate('tags')
    .lean();

  if (!song) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
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
