import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface VideoMetadata {
  url: string;
  title?: string;
  preview?: string;
  postId?: string;
  galleryItems?: any[];
  currentIndex?: number;
}

export const currentVideoAtom = atom<VideoMetadata | null>(null);
export const videoPlayingAtom = atom<boolean>(false);
export const videoCurrentTimeAtom = atom<number>(0);
export const videoDurationAtom = atom<number>(0);
export const videoVolumeAtom = atomWithStorage<number>("video-volume", 1);
export const videoMutedAtom = atomWithStorage<boolean>("video-muted", true);

export const miniVideoPlayerVisibleAtom = atom<boolean>(false);

const _globalReactPlayerAtom = atom<any>(null);
export const globalReactPlayerAtom = atom(
  (get) => get(_globalReactPlayerAtom),
  (_get, set, player: any) => {
    set(_globalReactPlayerAtom as any, player);
  }
);

export const videoProgressPercentageAtom = atom((get) => {
  const currentTime = get(videoCurrentTimeAtom);
  const duration = get(videoDurationAtom);
  return duration > 0 ? (currentTime / duration) * 100 : 0;
});

export const videoDisplayTimeAtom = atom((get) => {
  const currentTime = get(videoCurrentTimeAtom);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return formatTime(currentTime);
});

export const playVideoAtom = atom(
  null,
  (get, set, videoData: VideoMetadata) => {
    set(currentVideoAtom as any, videoData);
    set(videoPlayingAtom, true);
    set(miniVideoPlayerVisibleAtom, true);
  }
);

export const pauseVideoAtom = atom(
  null,
  (get, set) => {
    set(videoPlayingAtom, false);
  }
);

export const stopVideoAtom = atom(
  null,
  (get, set) => {
    set(videoPlayingAtom, false);
    set(currentVideoAtom as any, null);
    set(videoCurrentTimeAtom as any, 0);
    set(videoDurationAtom as any, 0);
    set(miniVideoPlayerVisibleAtom, false);
  }
);

export const seekVideoAtom = atom(
  null,
  (get, set, time: number) => {
    const reactPlayer = get(globalReactPlayerAtom);
    if (reactPlayer && reactPlayer.seekTo) {
      reactPlayer.seekTo(time);
    }
    set(videoCurrentTimeAtom, time);
  }
);

export const setVideoVolumeAtom = atom(
  null,
  (get, set, volume: number) => {
    set(videoVolumeAtom, volume);
  }
);

export const setVideoMutedAtom = atom(
  null,
  (get, set, muted: boolean) => {
    set(videoMutedAtom, muted);
  }
);

export const hideMiniVideoPlayerAtom = atom(
  null,
  (_get, set) => {
    set(miniVideoPlayerVisibleAtom, false);
  }
);

export const showMiniVideoPlayerAtom = atom(
  null,
  (get, set) => {
    const hasVideo = get(currentVideoAtom);
    if (hasVideo) {
      set(miniVideoPlayerVisibleAtom, true);
    }
  }
);