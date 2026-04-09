import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = (await Post.findOne({ slug }).lean()) as {
    title: string;
    excerpt?: string;
    coverImageUrl?: string;
    seo?: { metaTitle?: string; metaDescription?: string };
  } | null;
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();

  // Referer-based back link
  const headersList = await headers();
  const referer = headersList.get('referer') ?? '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isFromHome = referer === siteUrl || referer === `${siteUrl}/`;
  const backHref = isFromHome ? '/#blog' : '/blog';
  const backLabel = isFromHome ? '← Back to Home' : '← Back to Blog';

  const post = (await Post.findOne({ slug, isPublished: true })
    .populate('tags', 'name slug')
    .lean()) as {
    title: string;
    slug: string;
    excerpt?: string;
    body: string;
    coverImageUrl?: string;
    publishedAt?: Date;
    updatedAt?: Date;
    category: string;
  } | null;

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    ...(post.publishedAt && { datePublished: post.publishedAt.toISOString() }),
    ...(post.updatedAt && { dateModified: post.updatedAt.toISOString() }),
    author: {
      '@type': 'Person',
      name: 'Glowreeyah',
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      {post.coverImageUrl ? (
        <div className="relative w-full h-72 md:h-96">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            quality={80}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-deep/50" />
          <div className="absolute inset-0 flex items-end px-6 pb-10">
            <div className="max-w-3xl w-full mx-auto">
              <Link
                href={backHref}
                className="text-white/60 text-xs hover:text-white transition-colors mb-3 inline-block"
              >
                {backLabel}
              </Link>
              <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
                {post.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-white">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-deep text-white py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href={backHref}
              className="text-white/60 text-xs hover:text-white transition-colors mb-4 inline-block"
            >
              {backLabel}
            </Link>
            <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
              {post.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">{post.title}</h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {post.publishedAt && (
          <p className="text-sm text-gray-400 mb-8">
            {new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        {post.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>
        )}
        <article className="prose prose-gray max-w-none">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </article>
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
