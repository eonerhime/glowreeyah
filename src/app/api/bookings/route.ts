import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { BookingSchema } from '@/lib/validators/bookingValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const query: Record<string, string> = {};
  if (status) query.status = status;

  const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: bookings });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const booking = await Booking.create(parsed.data);
  return NextResponse.json({ data: booking }, { status: 201 });
}
