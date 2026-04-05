import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Initiative from '@/models/Initiative';
import GalleryManager from '@/components/cms/GalleryManager';
import type { Types } from 'mongoose';

interface LeanEvent {
  _id: Types.ObjectId;
  title: string;
}

interface LeanInitiative {
  _id: Types.ObjectId;
  title: string;
}

export default async function CMSGalleryPage() {
  await connectDB();

  const [events, initiatives] = await Promise.all([
    Event.find().sort({ date: -1 }).lean() as Promise<LeanEvent[]>,
    Initiative.find().sort({ title: 1 }).lean() as Promise<LeanInitiative[]>,
  ]);

  const serialisedEvents = events.map((e) => ({
    _id: e._id.toString(),
    title: e.title,
  }));

  const serialisedInitiatives = initiatives.map((i) => ({
    _id: i._id.toString(),
    title: i.title,
  }));

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Gallery
      </h1>
      <GalleryManager
        events={serialisedEvents}
        initiatives={serialisedInitiatives}
      />
    </div>
  );
}
