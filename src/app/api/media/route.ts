// src/app/api/media/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function GET() {
  await connectDB();
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: assets });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const altText = formData.get('altText') as string;
  const type = formData.get('type') as string;

  if (!altText) {
    return NextResponse.json(
      { error: { altText: ['Alt text is required'] } },
      { status: 422 }
    );
  }
  if (!file) {
    return NextResponse.json(
      { error: { file: ['File is required'] } },
      { status: 422 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'glowreeyah', resource_type: 'auto' },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

  const asset = await MediaAsset.create({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    altText,
    type,
  });

  return NextResponse.json({ data: asset }, { status: 201 });
}

// Bulk delete — body: { ids: string[] }
export async function DELETE(req: NextRequest) {
  await connectDB();

  let ids: string[];
  try {
    const body = await req.json();
    ids = body.ids;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: 'ids must be a non-empty array' },
      { status: 422 }
    );
  }

  const assets = await MediaAsset.find({ _id: { $in: ids } });

  if (assets.length === 0) {
    return NextResponse.json(
      { error: 'No matching assets found' },
      { status: 404 }
    );
  }

  // Delete from Cloudinary in parallel, tolerate individual failures
  await Promise.allSettled(
    assets.map((a) => cloudinary.uploader.destroy(a.publicId))
  );

  // Remove all from MongoDB
  await MediaAsset.deleteMany({ _id: { $in: ids } });

  return NextResponse.json({ ok: true, deleted: assets.length });
}
