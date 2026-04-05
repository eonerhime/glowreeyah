import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import PageWrapper from '@/components/layout/PageWrapper';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const artist = await Artist.findOne().lean();
  return {
    title: 'About',
    description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
    openGraph: {
      title: 'About Glowreeyah',
      description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
      images: artist?.profileImageUrl ? [{ url: artist.profileImageUrl }] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Glowreeyah',
      description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
      images: artist?.profileImageUrl ? [artist.profileImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
  };
}

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export default async function AboutPage() {
  await connectDB();

  // Referer-based back link
  const headersList = await headers();
  const referer = headersList.get('referer') ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isFromHome = referer === siteUrl || referer === `${siteUrl}/`;
  const backHref = isFromHome ? '/#about' : null;

  const artist = await Artist.findOne().lean();

  if (!artist) {
    return (
      <PageWrapper>
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-brand-teal hover:underline mb-6 inline-block"
          >
            ← Back to Home
          </Link>
        )}
        <h1 className="font-serif text-4xl text-brand-deep mb-6">About</h1>
        <p className="text-gray-500">Artist profile coming soon.</p>
      </PageWrapper>
    );
  }

  const socialLinks: SocialLink[] = [
    {
      label: 'Instagram',
      href: artist.socialLinks?.instagram ?? '',
      icon: '📸',
    },
    { label: 'YouTube', href: artist.socialLinks?.youtube ?? '', icon: '▶️' },
    { label: 'Spotify', href: artist.socialLinks?.spotify ?? '', icon: '🎵' },
    { label: 'Twitter', href: artist.socialLinks?.twitter ?? '', icon: '🐦' },
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Hero */}
      {artist.profileImageUrl ? (
        <div className="bg-brand-deep text-white py-16 px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl overflow-hidden shrink-0 shadow-xl">
              <Image
                src={artist.profileImageUrl}
                alt={artist.name}
                fill
                className="object-cover object-center"
                priority
              />
            </div>
            <div>
              {backHref && (
                <Link
                  href={backHref}
                  className="text-white/50 text-xs hover:text-white transition-colors mb-4 inline-block"
                >
                  ← Back to Home
                </Link>
              )}
              <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
                About
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
                {artist.name}
              </h1>
              {artist.biographyShort && (
                <p className="text-white/70 text-sm leading-relaxed">
                  {artist.biographyShort}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-deep text-white py-20 px-6">
          <div className="max-w-4xl mx-auto">
            {backHref && (
              <Link
                href={backHref}
                className="text-white/60 text-xs hover:text-white transition-colors mb-4 inline-block"
              >
                ← Back to Home
              </Link>
            )}
            <h1 className="font-serif text-4xl md:text-5xl">{artist.name}</h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Short bio + socials */}
        <div className="mb-10">
          {artist.biographyShort && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {artist.biographyShort}
            </p>
          )}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-deep text-white rounded-full text-sm hover:bg-brand-teal transition-colors"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Full biography */}
        {artist.biographyLong && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">
              Biography
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {artist.biographyLong}
            </p>
          </section>
        )}

        {/* Achievements */}
        {artist.achievements && artist.achievements.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">
              Achievements
            </h2>
            <ul className="space-y-2">
              {(artist.achievements as string[]).map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-brand-teal mt-1">✦</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Speaking profile */}
        {artist.speakingProfile && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">
              Speaking
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {artist.speakingProfile}
            </p>
          </section>
        )}

        {/* Bottom back link */}
        {backHref && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href={backHref}
              className="text-sm text-brand-teal hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
