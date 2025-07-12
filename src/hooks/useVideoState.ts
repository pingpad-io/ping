import { useEffect, useRef } from "react";

const activeVideoPlayers = new Set<string>();
const pauseCallbacks = new Map<string, () => void>();

export const useVideoState = (videoId: string) => {
  const pauseCallbackRef = useRef<() => void>();

  const registerPlayer = (pauseCallback: () => void) => {
    pauseCallbackRef.current = pauseCallback;
    pauseCallbacks.set(videoId, pauseCallback);
  };

  const unregisterPlayer = () => {
    pauseCallbacks.delete(videoId);
    activeVideoPlayers.delete(videoId);
  };

  const pauseAllOtherVideos = () => {
    for (const [playerId, callback] of pauseCallbacks) {
      if (playerId !== videoId) {
        callback();
      }
    }
    activeVideoPlayers.clear();
    activeVideoPlayers.add(videoId);
  };

  useEffect(() => {
    return () => {
      unregisterPlayer();
    };
  }, [videoId]);

  return {
    registerPlayer,
    unregisterPlayer,
    pauseAllOtherVideos,
  };
};
