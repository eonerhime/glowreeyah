import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import slugify from 'slugify';
import { EventSchema } from '@/lib/validators/eventValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = EventSchema.partial().safeParse(body);
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
  const event = await Event.findByIdAndUpdate(id, update, { new: true });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Event.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
