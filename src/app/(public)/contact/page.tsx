import ContactForm from '@/components/contact/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Glowreeyah',
  description:
    'Get in touch with Glowreeyah for bookings, collaborations, or general enquiries.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact` },
};

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/glowreeyah',
    handle: '@glowreeyah',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@glowreeyah',
    handle: 'Glowreeyah',
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/glowreeyah',
    handle: 'Glowreeyah',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Header */}
      <section className="bg-brand-deep text-white py-20 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-brand-teal mb-3">
          Get in touch
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Contact</h1>
        <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
          Whether it&apos;s a booking enquiry, a collaboration idea, or simply
          saying hello — we&apos;d love to hear from you.
        </p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-serif text-2xl text-brand-deep mb-6">
              Send a message
            </h2>
            <ContactForm />
          </div>

          {/* Social handles + info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-brand-deep mb-4">
                Connect online
              </h2>
              <ul className="space-y-4">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group"
                    >
                      <span className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal text-xs font-bold group-hover:bg-brand-teal group-hover:text-white transition-colors">
                        {s.label[0]}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-brand-deep group-hover:text-brand-teal transition-colors">
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400">{s.handle}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-brand-deep text-white rounded-2xl p-6">
              <p className="font-serif text-lg mb-2">
                Looking to book Glowreeyah?
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                For speaking engagements, concerts, and ministry events, use the
                dedicated booking form.
              </p>

              <a
                href="/booking"
                className="inline-block bg-brand-teal text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
              >
                Go to Booking →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
