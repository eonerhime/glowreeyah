import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import PostCard, { type PostType } from '@/components/content/PostCard';
import PageWrapper from '@/components/layout/PageWrapper';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts, devotionals and stories from Glowreeyah.',
  openGraph: {
    title: 'Blog — Glowreeyah',
    description: 'Thoughts, devotionals and stories from Glowreeyah.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Glowreeyah',
    description: 'Thoughts, devotionals and stories from Glowreeyah.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find({ isPublished: true })
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .lean();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-10">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: PostType) => (
          <PostCard key={post._id.toString()} post={post} />
        ))}
      </div>
    </PageWrapper>
  );
}
