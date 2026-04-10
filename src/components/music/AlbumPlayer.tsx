'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SongCard, { type SongType } from '@/components/music/SongCard';

interface Props {
  songs: SongType[];
  albumSlug: string;
}

export default function AlbumPlayer({ songs, albumSlug }: Props) {
  const [nowPlaying, setNowPlaying] = useState<SongType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playNext = useCallback(() => {
    if (!nowPlaying) return;
    const idx = songs.findIndex((s) => s._id === nowPlaying._id);
    const next = songs[idx + 1];
    if (next?.audioUrl) {
      setNowPlaying(next);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [nowPlaying, songs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying?.audioUrl) return;

    const onCanPlay = () => {
      setError(null);
      audio.play().catch((err) => {
        console.error('Playback failed:', err);
        setError('Playback failed. Check the audio URL or format.');
        setIsPlaying(false);
      });
    };
    let lastUpdate = 0;
    const onTimeUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate > 500) {
        setProgress(audio.currentTime);
        lastUpdate = now;
      }
    };

    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => playNext();
    const onError = () => {
      const msg =
        audio.error?.code === 4
          ? 'Audio format not supported by this browser.'
          : 'Failed to load audio.';
      setError(msg);
      setIsPlaying(false);
    };

    audio.src = nowPlaying.audioUrl;
    audio.load();
    audio.addEventListener('canplay', onCanPlay, { once: true });
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [nowPlaying, playNext]);

  function handlePlay(song: SongType) {
    if (!song.audioUrl) return;
    setError(null);
    if (nowPlaying?._id === song._id) {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(console.error);
        setIsPlaying(true);
      }
      return;
    }
    setNowPlaying(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(0);
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = t;
    setProgress(t);
  }

  function fmt(s: number) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function playPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }

  function playPrev() {
    if (!nowPlaying) return;
    const idx = songs.findIndex((s) => s._id === nowPlaying._id);
    const prev = songs[idx - 1];
    if (prev?.audioUrl) {
      setNowPlaying(prev);
      setIsPlaying(true);
    }
  }

  function playNextBtn() {
    playNext();
    setIsPlaying(true);
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }
  const currentIdx = songs.findIndex((s) => s._id === nowPlaying?._id);

  return (
    <>
      {/* Song list */}
      <div className="space-y-3">
        {songs.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            onPlay={handlePlay}
            nowPlaying={isPlaying ? (nowPlaying?._id ?? null) : null}
            albumSlug={albumSlug}
          />
        ))}
        {songs.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-10">
            No songs published yet.
          </p>
        )}
      </div>

      {/* Floating player */}
      {nowPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-deep text-white px-4 py-3 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            {error && (
              <p className="text-red-400 text-xs mb-2 text-center">{error}</p>
            )}
            {/* Progress bar */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={seek}
              className="w-full h-1 mb-2 accent-brand-teal cursor-pointer"
            />

            {/* Controls row */}
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {nowPlaying.title}
                </p>
                <p className="text-xs text-white/50">
                  {fmt(progress)} / {fmt(duration)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={playPrev}
                  disabled={currentIdx <= 0}
                  className="text-white/60 hover:text-white disabled:opacity-30 transition-colors text-lg"
                  aria-label="Previous"
                >
                  ⏮
                </button>
                <button
                  onClick={playPause}
                  className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center hover:bg-brand-teal/90 transition-colors text-lg"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  onClick={playNextBtn}
                  disabled={currentIdx >= songs.length - 1}
                  className="text-white/60 hover:text-white disabled:opacity-30 transition-colors text-lg"
                  aria-label="Next"
                >
                  ⏭
                </button>
              </div>

              {/* Volume */}
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

              <button
                onClick={() => {
                  audioRef.current?.pause();
                  setNowPlaying(null);
                  setIsPlaying(false);
                  setProgress(0);
                }}
                className="text-white/40 hover:text-white transition-colors text-sm shrink-0"
                aria-label="Close player"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
