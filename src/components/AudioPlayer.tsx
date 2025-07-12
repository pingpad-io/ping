"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const AudioPlayer = ({
  url,
  cover,
  author,
  title,
}: {
  url: string;
  cover: string;
  author: string;
  title: string;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const [showTimeRemaining, setShowTimeRemaining] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: author,
        artwork: [
          {
            src: cover,
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: cover,
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: cover,
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: cover,
            sizes: "96x96",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        const audio = audioRef.current;
        if (audio) {
          audio.play();
          setPlaying(true);
        }
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          setPlaying(false);
        }
      });

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const audio = audioRef.current;
        if (audio) {
          const skipTime = details.seekOffset || 10;
          audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const audio = audioRef.current;
        if (audio) {
          const skipTime = details.seekOffset || 10;
          audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
        }
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        const audio = audioRef.current;
        if (audio && details.seekTime !== undefined) {
          audio.currentTime = details.seekTime;
        }
      });
    }
  }, [title, author, cover]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
  }, [playing]);

  useEffect(() => {
    if ("mediaSession" in navigator && "setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: currentTime,
      });
    }
  }, [currentTime, duration]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value);
    setDragValue(value);
    setIsDragging(true);
  };

  const handleProgressMouseUp = () => {
    if (!isDragging) return;

    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (dragValue / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setIsDragging(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const toggleTimeDisplay = () => {
    setShowTimeRemaining(!showTimeRemaining);
  };

  const getDisplayTime = () => {
    if (showTimeRemaining) {
      const remaining = duration - currentTime;
      return `-${formatTime(remaining)}`;
    }
    return formatTime(currentTime);
  };

  const progressPercentage = isDragging ? dragValue : duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-md overflow-hidden flex items-center gap-4 relative max-h-24">
      <audio ref={audioRef} src={url} loop />

      <div className="h-24 aspect-square overflow-hidden flex-shrink-0">
        <img src={cover} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0 pr-4 space-y-1">
        <div className="flex items-center gap-2">
          <div>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full select-none flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-95 hover:scale-105 transition-all duration-150 flex-shrink-0"
            >
              {playing ? (
                <PauseIcon size={24} className="text-white" />
              ) : (
                <PlayIcon size={24} className="text-white ml-1" />
              )}
            </button>
          </div>

          <div className="text-white mb-1">
            <div className="font-semibold text-lg truncate">{title}</div>
            <div className="text-gray-400 text-sm truncate">{author}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={progressPercentage}
              onChange={handleProgressChange}
              onMouseUp={handleProgressMouseUp}
              onTouchEnd={handleProgressMouseUp}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer active:opacity-85"
            />
          </div>

          <button
            onClick={toggleTimeDisplay}
            className="text-white text-sm font-mono hover:text-gray-300 transition-colors cursor-pointer select-none min-w-12 text-right"
          >
            {getDisplayTime()}
          </button>
        </div>
      </div>
    </div>
  );
};
