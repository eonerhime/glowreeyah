import Image from 'next/image';
import Link from 'next/link';

export interface PostType {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  publishedAt?: string;
  coverImageUrl?: string;
}

interface Props {
  post: PostType;
}

export default function PostCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:border-brand-teal transition-colors overflow-hidden">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            width={600}
            height={192}
            quality={75}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-5">
          <p className="text-xs uppercase tracking-widest text-brand-teal mb-2">
            {post.category}
          </p>
          <h2 className="font-serif text-lg text-brand-deep font-semibold mb-2 line-clamp-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
          )}
          {post.publishedAt && (
            <p className="text-xs text-gray-400 mt-3">
              {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
