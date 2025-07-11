"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  currentVideoAtom,
  miniVideoPlayerVisibleAtom,
  stopVideoAtom,
  videoCurrentTimeAtom,
  videoPlayingAtom,
} from "../atoms/video";

export const MiniVideoPlayer = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = useAtomValue(currentVideoAtom);
  const isVisible = useAtomValue(miniVideoPlayerVisibleAtom);
  const currentTime = useAtomValue(videoCurrentTimeAtom);
  const isPlaying = useAtomValue(videoPlayingAtom);

  const stopVideo = useSetAtom(stopVideoAtom);

  useEffect(() => {
    if (videoRef.current && currentVideo && isVisible) {
      const videoElement = videoRef.current;
      
      const handleLoadedMetadata = () => {
        if (currentTime > 0) {
          videoElement.currentTime = currentTime;
        }
        
        if (isPlaying) {
          videoElement.play().catch(() => {
          });
        }
      };
      
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      if (videoElement.readyState >= 1) {
        handleLoadedMetadata();
      }
      
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [currentVideo, isVisible]);

  useEffect(() => {
    if (videoRef.current && isPlaying && currentTime >= 0) {
      const videoElement = videoRef.current;
      
      const syncTime = () => {
        const timeDiff = Math.abs(videoElement.currentTime - currentTime);
        
        if (timeDiff > 0.2) {
          videoElement.currentTime = currentTime;
        }
      };
      
      const interval = setInterval(syncTime, 100);
      
      return () => clearInterval(interval);
    }
  }, [currentTime, isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      
      if (isPlaying) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            videoElement.muted = true;
            videoElement.play().catch(() => {
              // Ignore if still fails
            });
          });
        }
      } else {
        videoElement.pause();
      }
    }
  }, [isPlaying]);

  const handleGoToPost = () => {
    if (currentVideo?.postId) {
      router.push(`/p/${currentVideo.postId}`);
    }
  };

  const handleClose = () => {
    stopVideo();
  };

  return (
    <AnimatePresence>
      {(isVisible && currentVideo) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-4 w-80 z-30 bg-gradient-to-r from-white/10 dark:from-zinc-800/50 overflow-hidden to-zinc-200/20 dark:to-zinc-900/50 backdrop-blur-md rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700"
          >

            <button
              onClick={handleClose}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all z-10 hover:scale-125 active:scale-95 active:opacity-85"
            >
              <XIcon size={12} className="text-white" />
            </button>

            <div className="p-0">
              <div 
                className="w-full h-32 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-black"
                onClick={handleGoToPost}
              >
                <video
                  ref={videoRef}
                  src={currentVideo.url}
                  poster={currentVideo.preview}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  controls={false}
                />
              </div>

              <div 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleGoToPost}
              >
                {currentVideo.title && (
                  <div className="dark:text-white text-black font-semibold text-sm truncate">
                    {currentVideo.title}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};