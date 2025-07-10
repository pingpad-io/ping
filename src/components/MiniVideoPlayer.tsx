"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { PauseIcon, PlayIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  videoPlayingAtom,
  videoProgressPercentageAtom,
  videoDisplayTimeAtom,
  currentVideoAtom,
  miniVideoPlayerVisibleAtom,
  pauseVideoAtom,
  playVideoAtom,
  stopVideoAtom,
} from "../atoms/video";

export const MiniVideoPlayer = () => {
  const router = useRouter();

  const currentVideo = useAtomValue(currentVideoAtom);
  const isPlaying = useAtomValue(videoPlayingAtom);
  const progressPercentage = useAtomValue(videoProgressPercentageAtom);
  const displayTime = useAtomValue(videoDisplayTimeAtom);
  const isVisible = useAtomValue(miniVideoPlayerVisibleAtom);

  const pauseVideo = useSetAtom(pauseVideoAtom);
  const playVideo = useSetAtom(playVideoAtom);
  const stopVideo = useSetAtom(stopVideoAtom);

  console.log('Mini Video Player State:', { 
    currentVideo: currentVideo?.url, 
    isPlaying, 
    isVisible, 
    progressPercentage,
    postId: currentVideo?.postId 
  });


  const handlePlayPause = () => {
    if (!currentVideo) return;
    
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo(currentVideo);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // For now, just navigation since we're not managing video element here
    handleGoToPost();
  };

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
            className="fixed bottom-4 right-4 w-80 z-30 bg-gradient-to-r from-white/10 dark:from-zinc-800/50 overflow-hidden to-zinc-200/20 dark:to-zinc-900/50 backdrop-blur-md rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700"
          >
            <div 
              className="w-full h-1 bg-black/20 dark:bg-white/20 rounded-t-lg overflow-hidden cursor-pointer active:opacity-85"
              onClick={handleProgressClick}
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <button
              onClick={handleClose}
              className="absolute top-1.5 right-1 w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all z-10 hover:scale-125 active:scale-95 active:opacity-85"
            >
              <XIcon size={12} className="text-white" />
            </button>

            <div className="p-3">
              {/* Video thumbnail/preview */}
              <div 
                className="w-full h-32 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity mb-3 bg-black"
                onClick={handleGoToPost}
              >
                {currentVideo.preview ? (
                  <img 
                    src={currentVideo.preview} 
                    alt={currentVideo.title || "Video"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <PlayIcon className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              {/* Controls row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="w-9 h-9 rounded-full active:scale-95 hover:scale-105 transition-all duration-150 bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center active:opacity-85"
                >
                  {isPlaying ? (
                    <PauseIcon size={17} className="dark:text-white text-black" />
                  ) : (
                    <PlayIcon size={17} className="dark:text-white text-black ml-0.5" />
                  )}
                </button>

                <div 
                  className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleGoToPost}
                >
                  {currentVideo.title && (
                    <div className="dark:text-white text-black font-semibold text-sm truncate">
                      {currentVideo.title}
                    </div>
                  )}
                  <div className="dark:text-zinc-400 text-zinc-600 text-xs">
                    Video • {displayTime}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
};