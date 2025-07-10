"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  audioDisplayTimeAtom,
  audioProgressPercentageAtom,
  currentAudioAtom,
  audioPlayingAtom,
  playAudioAtom,
  pauseAudioAtom,
  seekAudioAtom,
  toggleTimeDisplayAtom,
  hideMiniPlayerAtom,
  showMiniPlayerAtom,
  type AudioMetadata,
} from "../atoms/audio";

export const AudioPlayer = ({
  url,
  cover,
  author,
  title,
  postId,
}: {
  url: string;
  cover: string;
  author: string;
  title: string;
  postId?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const audioPlayerRef = useRef<HTMLDivElement>(null);

  const currentAudio = useAtomValue(currentAudioAtom);
  const isPlaying = useAtomValue(audioPlayingAtom);
  const progressPercentage = useAtomValue(audioProgressPercentageAtom);
  const displayTime = useAtomValue(audioDisplayTimeAtom);

  const playAudio = useSetAtom(playAudioAtom);
  const pauseAudio = useSetAtom(pauseAudioAtom);
  const seekAudio = useSetAtom(seekAudioAtom);
  const toggleTimeDisplay = useSetAtom(toggleTimeDisplayAtom);
  const hideMiniPlayer = useSetAtom(hideMiniPlayerAtom);
  const showMiniPlayer = useSetAtom(showMiniPlayerAtom);

  const isCurrentAudio = currentAudio?.url === url;
  const isCurrentlyPlaying = isCurrentAudio && isPlaying;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (audioPlayerRef.current) {
      observer.observe(audioPlayerRef.current);
    }

    return () => {
      if (audioPlayerRef.current) {
        observer.unobserve(audioPlayerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCurrentAudio) {
      if (isVisible) {
        hideMiniPlayer();
      } else if (currentAudio) {
        showMiniPlayer();
      }
    }
  }, [isCurrentAudio, isVisible, currentAudio, hideMiniPlayer, showMiniPlayer]);

  useEffect(() => {
    return () => {
      if (isCurrentAudio && currentAudio) {
        showMiniPlayer();
      }
    };
  }, [isCurrentAudio, currentAudio, showMiniPlayer]);

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pauseAudio();
    } else {
      const audioData: AudioMetadata = {
        url,
        title,
        artist: author,
        cover,
        postId: postId || '',
      };
      playAudio(audioData);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDragValue(value);
    setIsDragging(true);
  };

  const handleProgressMouseUp = () => {
    if (!isDragging || !currentAudio) return;

    const duration = currentAudio ? progressPercentage : 0;
    const newTime = (dragValue / 100) * duration;
    seekAudio(newTime);
    setIsDragging(false);
  };

  const currentProgressPercentage = isDragging ? dragValue : progressPercentage;

  return (
    <div ref={audioPlayerRef} className="w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-md overflow-hidden flex items-center gap-4 relative max-h-24">
      <div className="h-24 aspect-square overflow-hidden flex-shrink-0">
        <img 
          src={cover} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 pr-4 space-y-1">
        <div className="flex items-center gap-2">
          <div>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full select-none flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-95 hover:scale-105 transition-all duration-150 flex-shrink-0"
            >
              {isCurrentlyPlaying ? (
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
              style={{ width: `${currentProgressPercentage}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={currentProgressPercentage}
              onChange={handleProgressChange}
              onMouseUp={handleProgressMouseUp}
              onTouchEnd={handleProgressMouseUp}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer active:opacity-85"
              disabled={!isCurrentAudio}
            />
          </div>

          <button 
            onClick={toggleTimeDisplay}
            className="text-white text-sm font-mono hover:text-gray-300 transition-colors cursor-pointer select-none min-w-12 text-right"
            disabled={!isCurrentAudio}
          >
            {isCurrentAudio ? displayTime : "0:00"}
          </button>
        </div>
      </div>
    </div>
  );
};