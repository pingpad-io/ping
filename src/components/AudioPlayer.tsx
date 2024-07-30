"use client";

import { MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Button } from "./ui/button";
import { Progress } from "./ui/video-progress";

export const AudioPlayer = ({
  url,
  cover,
  author,
  title,
}: { url: string; cover: string; author: string; title: string }) => {
  const playerWithControlsRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);
  const [shown, setShown] = useState(false);

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
      <div className="relative w-full aspect-square">
        <img className="object-cover border w-full h-full rounded-xl" src={cover} alt={"Preview"} />
      </div>
    </>
  );

  return (
    <div
      ref={playerWithControlsRef}
      className={"relative w-full h-full flex justify-center items-center rounded-xl border"}
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
          height="80px"
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
          className="z-10 w-full transition-all absolute bottom-0 flex justify-between items-center backdrop-blur-sm 
          text-secondary-foreground p-2 cursor-pointer h-full"
        >
          <div className="flex justify-center items-center">
            {/* <img alt="" src={cover} className="h-[50%] min-h-10 w-auto ratio-square" /> */}
            <Button variant="outline" onClick={handlePlayPause} className="z-[15]">
              {playing ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
            </Button>
          </div>

          <Progress
            ref={progressRef}
            onChange={handleSeekChange}
            playing={playing}
            setPlaying={setPlaying}
            className="mx-2 h-4"
            value={progress}
          />
        </div>
      )}
    </div>
  );
};
