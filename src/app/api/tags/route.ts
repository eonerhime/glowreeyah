import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import slugify from 'slugify';
import { TagSchema } from '@/lib/validators/tagValidator';

export async function GET() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: tags });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = TagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const tag = await Tag.create({
    ...parsed.data,
    slug: slugify(parsed.data.name, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: tag }, { status: 201 });
}
