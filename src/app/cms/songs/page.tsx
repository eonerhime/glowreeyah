import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import StatusBadge from '@/components/cms/StatusBadge';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';

interface CMSSongType {
  _id: string;
  title: string;
  trackNumber?: number;
  isPublished: boolean;
  albumId: { title: string } | string;
}

export default async function CMSSongsPage() {
  await connectDB();
  const songs = await Song.find()
    .populate('albumId', 'title')
    .sort({ trackNumber: 1 })
    .lean();

  return (
    <div>
      <CMSPageHeader
        title="Songs"
        createHref="/cms/songs/new"
        createLabel="New Song"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Album</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {songs.map((song: CMSSongType) => (
              <tr
                key={song._id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-400">
                  {song.trackNumber ?? '—'}
                </td>
                <td className="px-4 py-3 font-medium text-brand-deep">
                  {song.title}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {typeof song.albumId === 'object' ? song.albumId.title : '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge published={song.isPublished} />
                </td>
                <td className="px-4 py-3 text-right">
                  <CMSRowActions
                    id={song._id.toString()}
                    editHref={`/cms/songs/${song._id}`}
                    apiRoute="/api/songs"
                    resourceName="song"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {songs.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No songs yet. Create your first song.
          </p>
        )}
      </div>
    </div>
  );
}
