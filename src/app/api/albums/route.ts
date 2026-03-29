import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import slugify from 'slugify';
import { AlbumSchema } from '@/lib/validators/albumValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');

  const query: Record<string, string> = {};
  if (tag) query.tags = tag;

  const albums = await Album.find(query)
    .populate('tags', 'name slug')
    .sort({ releaseYear: -1 })
    .lean();

  return NextResponse.json({ data: albums });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = AlbumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const album = await Album.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: album }, { status: 201 });
}
