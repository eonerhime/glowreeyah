import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import slugify from 'slugify';
import { SongSchema } from '@/lib/validators/songValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const song = await Song.findById(params.id)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .lean();
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const parsed = SongSchema.partial().safeParse(body);
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
  const song = await Song.findByIdAndUpdate(params.id, update, { new: true });
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Song.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
