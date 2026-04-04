import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';

interface CMSInitiativeType {
  _id: string;
  title: string;
  description?: string;
}

export default async function CMSInitiativesPage() {
  await connectDB();
  const initiatives = await Initiative.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <CMSPageHeader
        title="Initiatives"
        createHref="/cms/initiatives/new"
        createLabel="New Initiative"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initiatives.map((item: CMSInitiativeType) => (
              <tr
                key={item._id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-deep">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-xs">
                  {item.description ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <CMSRowActions
                    id={item._id.toString()}
                    editHref={`/cms/initiatives/${item._id}`}
                    apiRoute="/api/initiatives"
                    resourceName="initiatives"
                  />
                  {/* <Link
                    href={`/cms/initiatives/${item._id}`}
                    className="text-brand-teal hover:underline text-xs"
                  >
                    Edit
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initiatives.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-10">
            No initiatives yet. Create your first initiative.
          </p>
        )}
      </div>
    </div>
  );
}
