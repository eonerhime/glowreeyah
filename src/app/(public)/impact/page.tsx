import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Metadata } from 'next';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Impact',
  description: 'Social impact initiatives and foundations by Glowreeyah.',
};

interface InitiativeType {
  _id: string;
  title: string;
  description?: string;
  body?: string;
  coverImageUrl?: string;
  externalLink?: string;
}

export default async function ImpactPage() {
  await connectDB();
  const initiatives = await Initiative.find()
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-10">
        Impact & Initiatives
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {initiatives.map((item: InitiativeType) => (
          <div
            key={item._id.toString()}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
          >
            {item.coverImageUrl && (
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                width={600}
                height={192}
                quality={75}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="font-serif text-xl text-brand-deep mb-2">
              {item.title}
            </h2>
            {item.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>
            )}
            {item.body && (
              <article className="prose prose-gray max-w-none mb-4">
                <ReactMarkdown>{item.body}</ReactMarkdown>
              </article>
            )}
            {item.externalLink && (
              <a
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-teal hover:underline"
              >
                Learn more &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
