import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';
import { PostSchema } from '@/lib/validators/postValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  const query: Record<string, string | boolean> = { isPublished: true };
  if (category) query.category = category;
  if (tag) query.tags = tag;

  const posts = await Post.find(query)
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .lean();

  return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const post = await Post.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
    publishedAt: parsed.data.isPublished ? new Date() : null,
  });
  return NextResponse.json({ data: post }, { status: 201 });
}
