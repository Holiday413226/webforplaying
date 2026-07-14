"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Mic, Loader2 } from "lucide-react";

interface VoicePlayerProps {
  audioUrl: string | null;
  duration?: number | null;
}

export function VoicePlayer({ audioUrl, duration }: VoicePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioUrl) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mic className="h-4 w-4" />
        暂无语音介绍
      </div>
    );
  }

  function togglePlay() {
    if (!audioRef.current) {
      const audio = new Audio(audioUrl!);
      audioRef.current = audio;

      audio.addEventListener("loadeddata", () => {
        setLoading(false);
        audio.play();
        setPlaying(true);
      });

      audio.addEventListener("ended", () => {
        setPlaying(false);
      });

      audio.addEventListener("error", () => {
        setLoading(false);
        setError(true);
      });

      setLoading(true);
      audio.load();
    } else {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <Mic className="h-4 w-4" />
        语音加载失败
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={togglePlay}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : playing ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
      <div>
        <div className="flex items-center gap-2 font-medium">
          <Mic className="h-4 w-4 text-pink-500" />
          语音介绍
        </div>
        {duration && (
          <p className="text-sm text-muted-foreground">{Math.round(duration)}秒</p>
        )}
      </div>
    </div>
  );
}