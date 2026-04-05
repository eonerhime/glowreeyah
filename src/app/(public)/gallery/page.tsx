import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import Initiative from '@/models/Initiative';
import GalleryPhoto from '@/models/GalleryPhoto';
import GalleryVideo from '@/models/GalleryVideo';
import GalleryTabs from '@/components/gallery/GalleryTabs';
import type { Metadata } from 'next';
import type { Types } from 'mongoose';

export const metadata: Metadata = {
  title: 'Gallery — Glowreeyah',
  description: 'Photos and videos from events and initiatives.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery` },
};

export const revalidate = 3600;

interface LeanEvent {
  _id: Types.ObjectId;
  title: string;
}

interface LeanInitiative {
  _id: Types.ObjectId;
  title: string;
}

export default async function GalleryPage() {
  await connectDB();

  const [events, initiatives] = await Promise.all([
    Event.find().sort({ date: -1 }).lean() as Promise<LeanEvent[]>,
    Initiative.find().sort({ title: 1 }).lean() as Promise<LeanInitiative[]>,
  ]);

  const eventGalleries = await Promise.all(
    events.map(async (ev) => ({
      id: ev._id.toString(),
      title: ev.title,
      photos: await GalleryPhoto.find({ linkedType: 'event', linkedId: ev._id })
        .sort({ order: 1 })
        .lean(),
      videos: await GalleryVideo.find({ linkedType: 'event', linkedId: ev._id })
        .sort({ createdAt: 1 })
        .lean(),
    }))
  );

  const initiativeGalleries = await Promise.all(
    initiatives.map(async (ini) => ({
      id: ini._id.toString(),
      title: ini.title,
      photos: await GalleryPhoto.find({
        linkedType: 'initiative',
        linkedId: ini._id,
      })
        .sort({ order: 1 })
        .lean(),
      videos: await GalleryVideo.find({
        linkedType: 'initiative',
        linkedId: ini._id,
      })
        .sort({ createdAt: 1 })
        .lean(),
    }))
  );

  const eventGalleriesWithContent = eventGalleries.filter(
    (g) => g.photos.length + g.videos.length > 0
  );
  const initiativeGalleriesWithContent = initiativeGalleries.filter(
    (g) => g.photos.length + g.videos.length > 0
  );

  // Serialise ObjectIds for client components
  const serialise = (galleries: typeof eventGalleries) =>
    galleries.map((g) => ({
      ...g,
      photos: g.photos.map((p) => ({
        ...p,
        _id: p._id.toString(),
        linkedId: p.linkedId.toString(),
      })),
      videos: g.videos.map((v) => ({
        ...v,
        _id: v._id.toString(),
        linkedId: v.linkedId.toString(),
      })),
    }));

  return (
    <div className="min-h-screen bg-brand-warm">
      <section className="bg-brand-deep text-white py-20 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
          Moments
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Gallery</h1>
        <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
          Photos and videos from music ministrations, events, and initiatives.
        </p>
      </section>

      <GalleryTabs
        eventGalleries={serialise(eventGalleriesWithContent)}
        initiativeGalleries={serialise(initiativeGalleriesWithContent)}
      />
    </div>
  );
}
