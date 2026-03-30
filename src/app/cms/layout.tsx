import CMSSidebar from '@/components/cms/CMSSidebar';
import CMSTopbar from '@/components/cms/CMSTopbar';

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <CMSSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CMSTopbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
