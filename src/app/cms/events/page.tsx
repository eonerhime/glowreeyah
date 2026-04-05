import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import type { Types } from 'mongoose';

interface CMSEventType {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  location: string;
}

export default async function CMSEventsPage() {
  await connectDB();
  const events = (await Event.find()
    .sort({ date: -1 })
    .lean()) as CMSEventType[];

  const now = new Date();

  return (
    <div>
      <CMSPageHeader
        title="Events"
        createHref="/cms/events/new"
        createLabel="New Event"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event) => {
              const isUpcoming = new Date(event.date) >= now;
              return (
                <tr
                  key={event._id.toString()}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-brand-deep">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(event.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{event.location}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {isUpcoming ? 'Upcoming' : 'Past'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CMSRowActions
                      id={event._id.toString()}
                      editHref={`/cms/events/${event._id}`}
                      apiRoute="/api/events"
                      resourceName="event"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No events yet. Create your first event.
          </p>
        )}
      </div>
    </div>
  );
}
