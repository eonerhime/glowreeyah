import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import Tag from '@/models/Tag';
import PostForm from '@/components/cms/PostForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditPostPage({ params }: Props) {
  await connectDB();

  const [post, tags] = await Promise.all([
    Post.findById(params.id).lean(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);

  if (!post) notFound();

  const serialisedPost = {
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt ?? '',
    body: post.body,
    coverImageUrl: post.coverImageUrl ?? '',
    tags: post.tags.map((t: any) => t.toString()),
    isPublished: post.isPublished,
  };

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  return (
    <div>
      <CMSPageHeader
        title="Edit Post"
        createHref="/cms/posts/new"
        createLabel="New Post"
      />
      <div className="mt-6">
        <PostForm post={serialisedPost} tags={serialisedTags} />
      </div>
    </div>
  );
}
