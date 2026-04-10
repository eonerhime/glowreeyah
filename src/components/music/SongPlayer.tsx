'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SongType {
  _id: string;
  title: string;
  slug: string;
  audioUrl?: string;
}

interface Props {
  audioUrl: string;
  title: string;
  albumSlug: string;
  songs: SongType[];
  currentIndex: number;
}

export default function SongPlayer({
  audioUrl,
  title,
  albumSlug,
  songs,
  currentIndex,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Formatting utility consistent with AlbumPlayer
  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch((err) => {
        console.error('Playback failed:', err);
        setError('Playback failed.');
      });
      setPlaying(true);
    }
  }

  function handleTimeUpdate() {
    const el = audioRef.current;
    if (!el) return;
    setProgress(el.currentTime);
  }

  function handleLoadedMetadata() {
    const el = audioRef.current;
    if (!el) return;
    setDuration(el.duration);
    setError(null);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setProgress(t);
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }

  function handleError() {
    setError('Failed to load audio.');
    setPlaying(false);
  }

  // Navigation Logic using props
  function playPrev() {
    const prevSong = songs[currentIndex - 1];
    if (prevSong) {
      router.push(`/music/${albumSlug}/${prevSong.slug}`);
    }
  }

  function playNext() {
    const nextSong = songs[currentIndex + 1];
    if (nextSong) {
      router.push(`/music/${albumSlug}/${nextSong.slug}`);
    }
  }

  function handleEnded() {
    const nextSong = songs[currentIndex + 1];
    if (nextSong) {
      playNext();
    } else {
      setPlaying(false);
      setProgress(0);
    }
  }

  return (
    <div className="bg-brand-deep text-white rounded-xl p-5 shadow-2xl mt-6">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      {error && (
        <p className="text-red-400 text-xs mb-2 text-center">{error}</p>
      )}

      {/* Progress bar / Scrubber */}
      <input
        type="range"
        min={0}
        max={duration || 100}
        value={progress}
        onChange={handleSeek}
        className="w-full h-1 mb-4 accent-brand-teal cursor-pointer"
      />

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-white/50">
            {fmt(progress)} / {fmt(duration)}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={playPrev}
            disabled={currentIndex <= 0}
            className="text-white/60 hover:text-white disabled:opacity-20 transition-colors text-lg"
            aria-label="Previous"
          >
            ⏮
          </button>
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center hover:bg-brand-teal/90 transition-colors text-lg"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? '⏸' : '▶'}
          </button>
          <button
            onClick={playNext}
            disabled={currentIndex >= songs.length - 1}
            className="text-white/60 hover:text-white disabled:opacity-20 transition-colors text-lg"
            aria-label="Next"
          >
            ⏭
          </button>
        </div>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="text-white/50 text-sm">
            {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            className="w-20 h-1 accent-brand-teal cursor-pointer"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
