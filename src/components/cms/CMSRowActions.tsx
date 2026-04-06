'use client';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  id: string;
  editHref: string;
  apiRoute: string;
  resourceName?: string;
}

export default function CMSRowActions({
  id,
  editHref,
  apiRoute,
  resourceName = 'item',
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete this ${resourceName}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiRoute}/${id}`, { method: 'DELETE' });
      console.log('DELETE URL:', `${apiRoute}/${id}`);
      if (!res.ok) throw new Error('Delete failed');
      setDeleted(true);
      // Force navigation to same page — bypasses cache
      window.location.href = window.location.pathname;
    } catch (e) {
      console.error('Delete error:', e);
      alert(`Failed to delete ${resourceName}. Please try again.`);
      setDeleting(false);
    }
  }

  if (deleted) return null;

  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={editHref}
        className="text-brand-teal hover:underline text-xs cursor-pointer"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-red-400 hover:text-red-600 hover:underline text-xs disabled:opacity-50 transition-colors cursor-pointer"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
