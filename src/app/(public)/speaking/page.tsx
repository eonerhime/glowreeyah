import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Speaking',
  description: 'Speaking engagements and upcoming events.',
};

interface EventType {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  externalLink?: string;
  isUpcoming: boolean;
  coverImageUrl?: string;
}

export default async function SpeakingPage() {
  await connectDB();

  const [upcoming, past] = await Promise.all([
    Event.find({ isUpcoming: true }).sort({ date: 1 }).lean(),
    Event.find({ isUpcoming: false }).sort({ date: -1 }).lean(),
  ]);

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-10">
        Speaking & Events
      </h1>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-brand-deep mb-6">Upcoming</h2>
          <div className="space-y-6">
            {upcoming.map((event: EventType) => (
              <div
                key={event._id.toString()}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              >
                <h3 className="font-serif text-xl text-brand-deep mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-brand-teal mb-1">
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-500 mb-3">{event.location}</p>
                {event.description && (
                  <p className="text-gray-700">{event.description}</p>
                )}
                {event.externalLink && (
                  <a
                    href={event.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-brand-teal hover:underline"
                  >
                    More info &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-brand-deep mb-6">
            Past Events
          </h2>
          <div className="space-y-4">
            {past.map((event: EventType) => (
              <div
                key={event._id.toString()}
                className="border-b border-gray-100 pb-4"
              >
                <h3 className="font-medium text-brand-deep">{event.title}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  &mdash; {event.location}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
