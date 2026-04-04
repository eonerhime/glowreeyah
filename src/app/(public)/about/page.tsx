import { connectDB } from '@/lib/mongodb'
import Artist from '@/models/Artist'
import PageWrapper from '@/components/layout/PageWrapper'
import Image from 'next/image'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  await connectDB()
  const artist = await Artist.findOne().lean()
  return {
    title:       'About',
    description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
    openGraph: {
      title:       'About Glowreeyah',
      description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
      images:      artist?.profileImageUrl ? [{ url: artist.profileImageUrl }] : [],
      type:        'profile',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'About Glowreeyah',
      description: artist?.biographyShort ?? 'Learn more about Glowreeyah.',
      images:      artist?.profileImageUrl ? [artist.profileImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
  }
}

interface SocialLink {
  label: string
  href:  string
  icon:  string
}

export default async function AboutPage() {
  await connectDB()
  const artist = await Artist.findOne().lean()

  if (!artist) {
    return (
      <PageWrapper>
        <h1 className="font-serif text-4xl text-brand-deep mb-6">About</h1>
        <p className="text-gray-500">Artist profile coming soon.</p>
      </PageWrapper>
    )
  }

  const socialLinks: SocialLink[] = [
    { label: 'Instagram', href: artist.socialLinks?.instagram ?? '', icon: '📸' },
    { label: 'YouTube',   href: artist.socialLinks?.youtube   ?? '', icon: '▶️' },
    { label: 'Spotify',   href: artist.socialLinks?.spotify   ?? '', icon: '🎵' },
    { label: 'Twitter',   href: artist.socialLinks?.twitter   ?? '', icon: '🐦' },
  ].filter(l => l.href)

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">

        {/* Profile image + name hero */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          {artist.profileImageUrl && (
            <div className="relative w-48 h-48 rounded-full overflow-hidden shrink-0 shadow-lg">
              <Image
                src={artist.profileImageUrl}
                alt={artist.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div>
            <h1 className="font-serif text-4xl text-brand-deep font-bold mb-3">
              {artist.name}
            </h1>
            {artist.biographyShort && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {artist.biographyShort}
              </p>
            )}
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {socialLinks.map(link => (
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
        </div>

        {/* Full biography */}
        {artist.biographyLong && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">Biography</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {artist.biographyLong}
            </p>
          </section>
        )}

        {/* Achievements */}
        {artist.achievements && artist.achievements.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-brand-deep mb-4">Achievements</h2>
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
            <h2 className="font-serif text-2xl text-brand-deep mb-4">Speaking</h2>
            <p className="text-gray-700 leading-relaxed">
              {artist.speakingProfile}
            </p>
          </section>
        )}

      </div>
    </PageWrapper>
  )
}