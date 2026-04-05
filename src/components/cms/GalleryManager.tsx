'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface LinkedItem {
  _id: string;
  title: string;
}

interface Photo {
  _id: string;
  url: string;
  caption: string;
}

interface Video {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  platform: string;
}

interface Props {
  events: LinkedItem[];
  initiatives: LinkedItem[];
}

type Tab = 'events' | 'initiatives';

export default function GalleryManager({ events, initiatives }: Props) {
  const [tab, setTab] = useState<Tab>('events');
  const [selectedId, setSelectedId] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  // Upload state
  const [files, setFiles] = useState<FileList | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Video state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [addingVideo, setAddingVideo] = useState(false);

  const items = tab === 'events' ? events : initiatives;
  const linkedType = tab === 'events' ? 'event' : 'initiative';

  const loadMedia = useCallback(() => {
    if (!selectedId) return;
    fetch(`/api/gallery/photos?linkedType=${linkedType}&linkedId=${selectedId}`)
      .then((r) => r.json())
      .then((d) => setPhotos(d.data ?? []));
    fetch(`/api/gallery/videos?linkedType=${linkedType}&linkedId=${selectedId}`)
      .then((r) => r.json())
      .then((d) => setVideos(d.data ?? []));
  }, [selectedId, linkedType]);

  useEffect(() => {
    setSelectedId('');
    setPhotos([]);
    setVideos([]);
  }, [tab]);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  async function handleUpload() {
    if (!files?.length || !selectedId)
      return setUploadError('Select a destination and at least one file.');
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach((f, i) => {
        formData.append('files', f);
        formData.append('captions', captions[i] ?? '');
      });
      formData.append('linkedType', linkedType);
      formData.append('linkedId', selectedId);
      const res = await fetch('/api/gallery/photos', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setFiles(null);
      setCaptions([]);
      loadMedia();
    } catch (e: unknown) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleAddVideo() {
    if (!videoUrl || !selectedId) return;
    setAddingVideo(true);
    try {
      const res = await fetch('/api/gallery/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          caption: videoCaption,
          linkedType,
          linkedId: selectedId,
        }),
      });
      if (!res.ok) throw new Error('Failed to add video');
      setVideoUrl('');
      setVideoCaption('');
      loadMedia();
    } finally {
      setAddingVideo(false);
    }
  }

  async function deletePhoto(id: string) {
    if (!confirm('Delete this photo?')) return;
    await fetch(`/api/gallery/photos/${id}`, { method: 'DELETE' });
    loadMedia();
  }

  async function deleteVideo(id: string) {
    if (!confirm('Delete this video?')) return;
    await fetch(`/api/gallery/videos/${id}`, { method: 'DELETE' });
    loadMedia();
  }

  async function updateCaption(id: string, caption: string) {
    await fetch(`/api/gallery/photos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption }),
    });
    loadMedia();
  }

  const tabClass = (t: Tab) =>
    `px-5 py-2 text-sm font-medium border-b-2 transition-colors ${
      tab === t
        ? 'border-brand-teal text-brand-teal'
        : 'border-transparent text-gray-500 hover:text-brand-deep'
    }`;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button className={tabClass('events')} onClick={() => setTab('events')}>
          Events
        </button>
        <button
          className={tabClass('initiatives')}
          onClick={() => setTab('initiatives')}
        >
          Initiatives
        </button>
      </div>

      {/* Select event/initiative */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select {tab === 'events' ? 'Event' : 'Initiative'}
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm focus:ring-2 focus:ring-brand-teal outline-none"
        >
          <option value="">— Choose one —</option>
          {items.map((i) => (
            <option key={i._id} value={i._id}>
              {i.title}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <>
          {/* Upload photos */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h2 className="font-medium text-brand-deep">Upload Photos</h2>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                setFiles(e.target.files);
                setCaptions(Array.from(e.target.files ?? []).map(() => ''));
              }}
              className="text-sm text-gray-600"
            />
            {files &&
              Array.from(files).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 truncate w-40">
                    {f.name}
                  </span>
                  <input
                    placeholder="Caption (optional)"
                    value={captions[i] ?? ''}
                    onChange={(e) =>
                      setCaptions((c) => {
                        const next = [...c];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
                  />
                </div>
              ))}
            {uploadError && (
              <p className="text-red-500 text-xs">{uploadError}</p>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || !files?.length}
              className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {uploading
                ? 'Uploading…'
                : `Upload ${files?.length ?? 0} photo${files?.length !== 1 ? 's' : ''}`}
            </button>
          </div>

          {/* Add video */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
            <h2 className="font-medium text-brand-deep">Add Video Link</h2>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="YouTube or Vimeo URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
            />
            <input
              value={videoCaption}
              onChange={(e) => setVideoCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
            />
            <button
              onClick={handleAddVideo}
              disabled={addingVideo || !videoUrl}
              className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {addingVideo ? 'Adding…' : 'Add Video'}
            </button>
          </div>

          {/* Existing photos */}
          {photos.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-medium text-brand-deep mb-4">
                Photos ({photos.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div key={photo._id} className="relative group">
                    <Image
                      src={photo.url}
                      alt={photo.caption || 'Gallery photo'}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="mt-1">
                      <input
                        defaultValue={photo.caption}
                        onBlur={(e) => updateCaption(photo._id, e.target.value)}
                        placeholder="Add caption…"
                        className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-brand-teal outline-none"
                      />
                    </div>
                    <button
                      onClick={() => deletePhoto(photo._id)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing videos */}
          {videos.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h2 className="font-medium text-brand-deep mb-4">
                Videos ({videos.length})
              </h2>
              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="flex items-center gap-3 group"
                  >
                    {video.thumbnailUrl && (
                      <div className="relative w-20 h-12 shrink-0">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.caption || 'Video thumbnail'}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 truncate">
                        {video.videoUrl}
                      </p>
                      {video.caption && (
                        <p className="text-xs text-gray-400">{video.caption}</p>
                      )}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {video.platform}
                    </span>
                    <button
                      onClick={() => deleteVideo(video._id)}
                      className="text-red-400 text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length === 0 && videos.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No media yet for this {linkedType}.
            </p>
          )}
        </>
      )}
    </div>
  );
}
