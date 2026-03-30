import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import Post from '@/models/Post';
import Album from '@/models/Album';
import Booking from '@/models/Booking';
import Event from '@/models/Event';

export default async function CMSDashboard() {
  await connectDB();

  const [songs, posts, albums, bookings, events] = await Promise.all([
    Song.countDocuments(),
    Post.countDocuments(),
    Album.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Event.countDocuments({ isUpcoming: true }),
  ]);

  const stats = [
    { label: 'Songs', value: songs, href: '/cms/songs' },
    { label: 'Posts', value: posts, href: '/cms/posts' },
    { label: 'Albums', value: albums, href: '/cms/albums' },
    { label: 'Pending Bookings', value: bookings, href: '/cms/bookings' },
    { label: 'Upcoming Events', value: events, href: '/cms/events' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-brand-teal transition-colors"
          >
            <p className="text-3xl font-bold text-brand-teal">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
