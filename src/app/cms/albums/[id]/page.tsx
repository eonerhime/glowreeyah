import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Tag from '@/models/Tag';
import AlbumForm from '@/components/cms/AlbumForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const [album, tags] = await Promise.all([
    Album.findById(id).lean(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);

  if (!album) notFound();

  const serialisedAlbum = {
    _id: album._id.toString(),
    title: album.title,
    slug: album.slug,
    releaseYear: album.releaseYear,
    coverImageUrl: album.coverImageUrl ?? '',
    description: album.description ?? '',
    tags: album.tags.map((t: mongoose.Types.ObjectId) => t.toString()),
  };

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  return (
    <div>
      <CMSPageHeader
        title="Edit Album"
        createHref="/cms/albums/new"
        createLabel="New Album"
        backHref="/cms/albums"
        backLabel="Back"
      />
      <div className="mt-6">
        <AlbumForm album={serialisedAlbum} tags={serialisedTags} />
      </div>
    </div>
  );
}
