import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Song from '@/models/Song';
import SongCard, { type SongType } from '@/components/music/SongCard';
import PageWrapper from '@/components/layout/PageWrapper';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: { albumSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const album = await Album.findOne({ slug: params.albumSlug }).lean();
  if (!album) return {};
  return {
    title: album.seo?.metaTitle || album.title,
    description: album.seo?.metaDescription || album.description,
    openGraph: {
      title: album.seo?.metaTitle || album.title,
      description: album.seo?.metaDescription || album.description,
      images: album.coverImageUrl ? [{ url: album.coverImageUrl }] : [],
      type: 'music.album',
    },
    twitter: {
      card: 'summary_large_image',
      title: album.seo?.metaTitle || album.title,
      description: album.seo?.metaDescription || album.description,
      images: album.coverImageUrl ? [album.coverImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${params.albumSlug}`,
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  await connectDB();
  const album = await Album.findOne({ slug: params.albumSlug }).lean();
  if (!album) notFound();

  const songs = await Song.find({ albumId: album._id, isPublished: true })
    .sort({ trackNumber: 1 })
    .lean();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-2">
        {album.title}
      </h1>
      <p className="text-gray-500 mb-10">{album.releaseYear}</p>
      <div className="space-y-4">
        {songs.map((song: SongType) => (
          <SongCard
            key={song._id.toString()}
            song={song}
            albumSlug={params.albumSlug}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
