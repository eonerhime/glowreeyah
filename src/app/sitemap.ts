import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import Post from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const songs = await Song.find({ isPublished: true })
    .select('slug updatedAt')
    .lean();
  const posts = await Post.find({ isPublished: true })
    .select('slug updatedAt')
    .lean();

  const BASE = process.env.NEXT_PUBLIC_SITE_URL!;

  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/music`, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    ...songs.map((s) => ({
      url: `${BASE}/music/${s.slug}`,
      lastModified: s.updatedAt,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
