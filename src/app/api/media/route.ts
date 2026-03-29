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
