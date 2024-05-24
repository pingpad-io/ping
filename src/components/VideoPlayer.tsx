import { PauseIcon, PlayIcon } from "lucide-react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Progress } from "./ui/progress";

export const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  const handleSeekChange = (value: number) => {
    playerRef.current.seekTo(value / 100);
  };

  return (
    <div className="relative rounded-xl w-full border">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={playing}
        onProgress={handleProgress}
        width="100%"
        height="auto"
        loop
        muted
        style={{ borderRadius: "0.5rem", overflow: "hidden" }}
        controls={false} // Disable default controls to use custom controls
      />

      <div className="z-10 w-full rounded-b-lg border-t absolute bottom-0 flex justify-between items-center backdrop-blur-lg text-foreground p-2">
        <button type="button" onClick={handlePlayPause} className="cursor-pointer">
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        {/* <input type="range" min="0" max="100" value={progress} onChange={handleSeekChange} className="flex-grow ml-2" /> */}

        <Progress ref={progressRef} onChange={handleSeekChange} className="ml-2 h-2" value={progress} />
      </div>
    </div>
  );
};
