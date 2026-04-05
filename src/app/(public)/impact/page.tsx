import { connectDB } from '@/lib/mongodb'
import Initiative from '@/models/Initiative'
import PageWrapper from '@/components/layout/PageWrapper'
import InitiativeCard from '@/components/content/InitiativeCard'
import type { Metadata } from 'next'
import type { Types } from 'mongoose'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Impact',
  description: 'Social impact initiatives and foundations by Glowreeyah.',
  openGraph: {
    title:       'Impact — Glowreeyah',
    description: 'Social impact initiatives and foundations by Glowreeyah.',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Impact — Glowreeyah',
    description: 'Social impact initiatives and foundations by Glowreeyah.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/impact`,
  },
}

interface LeanInitiative {
  _id:           Types.ObjectId
  title:         string
  slug:          string
  description?:  string
  body?:         string
  coverImageUrl?: string
  externalLink?:  string
}

export default async function ImpactPage() {
  await connectDB()
  const initiatives = await Initiative.find()
    .sort({ createdAt: -1 })
    .lean() as LeanInitiative[]

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
            Making a difference
          </p>
          <h1 className="font-serif text-4xl text-brand-deep">
            Impact & Initiatives
          </h1>
        </div>

        {initiatives.length === 0 && (
          <p className="text-gray-400 text-sm">No initiatives yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((item) => (
            <InitiativeCard
              key={item._id.toString()}
              item={{
                _id:           item._id.toString(),
                title:         item.title,
                slug:          item.slug,
                description:   item.description,
                coverImageUrl: item.coverImageUrl,
              }}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}