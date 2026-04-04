'use client';
import { useState, useEffect } from 'react';
import MediaPicker from '@/components/cms/MediaPicker';
import CharCountInput from '@/components/cms/CharCountInput';
import slugify from 'slugify';

interface ArtistData {
  _id?: string;
  name: string;
  slugName: string;
  biographyShort: string;
  biographyMedium: string;
  biographyLong: string;
  achievements: string;
  speakingProfile: string;
  profileImageUrl: string;
  instagram: string;
  youtube: string;
  spotify: string;
  twitter: string;
}

const empty: ArtistData = {
  name: '',
  slugName: '',
  biographyShort: '',
  biographyMedium: '',
  biographyLong: '',
  achievements: '',
  speakingProfile: '',
  profileImageUrl: '',
  instagram: '',
  youtube: '',
  spotify: '',
  twitter: '',
};

export default function CMSArtistPage() {
  const [form, setForm] = useState<ArtistData>(empty);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/artists')
      .then((r) => r.json())
      .then((d) => {
        if (d.data) {
          const a = d.data;
          setForm({
            _id: a._id,
            name: a.name ?? '',
            slugName: a.slugName ?? '',
            biographyShort: a.biographyShort ?? '',
            biographyMedium: a.biographyMedium ?? '',
            biographyLong: a.biographyLong ?? '',
            achievements: (a.achievements ?? []).join('\n'),
            speakingProfile: a.speakingProfile ?? '',
            profileImageUrl: a.profileImageUrl ?? '',
            instagram: a.socialLinks?.instagram ?? '',
            youtube: a.socialLinks?.youtube ?? '',
            spotify: a.socialLinks?.spotify ?? '',
            twitter: a.socialLinks?.twitter ?? '',
          });
        }
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess(false);

    const payload = {
      name: form.name,
      slugName: slugify(form.name, { lower: true, strict: true }),
      biographyShort: form.biographyShort,
      biographyMedium: form.biographyMedium,
      biographyLong: form.biographyLong,
      achievements: form.achievements.split('\n').filter(Boolean),
      speakingProfile: form.speakingProfile,
      profileImageUrl: form.profileImageUrl,
      socialLinks: {
        instagram: form.instagram,
        youtube: form.youtube,
        spotify: form.spotify,
        twitter: form.twitter,
      },
    };

    try {
      const url = form._id ? `/api/artists/${form._id}` : '/api/artists';
      const method = form._id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface the actual error from the API response
        const message = data?.error
          ? JSON.stringify(data.error)
          : `HTTP ${res.status} — ${res.statusText}`;
        throw new Error(message);
      }

      setForm((prev) => ({ ...prev, _id: data.data._id }));
      setSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  function field(
    label: string,
    key: keyof ArtistData,
    options?: { rows?: number; hint?: string }
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {options?.rows ? (
          <textarea
            rows={options.rows}
            value={form[key] as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
        ) : (
          <input
            value={form[key] as string}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
          />
        )}
        {options?.hint && (
          <p className="text-xs text-gray-400 mt-1">{options.hint}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">
        Artist Profile
      </h1>

      <div className="space-y-6">
        {field('Name', 'name')}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            value={slugify(form.name, { lower: true, strict: true })}
            disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">
            Auto-generated from name — not editable
          </p>
        </div>

        <MediaPicker
          value={form.profileImageUrl}
          onChange={(url: string) =>
            setForm((f) => ({ ...f, profileImageUrl: url }))
          }
        />

        <CharCountInput
          label="Biography (Short)"
          value={form.biographyShort}
          maxLength={160}
          onChange={(v) => setForm((f) => ({ ...f, biographyShort: v }))}
        />

        <CharCountInput
          label="Biography (Medium)"
          value={form.biographyMedium}
          maxLength={500}
          rows={3}
          onChange={(v) => setForm((f) => ({ ...f, biographyMedium: v }))}
        />
        {field('Biography (Full)', 'biographyLong', { rows: 8 })}
        {field('Achievements', 'achievements', {
          rows: 5,
          hint: 'One achievement per line',
        })}
        {field('Speaking Profile', 'speakingProfile', { rows: 4 })}

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Social Links</p>
          <div className="space-y-3">
            {field('Instagram URL', 'instagram')}
            {field('YouTube URL', 'youtube')}
            {field('Spotify URL', 'spotify')}
            {field('Twitter URL', 'twitter')}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">Profile saved successfully.</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : form._id ? 'Save Changes' : 'Create Profile'}
        </button>
      </div>
    </div>
  );
}
