import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import CMSShell from '@/components/cms/CMSShell';
import { cookies } from 'next/headers';

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectDB();

  const cookieStore = await cookies();
  const lastSeen = cookieStore.get('bookings_last_seen')?.value;
  const lastSeenDate = lastSeen ? new Date(lastSeen) : new Date(0);

  const pendingBookings = await Booking.countDocuments({
    status: 'pending',
    createdAt: { $gt: lastSeenDate },
  });

  return <CMSShell pendingBookings={pendingBookings}>{children}</CMSShell>;
}
