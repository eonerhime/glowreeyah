import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';

const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'declined'] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: { status: ['Invalid status value'] } },
      { status: 422 }
    );
  }
  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );
  if (!booking)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: booking });
}
