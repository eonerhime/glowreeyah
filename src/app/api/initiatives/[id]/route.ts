import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import slugify from 'slugify';
import { InitiativeSchema } from '@/lib/validators/initiativeValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const initiative = await Initiative.findById(params.id)
    .populate('tags', 'name slug')
    .lean();
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const parsed = InitiativeSchema.partial().safeParse(body);
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
  const initiative = await Initiative.findByIdAndUpdate(params.id, update, {
    new: true,
  });
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Initiative.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
