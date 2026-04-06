import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  await connectDB();
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  // Use toObject() not lean() so all schema fields are included
  // even if they were never written to the document
  return NextResponse.json({ data: settings.toObject() });
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
  return NextResponse.json({ data: settings.toObject() });
}
