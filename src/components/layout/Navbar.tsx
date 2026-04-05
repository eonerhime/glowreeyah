'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/events', label: 'Events' },
  { href: '/impact', label: 'Impact' },
  { href: '/booking', label: 'Book' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-deep text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-brand-teal font-serif text-xl font-bold">
        <Image
          src="/glowreeyah.png"
          alt="Glowreeyah Braimah Logo"
          width={100}
          height={20}
          quality={75}
          priority
          className="dark:invert h-12 w-auto object-contain mb-6 z-50"
        />
      </Link>
      <ul className="hidden md:flex gap-6 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="hover:text-brand-teal transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {open && (
        <ul className="absolute top-full left-0 w-full bg-brand-deep flex flex-col gap-4 px-6 py-4 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="hover:text-brand-gold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
