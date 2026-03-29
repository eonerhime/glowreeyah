import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const asset = await MediaAsset.findById(params.id);
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete from Cloudinary first, then remove the DB record
  await cloudinary.uploader.destroy(asset.publicId);
  await asset.deleteOne();

  return NextResponse.json({ ok: true });
}
