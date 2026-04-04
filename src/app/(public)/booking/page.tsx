'use client';
import { useState } from 'react';

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    eventType: '',
    eventDate: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setForm({
        name: '',
        email: '',
        organisation: '',
        eventType: '',
        eventDate: '',
        message: '',
      });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-brand-deep mb-4">
        Book Glowreeyah
      </h1>
      <p className="text-gray-600 mb-10">
        Fill in the form below and we will be in touch shortly.
      </p>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <p className="text-3xl mb-3">🎉</p>
          <h2 className="font-serif text-2xl text-brand-deep mb-2">
            Request submitted!
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Thank you for reaching out. We&apos;ll review your request and get
            back to you shortly.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-brand-teal text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors cursor-pointer"
          >
            Make another booking request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              required: true,
            },
            {
              name: 'organisation',
              label: 'Organisation',
              type: 'text',
              required: false,
            },
            {
              name: 'eventType',
              label: 'Type of Event',
              type: 'text',
              required: false,
            },
            {
              name: 'eventDate',
              label: 'Preferred Date',
              type: 'date',
              required: false,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                required={field.required}
                value={form[field.name as keyof typeof form]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field.name]: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-sm">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-brand-teal text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
          >
            {status === 'sending' ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
}
