'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CMSTopbar() {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-brand-teal transition-colors"
        >
          View site ↗
        </Link>
        <span className="text-sm text-gray-600">{session?.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/cms-login' })}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
