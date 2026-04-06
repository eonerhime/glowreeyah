import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import StatusBadge from '@/components/cms/StatusBadge';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';

interface CMSPostType {
  _id: string;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt?: string;
}

export default async function CMSPostsPage() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <CMSPageHeader
        title="Posts"
        createHref="/cms/posts/new"
        createLabel="New Post"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post: CMSPostType) => (
              <tr
                key={post._id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-deep">
                  {post.title}
                </td>
                <td className="px-4 py-3 text-gray-500 capitalize">
                  {post.category}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge published={post.isPublished} />
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <CMSRowActions
                    id={post._id.toString()}
                    editHref={`/cms/posts/${post._id}`}
                    apiRoute="/api/posts"
                    resourceName="post"
                  />
                  {/* <Link
                    href={`/cms/posts/${post._id}`}
                    className="text-brand-teal hover:underline text-xs"
                  >
                    Edit
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No posts yet. Create your first post.
          </p>
        )}
      </div>
    </div>
  );
}
