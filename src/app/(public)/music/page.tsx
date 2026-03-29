import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import AlbumCard, { type AlbumType } from '@/components/music/AlbumCard';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Music',
  description: 'Browse all albums and songs by Glowreeyah.',
};

export default async function MusicPage() {
  await connectDB();
  const albums = await Album.find()
    .populate('tags', 'name slug')
    .sort({ releaseYear: -1 })
    .lean();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-10">Music</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album: AlbumType) => (
          <AlbumCard key={album._id.toString()} album={album} />
        ))}
      </div>
    </PageWrapper>
  );
}
