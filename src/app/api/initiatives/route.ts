import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import slugify from 'slugify';
import { InitiativeSchema } from '@/lib/validators/initiativeValidator';

export async function GET() {
  await connectDB();
  const initiatives = await Initiative.find()
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ data: initiatives });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = InitiativeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const initiative = await Initiative.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: initiative }, { status: 201 });
}
