import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';

interface CMSAlbumType {
  _id: string;
  title: string;
  releaseYear: number;
  slug: string;
}

export default async function CMSAlbumsPage() {
  await connectDB();
  const albums = await Album.find().sort({ releaseYear: -1 }).lean();

  return (
    <div>
      <CMSPageHeader
        title="Albums"
        createHref="/cms/albums/new"
        createLabel="New Album"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {albums.map((album: CMSAlbumType) => (
              <tr
                key={album._id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-deep">
                  {album.title}
                </td>
                <td className="px-4 py-3 text-gray-500">{album.releaseYear}</td>
                <td className="px-4 py-3 text-right">
                  <CMSRowActions
                    id={album._id.toString()}
                    editHref={`/cms/albums/${album._id}`}
                    apiRoute="/api/albums"
                    resourceName="album"
                  />
                  {/* <Link
                    href={`/cms/albums/${album._id}`}
                    className="text-brand-teal hover:underline text-xs"
                  >
                    Edit
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {albums.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No albums yet. Create your first album.
          </p>
        )}
      </div>
    </div>
  );
}
