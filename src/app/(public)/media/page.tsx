import { connectDB } from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';
import MediaCard, { type MediaAssetType } from '@/components/media/MediaCard';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Media',
  description: 'TV features, interviews and press appearances.',
};

export default async function MediaPage() {
  await connectDB();
  const assets = await MediaAsset.find({ type: { $in: ['image', 'video'] } })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-10">
        Media & Press
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset: MediaAssetType) => (
          <MediaCard key={asset._id.toString()} asset={asset} />
        ))}
      </div>
    </PageWrapper>
  );
}
