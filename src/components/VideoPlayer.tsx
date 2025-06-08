"use client";

import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Progress } from "./ui/video-progress";

export const VideoPlayer = ({ url, preview }: { url: string; preview: string }) => {
  const playerWithControlsRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const [shown, setShown] = useState(false);

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

  const handlePlayPause = () => {
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

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  const handleSeekChange = (value: number) => {
    playerRef.current.seekTo(value / 100);
    setProgress(value);
  };

  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (preview) {
      const img = new Image();
      img.src = preview;
      img.onload = () => setAspectRatio(img.height / img.width);
    } else {
      // Default aspect ratio for videos without preview (16:9)
      setAspectRatio(9 / 16);
    }
  }, [preview]);

  return (
    <div
      ref={playerWithControlsRef}
      className={`relative w-full flex justify-center items-center rounded-lg  overflow-hidden border ${
        isFullscreen ? "fullscreen" : "mt-2"
      }`}
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
        className="relative w-full"
        style={{ paddingTop: aspectRatio ? `${aspectRatio * 100}%` : undefined }}
      >
        {shown ? (
          <ReactPlayer
            ref={playerRef}
            playing={playing}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}
            onProgress={handleProgress}
            progressInterval={50}
            controls={false} // disable default controls to use custom controls
            muted={muted}
            height="100%"
            width="100%"
            url={url}
            loop
          />
        ) : (
          <div>
            {preview ? (
              <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="absolute inset-0 bg-muted rounded-xl" />
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
        )}
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
