import CMSPageHeader from '@/components/cms/CMSPageHeader';
import CMSRowActions from '@/components/cms/CMSRowActions';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import type { Types } from 'mongoose';

interface CMSInitiativeType {
  _id: Types.ObjectId;
  title: string;
  description?: string;
}

export default async function CMSInitiativesPage() {
  await connectDB();
  const initiatives = (await Initiative.find()
    .sort({ createdAt: -1 })
    .lean()) as CMSInitiativeType[];

  return (
    <div>
      <CMSPageHeader
        title="Initiatives"
        createHref="/cms/initiatives/new"
        createLabel="New Initiative"
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left w-1/3">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initiatives.map((item) => (
              <tr
                key={item._id.toString()}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-deep truncate">
                  {item.title}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <p className="line-clamp-1 overflow-hidden">
                    {item.description ?? '—'}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  <CMSRowActions
                    id={item._id.toString()}
                    editHref={`/cms/initiatives/${item._id}`}
                    apiRoute="/api/initiatives"
                    resourceName="initiatives"
                  />
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
