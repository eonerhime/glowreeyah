import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const photo = await GalleryPhoto.findByIdAndUpdate(id, body, { new: true });
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: photo });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await GalleryPhoto.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
