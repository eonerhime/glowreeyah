'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/cms/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/cms/posts', label: 'Posts', icon: '✎' },
  { href: '/cms/songs', label: 'Songs', icon: '♪' },
  { href: '/cms/albums', label: 'Albums', icon: '◉' },
  { href: '/cms/events', label: 'Events', icon: '◷' },
  { href: '/cms/initiatives', label: 'Initiatives', icon: '◈' },
  { href: '/cms/gallery', label: 'Gallery', icon: '🖼' },
  { href: '/cms/media', label: 'Media', icon: '⊡' },
  { href: '/cms/bookings', label: 'Bookings', icon: '✉' },
  { href: '/cms/tags', label: 'Tags', icon: '#' },
  { href: '/cms/artist', label: 'Artist Profile', icon: '✦' },
  { href: '/cms/settings', label: 'Site Settings', icon: '⚙' },
];

interface Props {
  pendingBookings?: number;
  open: boolean;
  onClose: () => void;
}

export default function CMSSidebar({
  pendingBookings = 0,
  open,
  onClose,
}: Props) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="w-56 bg-brand-deep text-white flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-brand-teal font-serif font-bold text-lg">
            Glowreeyah
          </span>
          <p className="text-white/40 text-xs mt-0.5">Content Studio</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden text-white/50 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const isBookings = item.href === '/cms/bookings';
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${
                  active
                    ? 'bg-brand-teal/20 text-brand-teal'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {isBookings && pendingBookings > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                  {pendingBookings > 99 ? '99+' : pendingBookings}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10 text-xs text-white/30">
        CMS v1.0
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — always visible */}
      <div className="hidden md:flex h-screen shrink-0">{sidebarContent}</div>

      {/* Mobile — slide-in drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 md:hidden flex">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
