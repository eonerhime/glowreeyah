import ContactForm from '@/components/contact/ContactForm';
import PostCard, { type PostType } from '@/components/content/PostCard';
import AlbumCard from '@/components/music/AlbumCard';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Artist from '@/models/Artist';
import Event from '@/models/Event';
import Initiative from '@/models/Initiative';
import Post from '@/models/Post';
import SiteSettings from '@/models/SiteSettings';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return {
    title: settings?.heroTitle ?? 'Glowreeyah',
    description: settings?.heroSubtitle ?? 'Music. Ministry. Movement.',
    openGraph: {
      title: settings?.heroTitle ?? 'Glowreeyah',
      description: settings?.heroSubtitle ?? 'Music. Ministry. Movement.',
      images: settings?.heroImageUrl ? [{ url: settings.heroImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.heroTitle ?? 'Glowreeyah',
      description: settings?.heroSubtitle ?? 'Music. Ministry. Movement.',
      images: settings?.heroImageUrl ? [settings.heroImageUrl] : [],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };
}

interface AlbumType {
  _id: string;
  title: string;
  slug: string;
  releaseYear: number;
  coverImageUrl: string;
  description?: string;
}

interface EventType {
  _id: string;
  title: string;
  date: string;
  location: string;
  description?: string;
  externalLink?: string;
}

interface InitiativeType {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  externalLink?: string;
}

export default async function HomePage() {
  await connectDB();

  const [settings, artist, albums, latestPosts, upcomingEvents, initiatives] =
    await Promise.all([
      SiteSettings.findOne().lean<{
        heroTitle?: string;
        heroSubtitle?: string;
        heroImageUrl?: string;
        heroImageMobileUrl?: string;
        heroLogoUrl?: string;
        homeIntro?: string;
        blogPageHeading?: string;
        impactPageHeading?: string;
      }>(),
      Artist.findOne().lean(),
      Album.find().sort({ releaseYear: -1 }).limit(3).lean(),
      Post.find({ isPublished: true })
        .sort({ publishedAt: -1 })
        .limit(3)
        .lean(),
      Event.find().sort({ date: 1 }).limit(3).lean(),
      Initiative.find().limit(2).lean(),
    ]);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative bg-brand-deep text-white">
        {/* Mobile only (< 768px) */}
        <div className="md:hidden">
          {(settings?.heroImageMobileUrl || settings?.heroImageUrl) && (
            <div className="relative w-full h-80">
              <Image
                src={settings.heroImageMobileUrl || settings.heroImageUrl || ''}
                alt="Glowreeyah Braimah"
                fill
                priority
                quality={80}
                className="object-cover object-top"
              />
            </div>
          )}
          <div className="px-6 py-8 text-center bg-brand-deep">
            <p className="text-lg text-brand-warm font-semibold mb-6">
              {settings?.heroSubtitle ?? 'Music. Ministry. Movement.'}
            </p>
            {settings?.homeIntro && (
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {settings.homeIntro}
              </p>
            )}
            <div className="flex flex-col gap-3 items-center">
              <Link
                href="/music"
                className="w-full max-w-xs bg-brand-teal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-teal/90 transition-colors shadow-lg text-center"
              >
                Listen Now
              </Link>
              <Link
                href="/booking"
                className="w-full max-w-xs bg-white text-brand-deep border border-brand-deep/20 px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-warm transition-colors shadow-lg text-center"
              >
                Book Glowreeyah
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet + Desktop (>= 768px) */}
        <div className="hidden md:flex relative min-h-[90vh] items-end justify-center px-6 pb-20">
          {settings?.heroImageUrl && (
            <Image
              src={settings.heroImageUrl}
              alt="Glowreeyah Braimah"
              fill
              priority
              quality={80}
              className="object-cover object-center"
            />
          )}
          <div className="relative z-10 w-full max-w-6xl mx-auto flex justify-end">
            <div className="flex flex-col items-start text-left w-full max-w-lg pr-4">
              <p className="text-xl md:text-2xl text-brand-deep font-semibold mb-6 drop-shadow-sm">
                {settings?.heroSubtitle ?? 'Music. Ministry. Movement.'}
              </p>
              {settings?.homeIntro && (
                <p className="max-w-xl text-brand-deep/80 text-base leading-relaxed mb-6">
                  {settings.homeIntro}
                </p>
              )}
              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/music"
                  className="bg-brand-teal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-teal/90 transition-colors shadow-lg cursor-pointer"
                >
                  Listen Now
                </Link>
                <Link
                  href="/booking"
                  className="bg-white text-brand-deep border border-brand-deep/20 px-8 py-3 rounded-full text-sm font-semibold hover:bg-brand-warm transition-colors shadow-lg cursor-pointer"
                >
                  Book Glowreeyah
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST MUSIC ── */}
      {albums.length > 0 && (
        <section id="music" className="py-16 px-6 bg-brand-warm">
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
        <section id="about" className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {artist.profileImageUrl && (
              <div className="relative w-56 h-56 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                <Image
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
                About
              </p>
              <h2 className="font-serif text-3xl text-brand-deep mb-4">
                {artist.name}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {artist.biographyMedium ?? artist.biographyShort}
              </p>
              <Link
                href="/about"
                className="inline-block bg-brand-teal text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
              >
                Read more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── LATEST POSTS ── */}
      {latestPosts.length > 0 && (
        <section id="blog" className="py-16 px-6 bg-brand-warm">
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

      {/* ── EVENTS ── */}
      {upcomingEvents.length > 0 && (
        <section
          id="events"
          className="py-16 px-6 bg-brand-deep text-white overflow-hidden"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
                  On the road
                </p>
                <h2 className="font-serif text-3xl text-white">Events</h2>
              </div>
              <Link
                href="/events"
                className="text-sm text-brand-teal hover:underline shrink-0"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(upcomingEvents as EventType[]).map((event) => {
                const isPast = new Date(event.date) < new Date();
                return (
                  <div
                    key={event._id.toString()}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="inline-flex items-center gap-2 bg-brand-teal/20 text-brand-teal text-xs font-medium px-3 py-1 rounded-full mb-4">
                      <span>
                        {new Date(event.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {isPast && (
                        <span className="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full">
                          Past
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-white mb-2 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-4 flex items-center gap-1.5">
                      <span>📍</span>
                      {event.location}
                    </p>
                    {event.description && (
                      <p className="text-white/60 text-sm leading-relaxed mb-5 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      {event.externalLink && (
                        <a
                          href={event.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-brand-teal text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-teal/90 transition-colors"
                        >
                          More info →
                        </a>
                      )}
                      <Link
                        href="/booking"
                        className="text-xs border border-white/30 text-white/70 px-4 py-2 rounded-lg font-medium hover:border-brand-teal hover:text-brand-teal transition-colors"
                      >
                        Book Glowreeyah
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── IMPACT ── */}
      {initiatives.length > 0 && (
        <section id="impact" className="py-16 px-6 bg-white">
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
                <Link
                  key={item._id.toString()}
                  href={`/impact/${item.slug}`}
                  className="group bg-brand-warm rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow block"
                >
                  {item.coverImageUrl && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        quality={75}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-brand-deep mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <span className="inline-block mt-3 text-xs text-brand-teal font-medium">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section className="py-16 px-6 bg-brand-warm">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
            Get in touch
          </p>
          <h2 className="font-serif text-3xl text-brand-deep mb-3">Contact</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Have a question, a collaboration idea, or just want to say hello?
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <ContactForm />
        </div>
        <p className="text-center mt-6 text-sm text-gray-400">
          Or visit the{' '}
          <Link href="/contact" className="text-brand-teal hover:underline">
            full contact page
          </Link>{' '}
          for social handles and more.
        </p>
      </section>
    </div>
  );
}
