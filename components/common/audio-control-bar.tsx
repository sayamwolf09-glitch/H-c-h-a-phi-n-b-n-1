"use client";

import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

type Props = {
  src?: string;
};

export function AudioControlBar({ src = "/audio/chemplay-theme.mp3" }: Props) {
  const soundRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);

  useEffect(() => {
    soundRef.current = new Howl({ src: [src], loop: true, volume });
    return () => {
      soundRef.current?.unload();
    };
  }, [src]);

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!soundRef.current) return;
    const next = !isMuted;
    soundRef.current.mute(next);
    setIsMuted(next);
  };

  const onVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    if (!soundRef.current) return;
    soundRef.current.volume(nextVolume);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-chem-border chem-glass p-3 shadow-card">
      <button onClick={togglePlay} className="rounded-xl bg-chem-primary p-2 text-white">
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button onClick={toggleMute} className="rounded-xl border border-chem-border p-2 text-chem-text">
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="flex min-w-44 flex-1 items-center gap-2">
        <span className="text-sm font-semibold text-chem-muted">Âm lượng</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
