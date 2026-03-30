import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Glowreeyah',
  description: 'Submit a booking or speaking engagement request.',
  openGraph: {
    title: 'Book Glowreeyah',
    description: 'Submit a booking or speaking engagement request.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Book Glowreeyah',
    description: 'Submit a booking or speaking engagement request.',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/booking`,
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
