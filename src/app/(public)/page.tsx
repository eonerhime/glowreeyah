import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import Post from '@/models/Post';
import Image from 'next/image';

export const revalidate = 3600;

export default async function HomePage() {
  await connectDB();

  const [latestSongs, latestPosts] = await Promise.all([
    Song.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3).lean(),
    Post.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean(),
  ]);

  // Remove console logs when code updated
  console.log('Latest Songs:', latestSongs);
  console.log('Latest Posts:', latestPosts);

  return (
    <div>
      {/* Hero section */}
      <section className="min-h-[90vh] flex items-center justify-center bg-brand-deep text-white text-center px-6">
        <div>
          {/* <h1 className="font-serif text-5xl md:text-7xl text-brand-teal mb-4">
            Glowreeyah
          </h1> */}
          <Image
            src="/glowreeyah.png"
            alt="Glowreeyah logo"
            width={300}
            height={96}
            quality={75}
            priority
            className="w-full h-24 rounded-lg mb-4"
          />
          <p className="text-xl md:text-2xl text-brand-warm">
            Music. Ministry. Movement.
          </p>
        </div>
      </section>

      {/* Latest music section */}
      {/* Latest posts section */}
    </div>
  );
}
