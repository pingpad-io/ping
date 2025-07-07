"use client";

import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { useVideoState } from "../hooks/useVideoState";
import { Progress } from "./ui/video-progress";

// when a video has no preview, we generate a thumbnail from the video
const generateVideoThumbnail = (videoUrl: string): Promise<{ thumbnail: string; aspectRatio: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.crossOrigin = 'anonymous';
    video.muted = true;
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0; // Seek to 1 second
    };
    
    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        const aspectRatio = video.videoHeight / video.videoWidth;
        resolve({ thumbnail, aspectRatio });
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    video.onerror = (error) => {
      reject(new Error(`Video loading failed: ${error}`));
    };
    
    video.src = videoUrl;
  });
};

export const VideoPlayer = ({ url, preview }: { url: string; preview: string }) => {
  const playerWithControlsRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const [shown, setShown] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  
  const videoId = useRef(`video-${Math.random().toString(36).substr(2, 9)}`).current;
  const { registerPlayer, pauseAllOtherVideos } = useVideoState(videoId);

  useEffect(() => {
    if (screenfull.isEnabled) {
      const onFullscreenChange = () => {
        if (playerWithControlsRef.current && screenfull.element === playerWithControlsRef.current) {
          setIsFullscreen(screenfull.isFullscreen);
        } else {
          setIsFullscreen(false);
        }
      };

      screenfull.on("change", onFullscreenChange);

      return () => {
        screenfull.off("change", onFullscreenChange);
      };
    }
  }, []);

  useEffect(() => {
    registerPlayer(() => {
      setPlaying(false);
    });
  }, [registerPlayer]);

  const handlePlayPause = () => {
    if (!playing) {
      pauseAllOtherVideos();
    }
    setPlaying(!playing);
    setMuted(false);
  };

  const handleFullscreen = () => {
    if (!screenfull.isEnabled || !playerWithControlsRef.current) {
      return;
    }
    const player = playerWithControlsRef.current;
    screenfull.toggle(player, { navigationUI: "hide" }).catch((error) => {
      console.error("Error toggling fullscreen:", error);
    });
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  const handleSeekChange = (value: number) => {
    playerRef.current.seekTo(value / 100);
    setProgress(value);
  };

  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.src = preview;
    } 
  }, [preview]);

  useEffect(() => {
    if (!preview && url && !generatedThumbnail) {
      generateVideoThumbnail(url)
        .then(({ thumbnail }) => {
          setGeneratedThumbnail(thumbnail);
        })
    }
  }, [url, preview, generatedThumbnail]);

  return (
    <div
      ref={playerWithControlsRef}
      className={`relative flex justify-center items-center rounded-lg overflow-hidden border ${
        isFullscreen && "w-full"
      } ${preview !== "" ? "w-full h-500px" : "h-[300px]"}`} 
      onClick={() => {
        if (isFullscreen) handleFullscreen();
      }}
      onKeyDown={(e) => {
        if (e.key === "f") {
          handleFullscreen();
        }
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!shown) {
            setShown(true);
          }
          handlePlayPause();
        }}
        onKeyDown={(e) => {
          if (e.key === " ") {
            handlePlayPause();
          }
        }}
        className={`relative h-full flex flex-col ${preview !== "" ? "w-full" : ""}`} // preview (string) is empty when the video is part of a media gallery
      >
        <div className="relative flex-1">
          <div className={`${isFullscreen ? "fixed" : "absolute"} inset-0`}>
            {shown && (
              <ReactPlayer
              ref={playerRef}
              playing={playing}
              onProgress={handleProgress}
              progressInterval={50}
              controls={false} // disable default controls to use custom controls
              muted={muted}
              height={isFullscreen ? "100%" : preview !== "" ? "100%" : "300px"}
              width="100%"
              url={url}
              loop
              />
            )}
          </div>
          <div className={`${shown ? "opacity-0" : "opacity-100"} transition-opacity flex items-center justify-center relative h-full w-full`}>
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover rounded-xl mx-auto" />
            ) : generatedThumbnail ? (
              <img src={generatedThumbnail} alt="" className="h-[300px] rounded-xl" />
            ) : (
              <div className="absolute inset-0 bg-muted rounded-xl flex items-center justify-center">
                <VideoIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
              <button
                type="button"
                className="flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShown(true);
                  handlePlayPause();
                }}
                >
                <PlayIcon className="w-8 h-8 text-primary fill-primary ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {shown && (
        <div
          onKeyDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="z-10 w-full border-t transition-all absolute bottom-0 flex justify-between items-center backdrop-blur-sm text-secondary-foreground p-2 bg-secondary/50 cursor-pointer"
        >
          <button type="button" onClick={handlePlayPause}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <Progress
            ref={progressRef}
            onChange={handleSeekChange}
            playing={playing}
            setPlaying={setPlaying}
            className="mx-2 h-2"
            value={progress}
          />
          {screenfull.isEnabled && (
            <button type="button" onClick={handleFullscreen}>
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
