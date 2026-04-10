import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import Song from '@/models/Song';
import AlbumPlayer from '@/components/music/AlbumPlayer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: Promise<{ albumSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params;
  await connectDB();
  const album = (await Album.findOne({ slug: albumSlug }).lean()) as {
    title: string;
    description?: string;
    coverImageUrl?: string;
    seo?: { metaTitle?: string; metaDescription?: string };
  } | null;
  if (!album) return {};
  return {
    title: album.seo?.metaTitle || album.title,
    description: album.seo?.metaDescription || album.description,
    openGraph: {
      title: album.seo?.metaTitle || album.title,
      description: album.seo?.metaDescription || album.description,
      images: album.coverImageUrl ? [{ url: album.coverImageUrl }] : [],
      type: 'music.album',
    },
    twitter: {
      card: 'summary_large_image',
      title: album.seo?.metaTitle || album.title,
      description: album.seo?.metaDescription || album.description,
      images: album.coverImageUrl ? [album.coverImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${albumSlug}`,
    },
  };
}

export default async function AlbumPage({ params }: Props) {
  const { albumSlug } = await params;
  await connectDB();

  const headersList = await headers();
  const referer = headersList.get('referer') ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isFromHome = referer === siteUrl || referer === `${siteUrl}/`;
  const backHref = isFromHome ? '/#music' : '/music';
  const backLabel = isFromHome ? '← Back to Home' : '← Back to Music';

  const album = (await Album.findOne({ slug: albumSlug }).lean()) as {
    _id: { toString(): string };
    title: string;
    slug: string;
    releaseYear: number;
    description?: string;
    coverImageUrl?: string;
  } | null;

  if (!album) notFound();

  const rawSongs = await Song.find({ albumId: album._id, isPublished: true })
    .sort({ trackNumber: 1 })
    .lean();

  const songs = rawSongs.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    slug: s.slug,
    trackNumber: s.trackNumber,
    description: s.description,
    audioUrl: s.audioUrl,
    coverImageUrl: s.coverImageUrl,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'Glowreeyah',
    },
    ...(album && {
      inAlbum: {
        '@type': 'MusicAlbum',
        name: album.title,
      },
    }),
    description: song.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${albumSlug}`,
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      {album.coverImageUrl ? (
        <div className="relative w-full h-[70vh]">
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            fill
            quality={80}
            className="object-contain object-top"
            priority
          />
          <div className="absolute inset-0 bg-brand-deep/60" />
          <div className="absolute inset-0 flex items-end px-6 pb-10">
            <div className="max-w-4xl w-full mx-auto">
              <Link
                href={backHref}
                className="text-white/60 text-xs hover:text-white transition-colors mb-3 inline-block"
              >
                {backLabel}
              </Link>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-1">
                {album.title}
              </h1>
              <p className="text-brand-teal text-sm">{album.releaseYear}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-deep text-white py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href={backHref}
              className="text-white/60 text-xs hover:text-white transition-colors mb-4 inline-block"
            >
              {backLabel}
            </Link>
            <h1 className="font-serif text-4xl md:text-5xl mb-1">
              {album.title}
            </h1>
            <p className="text-brand-teal text-sm">{album.releaseYear}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
        {album.description && (
          <p className="text-gray-600 leading-relaxed mb-10">
            {album.description}
          </p>
        )}
        <AlbumPlayer songs={songs} />
        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href={backHref}
            className="text-sm text-brand-teal hover:underline"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
