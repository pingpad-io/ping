"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Progress } from "./ui/video-progress";

export const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(true);

  const handlePlayPause = () => {
    setPlaying(!playing);
    setMuted(false);
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  const handleSeekChange = (value: number) => {
    playerRef.current.seekTo(value / 100);
    setProgress(value);
  };

  return (
    <div className="relative rounded-xl w-full border">
      <div
        onClick={handlePlayPause}
        onKeyDown={(e) => {
          if (e.key === " ") {
            handlePlayPause();
          }
        }}
      >
        <ReactPlayer
          ref={playerRef}
          playing={playing}
          style={{ borderRadius: "0.5rem", overflow: "hidden" }}
          onProgress={handleProgress}
          progressInterval={50}
          url={url}
          width="100%"
          height="auto"
          loop
          light={<div className="bg-black h-64 w-full opacity-50" />}
          muted={muted}
          controls={false} // disable default controls to use custom controls
        />
      </div>

      <div
        className="z-10 w-full rounded-b-lg border-t absolute bottom-0 flex justify-between 
                   items-center backdrop-blur-sm text-secondary-foreground p-2 bg-secondary/50"
      >
        <button type="button" onClick={handlePlayPause} className="cursor-pointer">
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <Progress
          ref={progressRef}
          onChange={handleSeekChange}
          playing={playing}
          setPlaying={setPlaying}
          className="ml-2 h-2"
          value={progress}
        />
      </div>
    </div>
  );
};
