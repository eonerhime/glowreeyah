import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Album from '@/models/Album';
import SongForm from '@/components/cms/SongForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

export default async function NewSongPage() {
  await connectDB();

  const [tags, albums] = await Promise.all([
    Tag.find().sort({ name: 1 }).lean(),
    Album.find().sort({ title: 1 }).lean(),
  ]);

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  const serialisedAlbums = albums.map((a) => ({
    _id: a._id.toString(),
    title: a.title,
  }));

  return (
    <div>
      <CMSPageHeader
        title="New Song"
        createHref="/cms/songs"
        createLabel="Back to Songs"
      />
      <div className="mt-6">
        <SongForm tags={serialisedTags} albums={serialisedAlbums} />
      </div>
    </div>
  );
}
