import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import Tag from '@/models/Tag';
import InitiativeForm from '@/components/cms/InitiativeForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

interface Props {
  params: { id: string };
}

export default async function EditInitiativePage({ params }: Props) {
  await connectDB();

  const [initiative, tags] = await Promise.all([
    Initiative.findById(params.id).lean(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);

  if (!initiative) notFound();

  const serialisedInitiative = {
    _id: initiative._id.toString(),
    title: initiative.title,
    slug: initiative.slug,
    description: initiative.description ?? '',
    body: initiative.body ?? '',
    coverImageUrl: initiative.coverImageUrl ?? '',
    externalLink: initiative.externalLink ?? '',
    tags: initiative.tags.map((t: mongoose.Types.ObjectId) => t.toString()),
  };

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  return (
    <div>
      <CMSPageHeader
        title="Edit Initiative"
        createHref="/cms/initiatives/new"
        createLabel="New Initiative"
      />
      <div className="mt-6">
        <InitiativeForm
          initiative={serialisedInitiative}
          tags={serialisedTags}
        />
      </div>
    </div>
  );
}
