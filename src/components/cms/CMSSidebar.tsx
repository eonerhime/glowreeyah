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
  { href: '/cms/media', label: 'Media', icon: '⊡' },
  { href: '/cms/bookings', label: 'Bookings', icon: '✉' },
  { href: '/cms/tags', label: 'Tags', icon: '#' },
  { href: '/cms/artist', label: 'Artist Profile', icon: '✦' },
];

export default function CMSSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-brand-deep text-white flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-brand-teal font-serif font-bold text-lg">
          Glowreeyah
        </span>
        <p className="text-white/40 text-xs mt-0.5">Content Studio</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${
                  active
                    ? 'bg-brand-teal/20 text-brand-teal'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10 text-xs text-white/30">
        CMS v1.0
      </div>
    </aside>
  );
}
