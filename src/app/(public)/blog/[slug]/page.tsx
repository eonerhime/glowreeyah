import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import PageWrapper from '@/components/layout/PageWrapper';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug }).lean();
  if (!post) return {};
  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug, isPublished: true })
    .populate('tags', 'name slug')
    .lean();

  if (!post) notFound();

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-4">{post.title}</h1>
      {post.publishedAt && (
        <p className="text-sm text-gray-400 mb-8">
          {new Date(post.publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}
      <article className="prose prose-gray max-w-none">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </article>
    </PageWrapper>
  );
}
