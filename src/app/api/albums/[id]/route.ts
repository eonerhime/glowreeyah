import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import slugify from 'slugify';
import { AlbumSchema } from '@/lib/validators/albumValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const album = await Album.findById(id).populate('tags', 'name slug').lean();
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = AlbumSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = parsed.data.title
    ? {
        ...parsed.data,
        slug: slugify(parsed.data.title, { lower: true, strict: true }),
      }
    : parsed.data;
  const album = await Album.findByIdAndUpdate(id, update, { new: true });
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Album.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
