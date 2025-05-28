"use client";

import { DownloadIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useState } from "react";

export function ImageViewer({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);

  const close = () => {
    setOpen(false);
    setScale(1);
  };

  const zoomIn = () => setScale((s) => s + 0.25);
  const zoomOut = () => setScale((s) => Math.max(0.25, s - 0.25));

  return (
    <>
      <img src={src} alt={alt} className={className} onClick={() => setOpen(true)} />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${scale})` }}
              className="max-h-full max-w-full object-contain transition-transform"
            />
            <div className="absolute right-4 top-4 flex gap-2">
              <button type="button" onClick={zoomIn} aria-label="Zoom in">
                <ZoomInIcon size={20} />
              </button>
              <button type="button" onClick={zoomOut} aria-label="Zoom out">
                <ZoomOutIcon size={20} />
              </button>
              <a href={src} download onClick={(e) => e.stopPropagation()} aria-label="Download">
                <DownloadIcon size={20} />
              </a>
              <button type="button" onClick={close} aria-label="Close">
                <XIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
