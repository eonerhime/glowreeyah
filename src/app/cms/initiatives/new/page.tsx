import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import InitiativeForm from '@/components/cms/InitiativeForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

export default async function NewInitiativePage() {
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
        title="New Initiative"
        createHref="/cms/initiatives"
        createLabel="Back to Initiatives"
      />
      <div className="mt-6">
        <InitiativeForm tags={serialisedTags} />
      </div>
    </div>
  );
}
