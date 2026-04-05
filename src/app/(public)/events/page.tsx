import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import EventCard from '@/components/content/EventCard';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import type { Types } from 'mongoose';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events featuring Glowreeyah.',
  openGraph: {
    title: 'Events — Glowreeyah',
    description: 'Upcoming and past events featuring Glowreeyah.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events — Glowreeyah',
    description: 'Upcoming and past events featuring Glowreeyah.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/events`,
  },
};

interface LeanEvent {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  location: string;
  description?: string;
  externalLink?: string;
  coverImageUrl?: string;
  isUpcoming: boolean;
}

export default async function EventsPage() {
  await connectDB();

  const headersList = await headers();
  const referer = headersList.get('referer') ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isFromHome = referer === siteUrl || referer === `${siteUrl}/`;
  const backHref = isFromHome ? '/#events' : null;

  const now = new Date();
  const events = (await Event.find().sort({ date: -1 }).lean()) as LeanEvent[];

  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events.filter((e) => new Date(e.date) < now);

  const serialise = (list: LeanEvent[]) =>
    list.map((e) => ({
      _id: e._id.toString(),
      title: e.title,
      date: e.date.toISOString(),
      location: e.location,
      description: e.description ?? '',
      externalLink: e.externalLink ?? '',
      coverImageUrl: e.coverImageUrl ?? '',
      isUpcoming: new Date(e.date) >= now,
    }));

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Header */}
      <section className="bg-brand-deep text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {backHref && (
            <Link
              href={backHref}
              className="text-white/50 text-xs hover:text-white transition-colors mb-6 inline-block"
            >
              ← Back to Home
            </Link>
          )}
          <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
            On the road
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Events</h1>
          <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
            Catch Glowreeyah live — worship nights, concerts, conferences, and
            more.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Upcoming */}
          <div>
            <h2 className="font-serif text-2xl text-brand-deep mb-6 flex items-center gap-2">
              Upcoming
              {upcoming.length > 0 && (
                <span className="bg-brand-teal text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {upcoming.length}
                </span>
              )}
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No upcoming events at the moment.
              </p>
            ) : (
              <div className="space-y-4">
                {serialise(upcoming).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          <div>
            <h2 className="font-serif text-2xl text-brand-deep mb-6">
              Past Events
            </h2>
            {past.length === 0 ? (
              <p className="text-gray-400 text-sm">No past events yet.</p>
            ) : (
              <div className="space-y-4">
                {serialise(past).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
