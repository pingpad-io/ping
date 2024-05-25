"use client";

import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Progress } from "./ui/video-progress";

export const VideoPlayer = ({ url }) => {
  const playerWithControlsRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);

  useEffect(() => {
    if (screenfull.isEnabled) {
      const onFullscreenChange = () => {
        if (playerWithControlsRef.current && screenfull.element === playerWithControlsRef.current) {
          setIsFullscreen(screenfull.isFullscreen);
        } else {
          setIsFullscreen(false);
        }
      };
      handleFullscreen();

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
    screenfull.toggle(player);
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  const handleSeekChange = (value: number) => {
    playerRef.current.seekTo(value / 100);
    setProgress(value);
  };

  return (
    <div
      ref={playerWithControlsRef}
      className={`relative w-full h-full flex justify-center items-center rounded-xl border ${
        isFullscreen ? "fullscreen" : ""
      }`}
      onClick={handleFullscreen}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handlePlayPause();
        }}
        className="w-fit h-fit bg-black/50"
        onKeyDown={(e) => {
          if (e.key === " ") {
            handlePlayPause();
          }
        }}
      >
        <ReactPlayer
          ref={playerRef}
          playing={playing}
          style={{
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
          onProgress={handleProgress}
          progressInterval={50}
          url={url}
          width="auto"
          height="auto"
          loop
          light={<div className="bg-black h-64 w-full opacity-50" />}
          muted={muted}
          controls={false} // disable default controls to use custom controls
        />
      </div>

      <div
        onKeyDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="z-10 w-full rounded-b-lg border-t transition-all absolute bottom-0 flex justify-between items-center backdrop-blur-sm text-secondary-foreground p-2 bg-secondary/50 cursor-pointer"
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
    </div>
  );
};
