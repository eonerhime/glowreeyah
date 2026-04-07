// src/app/api/media/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  const asset = await MediaAsset.findById(id);
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await cloudinary.uploader.destroy(asset.publicId);
  await asset.deleteOne();

  return NextResponse.json({ ok: true });
}
