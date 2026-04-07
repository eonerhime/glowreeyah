import CMSPageHeader from '@/components/cms/CMSPageHeader';
import EventForm from '@/components/cms/EventForm';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) notFound();

  const serialisedEvent = {
    _id: event._id.toString(),
    title: event.title,
    slug: event.slug,
    date: new Date(event.date).toISOString().split('T')[0],
    location: event.location,
    description: event.description ?? '',
    externalLink: event.externalLink ?? '',
    coverImageUrl: event.coverImageUrl ?? '',
    isUpcoming: event.isUpcoming,
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-6">
        <CMSPageHeader
          title="Edit Event"
          createHref="/cms/events/new"
          createLabel="New Event"
          backHref="/cms/events"
          backLabel="Back"
        />
      </div>

      <div className="mt-6">
        <EventForm event={serialisedEvent} />
      </div>
    </div>
  );
}
