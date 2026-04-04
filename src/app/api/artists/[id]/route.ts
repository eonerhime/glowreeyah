import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import { ArtistSchema } from '@/lib/validators/artistValidator';
import slugify from 'slugify';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const parsed = ArtistSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = {
    ...parsed.data,
    ...(parsed.data.name && {
      slugName: slugify(parsed.data.name, { lower: true, strict: true }),
    }),
  };
  const artist = await Artist.findByIdAndUpdate(params.id, update, {
    new: true,
  });
  if (!artist)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: artist });
}
