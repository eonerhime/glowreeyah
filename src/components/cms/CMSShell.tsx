'use client';
import { SessionProvider } from 'next-auth/react';
import CMSSidebar from '@/components/cms/CMSSidebar';
import CMSTopbar from '@/components/cms/CMSTopbar';

interface Props {
  children: React.ReactNode;
  pendingBookings: number;
}

export default function CMSShell({ children, pendingBookings }: Props) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <CMSSidebar pendingBookings={pendingBookings} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <CMSTopbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
