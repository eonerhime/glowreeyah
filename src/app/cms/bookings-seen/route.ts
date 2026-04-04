import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('bookings_last_seen', new Date().toISOString(), {
    httpOnly: true,
    path: '/',
  });
  return NextResponse.json({ ok: true });
}
