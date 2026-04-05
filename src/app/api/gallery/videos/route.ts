import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryVideo from '@/models/GalleryVideo';

function detectPlatform(url: string): 'youtube' | 'vimeo' {
  return url.includes('vimeo') ? 'vimeo' : 'youtube';
}

function getThumbnail(url: string, platform: 'youtube' | 'vimeo'): string {
  if (platform === 'youtube') {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
  }
  return ''; // Vimeo thumbnails require an API call — leave blank for now
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const linkedType = searchParams.get('linkedType');
  const linkedId = searchParams.get('linkedId');
  const filter: Record<string, string> = {};
  if (linkedType) filter.linkedType = linkedType;
  if (linkedId) filter.linkedId = linkedId;
  const videos = await GalleryVideo.find(filter).sort({ createdAt: 1 }).lean();
  return NextResponse.json({ data: videos });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { videoUrl, caption, linkedType, linkedId } = body;
  if (!videoUrl || !linkedType || !linkedId) {
    return NextResponse.json(
      { error: 'videoUrl, linkedType and linkedId are required' },
      { status: 422 }
    );
  }
  const platform = detectPlatform(videoUrl);
  const thumbnailUrl = getThumbnail(videoUrl, platform);
  const video = await GalleryVideo.create({
    videoUrl,
    platform,
    thumbnailUrl,
    caption,
    linkedType,
    linkedId,
  });
  return NextResponse.json({ data: video }, { status: 201 });
}
