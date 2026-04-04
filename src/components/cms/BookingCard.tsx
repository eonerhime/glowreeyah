'use client';
import { useState } from 'react';

interface Booking {
  _id: string;
  name: string;
  email: string;
  organisation?: string;
  eventType?: string;
  eventDate?: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusColours: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
};

const STATUSES = ['pending', 'reviewed', 'accepted', 'declined'] as const;

export default function BookingCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(booking.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  async function updateStatus(next: string) {
    if (next === status) return;
    setUpdating(true);
    setError('');
    try {
      const res = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Failed to update');
      setStatus(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary row — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <p className="font-medium text-brand-deep truncate">
              {booking.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {booking.email}
              {booking.organisation && ` · ${booking.organisation}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${statusColours[status] ?? 'bg-gray-100 text-gray-500'}`}
          >
            {status}
          </span>
          <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-brand-deep">{booking.email}</p>
            </div>
            {booking.organisation && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Organisation</p>
                <p className="text-brand-deep">{booking.organisation}</p>
              </div>
            )}
            {booking.eventType && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Event type</p>
                <p className="text-brand-deep">{booking.eventType}</p>
              </div>
            )}
            {booking.eventDate && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Event date</p>
                <p className="text-brand-deep">{booking.eventDate}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Submitted</p>
              <p className="text-brand-deep">
                {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-1">Message</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {booking.message}
            </p>
          </div>

          {/* Status actions */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Update status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating || s === status}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40 cursor-pointer
                    ${
                      s === status
                        ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                        : 'border-gray-300 text-gray-600 hover:border-brand-teal hover:text-brand-teal'
                    }`}
                >
                  {updating && s !== status ? '…' : s}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            {['accepted', 'declined', 'reviewed'].includes(status) && (
              <p className="text-xs text-gray-400 mt-2">
                ✉️ An email notification was sent to {booking.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
