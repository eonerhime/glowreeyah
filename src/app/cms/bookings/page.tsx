import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

interface CMSBookingType {
  _id: string;
  name: string;
  email: string;
  organisation?: string;
  eventType?: string;
  eventDate?: string;
  message: string;
  status: string;
  createdAt: Date;
}

const statusColours: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

export default async function CMSBookingsPage() {
  await connectDB();
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <CMSPageHeader
        title="Booking Requests"
        createHref="/cms/bookings"
        createLabel=""
      />
      <div className="space-y-4 mt-6">
        {bookings.map((b: CMSBookingType) => (
          <div
            key={b._id.toString()}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-brand-deep">{b.name}</p>
                <p className="text-sm text-gray-500">
                  {b.email}
                  {b.organisation && ` · ${b.organisation}`}
                </p>
                {(b.eventType || b.eventDate) && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {b.eventType && `Event: ${b.eventType}`}
                    {b.eventDate && ` · ${b.eventDate}`}
                  </p>
                )}
                <p className="text-sm text-gray-700 mt-2">{b.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(b.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${statusColours[b.status] ?? 'bg-gray-100 text-gray-500'}`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No booking requests yet.
          </p>
        )}
      </div>
    </div>
  );
}
