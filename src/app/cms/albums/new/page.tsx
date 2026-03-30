import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import AlbumForm from '@/components/cms/AlbumForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

export default async function NewAlbumPage() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  return (
    <div>
      <CMSPageHeader
        title="New Album"
        createHref="/cms/albums"
        createLabel="Back to Albums"
      />
      <div className="mt-6">
        <AlbumForm tags={serialisedTags} />
      </div>
    </div>
  );
}
