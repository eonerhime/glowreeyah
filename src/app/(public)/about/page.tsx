import PageWrapper from '@/components/layout/PageWrapper';
import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const artist = await Artist.findOne().lean();
  if (!artist) return {};
  return {
    title: 'About',
    description: artist.biographyShort,
  };
}

export default async function AboutPage() {
  await connectDB();
  const artist = await Artist.findOne().lean();
  // if (!artist) notFound();

  if (!artist) {
    return (
      <PageWrapper>
        <h1 className="font-serif text-4xl text-brand-deep mb-6">About</h1>
        <p className="text-gray-500">Artist profile coming soon.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-6">
        {artist.name}
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        {artist.biographyLong}
      </p>
      {artist.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-2xl text-brand-deep mb-4">
            Achievements
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {artist.achievements.map((a: string, i: number) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      )}
      {artist.speakingProfile && (
        <section>
          <h2 className="font-serif text-2xl text-brand-deep mb-4">Speaking</h2>
          <p className="text-gray-700 leading-relaxed">
            {artist.speakingProfile}
          </p>
        </section>
      )}
    </PageWrapper>
  );
}
