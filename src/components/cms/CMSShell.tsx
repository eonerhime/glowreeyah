'use client';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import CMSTopbar from '@/components/cms/CMSTopbar';

interface Props {
  children: React.ReactNode;
  pendingBookings: number;
}

export default function CMSShell({ children, pendingBookings }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <CMSSidebar
          pendingBookings={pendingBookings}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <CMSTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
