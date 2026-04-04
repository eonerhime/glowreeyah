'use client';

import { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  socialHandle: string;
  subject: string;
  message: string;
}

const empty: FormState = {
  name: '',
  email: '',
  phone: '',
  socialHandle: '',
  subject: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data.error));
      setSuccess(true);
      setForm(empty);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="bg-brand-teal/10 border border-brand-teal rounded-xl p-8 text-center">
        <p className="text-2xl mb-2">✉️</p>
        <p className="font-serif text-xl text-brand-deep mb-1">
          Message received!
        </p>
        <p className="text-gray-500 text-sm">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-brand-teal hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-teal outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            value={form.name}
            onChange={set('name')}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social handle
          </label>
          <input
            value={form.socialHandle}
            onChange={set('socialHandle')}
            placeholder="@yourhandle"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          value={form.subject}
          onChange={set('subject')}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={set('message')}
          required
          className={inputClass}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-brand-teal text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {sending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
