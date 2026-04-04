import { connectDB } from '@/lib/mongodb'
import Image from 'next/image'
import Link from 'next/link'
import SiteSettings from '@/models/SiteSettings'
import Artist from '@/models/Artist'
import Album from '@/models/Album'
import Song from '@/models/Song'
import Post from '@/models/Post'
import Event from '@/models/Event'
import Initiative from '@/models/Initiative'
import AlbumCard from '@/components/music/AlbumCard'
import PostCard, { type PostType } from '@/components/content/PostCard'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  await connectDB()
  const settings = await SiteSettings.findOne().lean()
  return {
    title:       settings?.heroTitle       ?? 'Glowreeyah',
    description: settings?.heroSubtitle    ?? 'Music. Ministry. Movement.',
    openGraph: {
      title:       settings?.heroTitle    ?? 'Glowreeyah',
      description: settings?.heroSubtitle ?? 'Music. Ministry. Movement.',
      images:      settings?.heroImageUrl ? [{ url: settings.heroImageUrl }] : [],
      type:        'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       settings?.heroTitle    ?? 'Glowreeyah',
      description: settings?.heroSubtitle ?? 'Music. Ministry. Movement.',
      images:      settings?.heroImageUrl ? [settings.heroImageUrl] : [],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    },
  }
}

interface AlbumType {
  _id:           string
  title:         string
  slug:          string
  releaseYear:   number
  coverImageUrl: string
  description?:  string
}

interface EventType {
  _id:          string
  title:        string
  date:         string
  location:     string
  description?: string
  externalLink?: string
}

interface InitiativeType {
  _id:           string
  title:         string
  description?:  string
  coverImageUrl?: string
  externalLink?:  string
}

export default async function HomePage() {
  await connectDB()

  const [settings, artist, albums, latestPosts, upcomingEvent, initiatives] =
    await Promise.all([
      SiteSettings.findOne().lean(),
      Artist.findOne().lean(),
      Album.find().sort({ releaseYear: -1 }).limit(3).lean(),
      Post.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean(),
      Event.findOne({ isUpcoming: true }).sort({ date: 1 }).lean(),
      Initiative.find().limit(2).lean(),
    ])

  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-brand-deep text-white text-center px-6">
        {settings?.heroImageUrl && (
          <Image
            src={settings.heroImageUrl}
            alt="Hero background"
            fill
            priority
            quality={80}
            className="object-cover object-center opacity-9"
          />
        )}
        {/* <div className="relative z-10 flex flex-col items-center"> */}
          {/* <Image
            src={settings?.heroLogoUrl ?? '/glowreeyah.png'}
            alt={settings?.heroTitle ?? 'Glowreeyah'}
            width={300}
            height={96}
            quality={75}
            priority
            className="h-24 w-auto object-contain mb-6"
          /> */}
          <p className="text-xl md:text-2xl text-brand-warm mb-8">
            {settings?.heroSubtitle ?? 'Music. Ministry. Movement.'}
          </p>
          {settings?.homeIntro && (
            <p className="max-w-xl text-white/70 text-base leading-relaxed mb-8">
              {settings.homeIntro}
            </p>
          )}
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/music"
              className="bg-brand-teal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-teal/90 transition-colors"
            >
              Listen Now
            </Link>
            <Link
              href="/booking"
              className="border border-black/40 text-white px-6 py-3 rounded-full text-sm font-medium hover:border-brand-teal hover:text-brand-teal transition-colors"
            >
              Book Glowreeyah
            </Link>
          </div>
        {/* </div> */}
      </section>

      {/* ── LATEST MUSIC ── */}
      {albums.length > 0 && (
        <section className="py-16 px-6 bg-brand-warm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-brand-deep">Music</h2>
              <Link
                href="/music"
                className="text-sm text-brand-teal hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album: AlbumType) => (
                <AlbumCard key={album._id.toString()} album={album} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT SNIPPET ── */}
      {artist && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {artist.profileImageUrl && (
              <div className="relative w-48 h-48 rounded-full overflow-hidden shrink-0 shadow-lg">
                <Image
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="font-serif text-3xl text-brand-deep mb-4">
                {artist.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {artist.biographyMedium ?? artist.biographyShort}
              </p>
              <Link
                href="/about"
                className="text-sm text-brand-teal hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST POSTS ── */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-6 bg-brand-warm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-brand-deep">
                {settings?.blogPageHeading ?? 'Blog'}
              </h2>
              <Link
                href="/blog"
                className="text-sm text-brand-teal hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post: PostType) => (
                <PostCard key={post._id.toString()} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENT ── */}
      {upcomingEvent && (
        <section className="py-16 px-6 bg-brand-deep text-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
              Upcoming
            </p>
            <h2 className="font-serif text-3xl mb-3">
              {(upcomingEvent as EventType).title}
            </h2>
            <p className="text-white/60 mb-2">
              {new Date((upcomingEvent as EventType).date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
            <p className="text-white/60 mb-8">
              {(upcomingEvent as EventType).location}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {(upcomingEvent as EventType).externalLink && (
                <a
                  href={(upcomingEvent as EventType).externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-teal text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-teal/90 transition-colors"
                >
                  More Info
                </a>
              )}
              <Link
                href="/booking"
                className="border border-white/40 text-white px-6 py-3 rounded-full text-sm font-medium hover:border-brand-teal hover:text-brand-teal transition-colors"
              >
                Book Glowreeyah
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── IMPACT ── */}
      {initiatives.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl text-brand-deep">
                {settings?.impactPageHeading ?? 'Impact'}
              </h2>
              <Link
                href="/impact"
                className="text-sm text-brand-teal hover:underline"
              >
                Learn more →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initiatives.map((item: InitiativeType) => (
                <div
                  key={item._id.toString()}
                  className="bg-brand-warm rounded-xl p-6 border border-gray-100"
                >
                  <h3 className="font-serif text-xl text-brand-deep mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}