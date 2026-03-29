import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import slugify from 'slugify';
import { EventSchema } from '@/lib/validators/eventValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const upcoming = searchParams.get('upcoming');

  const query: Record<string, boolean> = {};
  if (upcoming === 'true') query.isUpcoming = true;
  if (upcoming === 'false') query.isUpcoming = false;

  const events = await Event.find(query).sort({ date: 1 }).lean();
  return NextResponse.json({ data: events });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const event = await Event.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: event }, { status: 201 });
}
