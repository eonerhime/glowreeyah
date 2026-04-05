'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

interface Props {
  onMenuClick: () => void;
}

export default function CMSTopbar({ onMenuClick }: Props) {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden flex flex-col gap-1.5 p-1 text-gray-600 hover:text-brand-teal transition-colors"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-current" />
        <span className="block w-5 h-0.5 bg-current" />
        <span className="block w-5 h-0.5 bg-current" />
      </button>

      {/* Spacer on desktop */}
      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-brand-teal transition-colors"
        >
          View site ↗
        </Link>
        <span className="hidden sm:inline text-sm text-gray-600">
          {session?.user?.email}
        </span>
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
