import Link from 'next/link';

const links = [
  { href: '/about', label: 'About' },
  { href: '/music', label: 'Music' },
  { href: '/blog', label: 'Blog' },
  { href: '/media', label: 'Media' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/impact', label: 'Impact' },
  { href: '/contact', label: 'Contact' },
  { href: '/booking', label: 'Book' },
];

const socials = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://youtube.com', label: 'YouTube' },
  { href: 'https://spotify.com', label: 'Spotify' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-deep text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-serif text-2xl text-brand-teal font-bold mb-3">
            Glowreeyah
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Music. Ministry. Movement.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
            Navigate
          </p>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/70 hover:text-brand-teal transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
            Connect
          </p>
          <ul className="space-y-2">
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-brand-teal transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} Glowreeyah. All rights reserved.
        </p>
        <p className="text-xs text-white/30">Built with purpose.</p>
      </div>
    </footer>
  );
}
