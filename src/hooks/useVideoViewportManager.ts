import { useCallback, useEffect, useRef, useState } from "react";


interface VideoEntry {
  id: string;
  element: HTMLElement;
  isInUpperHalf: boolean;
  positionFromTop: number;
  play: () => void;
  pause: () => void;
  isUnmuted: () => boolean;
  observer?: IntersectionObserver;
}

// Global state for all videos - now properly cleaned up
const videoRegistry = new Map<string, VideoEntry>();
const activeVideoId = { current: null as string | null };
let globalObserver: IntersectionObserver | null = null;
let updateFrameId: number | null = null;

// Configuration
const VIEWPORT_CONFIG = {
  threshold: 0.5, // Video needs to be 50% visible
  rootMargin: "-25% 0px", // Create a center zone
};


const getVideoPosition = (element: HTMLElement): { isInUpperHalf: boolean; positionFromTop: number } => {
  const rect = element.getBoundingClientRect();
  const viewportThresholdY = window.innerHeight * 0.66; // 66% from top (33% from bottom)
  const videoCenterY = rect.top + rect.height / 2;

  // Video is in upper portion if its center is above the 66% threshold line
  const isInUpperHalf = videoCenterY < viewportThresholdY;

  // Position from top of viewport (used for sorting)
  const positionFromTop = videoCenterY;

  return { isInUpperHalf, positionFromTop };
};

const updateVideoStates = () => {

  // Update position status for all videos
  const videosInUpperHalf: VideoEntry[] = [];

  for (const [id, video] of videoRegistry) {
    const { isInUpperHalf, positionFromTop } = getVideoPosition(video.element);
    video.isInUpperHalf = isInUpperHalf;
    video.positionFromTop = positionFromTop;

    if (isInUpperHalf) {
      videosInUpperHalf.push(video);
    }
  }

  // Sort videos by their position from top (lowest in upper half first)
  videosInUpperHalf.sort((a, b) => b.positionFromTop - a.positionFromTop);


  // Determine which video should be playing
  let newActiveId: string | null = null;

  if (videosInUpperHalf.length > 0) {
    newActiveId = videosInUpperHalf[0].id;
  }

  // Update playing states
  if (newActiveId !== activeVideoId.current) {

    const oldActiveId = activeVideoId.current;

    // Pause old active video (if not unmuted)
    if (oldActiveId) {
      const oldVideo = videoRegistry.get(oldActiveId);
      if (oldVideo) oldVideo.pause();
    }

    // Play new active video
    if (newActiveId) {
      const newVideo = videoRegistry.get(newActiveId);
      if (newVideo) {
        newVideo.play();
      }
    }

    activeVideoId.current = newActiveId;

    // Dispatch custom events for affected videos
    if (oldActiveId) {
      window.dispatchEvent(
        new CustomEvent("videoStateChange", {
          detail: { affectedVideoId: oldActiveId, global: false },
        }),
      );
    }
    if (newActiveId) {
      window.dispatchEvent(
        new CustomEvent("videoStateChange", {
          detail: { affectedVideoId: newActiveId, global: false },
        }),
      );
    }
  }

  // Dispatch global update for position changes
  window.dispatchEvent(
    new CustomEvent("videoStateChange", {
      detail: { global: true },
    }),
  );

};

const debouncedUpdate = () => {
  if (updateFrameId) {
    cancelAnimationFrame(updateFrameId);
  }
  updateFrameId = requestAnimationFrame(updateVideoStates);
};

// Create global intersection observer
const createGlobalObserver = () => {
  if (globalObserver) return globalObserver;

  const viewport = document.querySelector("[data-overlayscrollbars-viewport]");

  globalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.getAttribute("data-video-id");
        if (videoId && videoRegistry.has(videoId)) {
          // Update intersection status and trigger update
          debouncedUpdate();
        }
      });
    },
    {
      root: viewport,
      ...VIEWPORT_CONFIG,
    },
  );

  return globalObserver;
};

// Cleanup function for when all videos are unmounted
const cleanupGlobalState = () => {
  if (videoRegistry.size === 0) {
    if (globalObserver) {
      globalObserver.disconnect();
      globalObserver = null;
    }

    if (updateFrameId) {
      cancelAnimationFrame(updateFrameId);
      updateFrameId = null;
    }

    activeVideoId.current = null;
  }
};

export const useVideoViewportManager = (
  videoId: string,
  elementRef: React.RefObject<HTMLElement>,
  callbacks: {
    play: () => void;
    pause: () => void;
    isUnmuted: () => boolean;
  },
) => {
  const [isActive, setIsActive] = useState(false);
  const [isInUpperHalf, setIsInUpperHalf] = useState(false);
  const callbacksRef = useRef(callbacks);

  // Keep callbacks fresh
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  const register = useCallback(() => {
    if (!elementRef.current) return;


    // Add data attribute for intersection observer
    elementRef.current.setAttribute("data-video-id", videoId);

    videoRegistry.set(videoId, {
      id: videoId,
      element: elementRef.current,
      isInUpperHalf: false,
      positionFromTop: Number.POSITIVE_INFINITY,
      play: () => callbacksRef.current.play(),
      pause: () => callbacksRef.current.pause(),
      isUnmuted: () => callbacksRef.current.isUnmuted(),
    });

    // Create global observer if needed and observe this element
    const observer = createGlobalObserver();
    observer.observe(elementRef.current);

    // Trigger immediate update
    debouncedUpdate();
  }, [videoId, elementRef]);

  const unregister = useCallback(() => {

    const video = videoRegistry.get(videoId);
    if (video && globalObserver) {
      globalObserver.unobserve(video.element);
    }

    videoRegistry.delete(videoId);

    // If this was the active video, clear it
    if (activeVideoId.current === videoId) {
      activeVideoId.current = null;
      debouncedUpdate();
    }

    // Cleanup global state if no videos left
    cleanupGlobalState();
  }, [videoId]);

  // Setup scroll listeners for position updates (still needed for center-line logic)
  useEffect(() => {
    if (videoRegistry.size === 1) {
      // Only setup once

      const handleScroll = () => debouncedUpdate();
      const handleResize = () => debouncedUpdate();

      // Listen to both window scroll and custom viewport scroll
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);

      const viewport = document.querySelector("[data-overlayscrollbars-viewport]");
      if (viewport) {
        viewport.addEventListener("scroll", handleScroll, { passive: true });
      }

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        if (viewport) {
          viewport.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, []);

  // Update local state when global state changes
  useEffect(() => {
    const updateLocalState = () => {
      const video = videoRegistry.get(videoId);
      const isNowActive = activeVideoId.current === videoId;
      const isNowInUpperHalf = video?.isInUpperHalf || false;

      setIsActive(isNowActive);
      setIsInUpperHalf(isNowInUpperHalf);
    };

    // Create a custom event listener for state changes
    const handleVideoStateChange = (event: CustomEvent) => {
      if (event.detail.affectedVideoId === videoId || event.detail.global) {
        updateLocalState();
      }
    };

    // Update immediately
    updateLocalState();

    // Listen for state change events
    window.addEventListener("videoStateChange", handleVideoStateChange as EventListener);

    return () => {
      window.removeEventListener("videoStateChange", handleVideoStateChange as EventListener);
    };
  }, [videoId]);

  return {
    register,
    unregister,
    isActive,
    isInUpperHalf,
  };
};
