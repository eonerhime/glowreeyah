import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import { ArtistSchema } from '@/lib/validators/artistValidator';
import slugify from 'slugify';

export async function GET() {
  await connectDB();
  const artist = await Artist.findOne().lean();
  return NextResponse.json({ data: artist });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = ArtistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const artist = await Artist.create({
    ...parsed.data,
    slugName: slugify(parsed.data.name, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: artist }, { status: 201 });
}
