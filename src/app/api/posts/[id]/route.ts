import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';
import { PostSchema } from '@/lib/validators/postValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findById(id).populate('tags', 'name slug').lean();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = PostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title)
    update.slug = slugify(parsed.data.title, { lower: true, strict: true });
  if (parsed.data.isPublished) update.publishedAt = new Date();
  const post = await Post.findByIdAndUpdate(id, update, { new: true });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
