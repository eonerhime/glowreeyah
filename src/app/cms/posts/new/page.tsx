import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import PostForm from '@/components/cms/PostForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

export default async function NewPostPage() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();

  const serialisedTags = tags.map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    slug: t.slug,
  }));

  return (
    <div>
      <CMSPageHeader
        title="New Post"
        createHref="/cms/posts"
        createLabel="Back to Posts"
        backHref="/cms/posts"
        backLabel="Back"
      />
      <div className="mt-6">
        <PostForm tags={serialisedTags} />
      </div>
    </div>
  );
}
