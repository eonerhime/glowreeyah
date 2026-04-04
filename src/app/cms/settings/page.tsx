'use client';
import { useState, useEffect } from 'react';
import MediaPicker from '@/components/cms/MediaPicker';

interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroLogoUrl: string;
  homeIntro: string;
  musicPageHeading: string;
  blogPageHeading: string;
  mediaPageHeading: string;
  speakingPageHeading: string;
  impactPageHeading: string;
  bookingPageHeading: string;
  bookingPageSubtext: string;
  footerTagline: string;
}

const defaults: Settings = {
  heroTitle: '',
  heroSubtitle: '',
  heroImageUrl: '',
  heroLogoUrl: '',
  homeIntro: '',
  musicPageHeading: '',
  blogPageHeading: '',
  mediaPageHeading: '',
  speakingPageHeading: '',
  impactPageHeading: '',
  bookingPageHeading: '',
  bookingPageSubtext: '',
  footerTagline: '',
};

export default function CMSSettingsPage() {
  const [form, setForm] = useState<Settings>(defaults);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setForm(d.data);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  function field(label: string, key: keyof Settings, rows?: number) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {rows ? (
          <textarea
            rows={rows}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
        ) : (
          <input
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Site Settings
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Homepage
          </h2>
          <div className="space-y-4">
            {field('Hero Title', 'heroTitle')}
            {field('Hero Subtitle', 'heroSubtitle')}
            {field('Home Intro', 'homeIntro', 3)}
            <MediaPicker
              value={form.heroImageUrl}
              onChange={(url: string) =>
                setForm((f) => ({ ...f, heroImageUrl: url }))
              }
            />
            <MediaPicker
              value={form.heroLogoUrl}
              onChange={(url: string) =>
                setForm((f) => ({ ...f, heroLogoUrl: url }))
              }
            />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Page Headings
          </h2>
          <div className="space-y-4">
            {field('Music Page Heading', 'musicPageHeading')}
            {field('Blog Page Heading', 'blogPageHeading')}
            {field('Media Page Heading', 'mediaPageHeading')}
            {field('Speaking Page Heading', 'speakingPageHeading')}
            {field('Impact Page Heading', 'impactPageHeading')}
            {field('Booking Page Heading', 'bookingPageHeading')}
            {field('Booking Page Subtext', 'bookingPageSubtext', 2)}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Footer
          </h2>
          {field('Footer Tagline', 'footerTagline')}
        </section>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">Settings saved successfully.</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
