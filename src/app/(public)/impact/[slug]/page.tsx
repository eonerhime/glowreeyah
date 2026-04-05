import { connectDB } from '@/lib/mongodb'
import Initiative from '@/models/Initiative'
import PageWrapper from '@/components/layout/PageWrapper'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  await connectDB()
  const item = await Initiative.findOne({ slug }).lean() as {
    title: string; description?: string; coverImageUrl?: string
  } | null
  if (!item) return {}
  return {
    title:       item.title,
    description: item.description ?? '',
    openGraph: {
      title:       `${item.title} — Glowreeyah`,
      description: item.description ?? '',
      images:      item.coverImageUrl ? [{ url: item.coverImageUrl }] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/impact/${slug}`,
    },
  }
}

export default async function InitiativeDetailPage({ params }: Props) {
  const { slug } = await params
  await connectDB()

  // Determine back link from referer
  const headersList  = await headers()
  const referer      = headersList.get('referer') ?? ''
  const siteUrl      = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const isFromHome   = referer === siteUrl || referer === `${siteUrl}/`
  const backHref     = isFromHome ? '/#impact' : '/impact'
  const backLabel    = isFromHome ? '← Back to Home' : '← Back to Impact'

  const item = await Initiative.findOne({ slug })
    .populate('tags', 'name slug')
    .lean() as {
      _id:            { toString(): string }
      title:          string
      slug:           string
      description?:   string
      body?:          string
      coverImageUrl?: string
      externalLink?:  string
    } | null

  if (!item) notFound()

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Hero */}
      {item.coverImageUrl ? (
        <div className="relative w-full h-72 md:h-96">
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            quality={80}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-deep/50" />
          <div className="absolute inset-0 flex items-end px-6 pb-10">
            <div className="max-w-4xl w-full mx-auto">
              <Link
                href={backHref}
                className="text-white/60 text-xs hover:text-white transition-colors mb-3 inline-block"
              >
                {backLabel}
              </Link>
              <h1 className="font-serif text-4xl md:text-5xl text-white">
                {item.title}
              </h1>
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
            <h1 className="font-serif text-4xl md:text-5xl">{item.title}</h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {item.description && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
            {item.description}
          </p>
        )}
        {item.body && (
          <article className="prose prose-gray max-w-none">
            <ReactMarkdown>{item.body}</ReactMarkdown>
          </article>
        )}
        {item.externalLink && (
          <div className="mt-10">
            
            <a href={item.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-teal text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
            >
              Learn more →
            </a>
          </div>
        )}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <Link href={backHref} className="text-sm text-brand-teal hover:underline">
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}