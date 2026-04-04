import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  await connectDB();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return NextResponse.json({ data: settings });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(body);
  } else {
    Object.assign(settings, body);
    await settings.save();
  }
  return NextResponse.json({ data: settings });
}
