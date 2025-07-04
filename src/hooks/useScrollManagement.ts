import { useEffect, useRef } from "react";

interface UseScrollManagementOptions {
  parentThread: any[];
  loading: boolean;
}

export function useScrollManagement({ parentThread, loading }: UseScrollManagementOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainPostRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const mainPostInitialOffsetRef = useRef<number>(0);

  useEffect(() => {
    if (!hasInitializedRef.current && mainPostRef.current) {
      const viewport = containerRef.current?.closest("[data-overlayscrollbars-viewport]") as HTMLElement | null;

      if (viewport) {
        requestAnimationFrame(() => {
          const desiredOffset = 16;
          const currentMainPostOffset = mainPostRef.current!.offsetTop;

          mainPostInitialOffsetRef.current = currentMainPostOffset;

          viewport.scrollTop = currentMainPostOffset - desiredOffset;
          hasInitializedRef.current = true;
        });
      }
    }
  });

  useEffect(() => {
    if (!hasInitializedRef.current || !mainPostRef.current) return;

    const viewport = containerRef.current?.closest("[data-overlayscrollbars-viewport]") as HTMLElement | null;

    if (!viewport) return;

    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        if (!mainPostRef.current) return;

        const currentMainPostOffset = mainPostRef.current.offsetTop;
        const offsetDifference = currentMainPostOffset - mainPostInitialOffsetRef.current;

        if (offsetDifference !== 0) {
          viewport.scrollTop += offsetDifference;
          mainPostInitialOffsetRef.current = currentMainPostOffset;
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [hasInitializedRef.current]);

  return { containerRef, mainPostRef };
}
