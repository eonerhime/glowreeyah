import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import slugify from 'slugify';
import { SongSchema } from '@/lib/validators/songValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const albumId = searchParams.get('albumId');
  const tag = searchParams.get('tag');

  const query: Record<string, string | boolean | mongoose.Types.ObjectId> = {
    isPublished: true,
  };
  if (albumId) query.albumId = albumId;
  if (tag) query.tags = tag;

  const songs = await Song.find(query)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .sort({ trackNumber: 1 })
    .lean();

  return NextResponse.json({ data: songs });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = SongSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const song = await Song.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: song }, { status: 201 });
}
