"use client";

import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
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

  const previewImage = (
    <>
      <div className="relative mt-2 w-full aspect-square">
        <Image className="object-cover border w-full h-full rounded-xl" src={preview} alt={"Preview"} fill />
      </div>
    </>
  );

  return (
    <div
      ref={playerWithControlsRef}
      className={`relative w-full h-full flex justify-center items-center rounded-xl border ${
        isFullscreen ? "fullscreen" : ""
      }`}
      onClick={handleFullscreen}
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
          handlePlayPause();
        }}
        className={shown ? "w-auto h-auto" : "w-full h-full"}
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
          light={previewImage}
          onProgress={handleProgress}
          progressInterval={50}
          onClickPreview={() => setShown(true)}
          controls={false} // disable default controls to use custom controls
          muted={muted}
          height="auto"
          width="auto"
          url={url}
          loop
        />
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
      )}
    </div>
  );
};
