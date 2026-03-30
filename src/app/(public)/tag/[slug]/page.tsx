import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Song from '@/models/Song';
import Post from '@/models/Post';
import PageWrapper from '@/components/layout/PageWrapper';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

interface SongType {
  _id: string;
  title: string;
  slug: string;
}

interface PostType {
  _id: string;
  title: string;
  slug: string;
  category: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const tag = await Tag.findOne({ slug: params.slug }).lean();
  if (!tag) return {};
  return {
    title: `#${tag.name}`,
    description: `All content tagged with ${tag.name}.`,
  };
}

export default async function TagPage({ params }: Props) {
  await connectDB();
  const tag = await Tag.findOne({ slug: params.slug }).lean();
  if (!tag) notFound();

  const [songs, posts] = await Promise.all([
    Song.find({ tags: tag._id, isPublished: true })
      .sort({ createdAt: -1 })
      .lean(),
    Post.find({ tags: tag._id, isPublished: true })
      .sort({ publishedAt: -1 })
      .lean(),
  ]);

  return (
    <PageWrapper>
      <h1 className="font-serif text-4xl text-brand-deep mb-2">#{tag.name}</h1>
      {tag.description && (
        <p className="text-gray-500 mb-10">{tag.description}</p>
      )}

      {songs.length > 0 && (
        <section className="mb-12">
          <h2 className="font-serif text-2xl text-brand-deep mb-6">Songs</h2>
          <div className="space-y-3">
            {songs.map((song: SongType) => (
              <div
                key={song._id.toString()}
                className="border-b border-gray-100 pb-3"
              >
                <p className="font-medium text-brand-deep">{song.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl text-brand-deep mb-6">Posts</h2>
          <div className="space-y-3">
            {posts.map((post: PostType) => (
              <div
                key={post._id.toString()}
                className="border-b border-gray-100 pb-3"
              >
                <p className="font-medium text-brand-deep">{post.title}</p>
                <p className="text-sm text-gray-400 capitalize">
                  {post.category}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {songs.length === 0 && posts.length === 0 && (
        <p className="text-gray-400">No content found for this tag.</p>
      )}
    </PageWrapper>
  );
}
