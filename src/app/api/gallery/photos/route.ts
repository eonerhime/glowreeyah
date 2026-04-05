import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryPhoto from '@/models/GalleryPhoto';
import cloudinary from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const linkedType = searchParams.get('linkedType');
  const linkedId = searchParams.get('linkedId');
  const filter: Record<string, string> = {};
  if (linkedType) filter.linkedType = linkedType;
  if (linkedId) filter.linkedId = linkedId;
  const photos = await GalleryPhoto.find(filter)
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return NextResponse.json({ data: photos });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];
  const linkedType = formData.get('linkedType') as string;
  const linkedId = formData.get('linkedId') as string;
  const captions = formData.getAll('captions') as string[];

  if (!files.length || !linkedType || !linkedId) {
    return NextResponse.json(
      { error: 'files, linkedType and linkedId are required' },
      { status: 422 }
    );
  }

  const saved = await Promise.all(
    files.map(async (file, i) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const b64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${b64}`;
      const uploaded = await cloudinary.uploader.upload(dataUri, {
        folder: 'glowreeyah/gallery',
      });
      return GalleryPhoto.create({
        url: uploaded.secure_url,
        caption: captions[i] ?? '',
        linkedType,
        linkedId,
        order: i,
      });
    })
  );

  return NextResponse.json({ data: saved }, { status: 201 });
}
