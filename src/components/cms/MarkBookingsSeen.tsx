'use client';
import { useEffect } from 'react';

export default function MarkBookingsSeen() {
  useEffect(() => {
    fetch('/api/cms/bookings-seen', { method: 'POST' });
  }, []);

  return null;
}
