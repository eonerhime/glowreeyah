import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import BookingCard from '@/components/cms/BookingCard';
import MarkBookingsSeen from '@/components/cms/MarkBookingsSeen';
import type mongoose from 'mongoose';

type LeanBooking = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  organisation?: string;
  eventType?: string;
  eventDate?: string;
  message: string;
  status: string;
  createdAt: Date;
};

export default async function CMSBookingsPage() {
  await connectDB();

  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

  const serialised = bookings.map((b: LeanBooking) => ({
    _id: b._id.toString(),
    name: b.name,
    email: b.email,
    organisation: b.organisation ?? '',
    eventType: b.eventType ?? '',
    eventDate: b.eventDate ?? '',
    message: b.message,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div>
      <MarkBookingsSeen />
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Booking Requests
      </h1>
      <div className="space-y-3">
        {serialised.map((b) => (
          <BookingCard key={b._id} booking={b} />
        ))}
        {serialised.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No booking requests yet.
          </p>
        )}
      </div>
    </div>
  );
}
