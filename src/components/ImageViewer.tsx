"use client";

import { CopyIcon, DownloadIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
  const toggleZoom = () => setScale((s) => (s === 1 ? 2 : 1));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        close();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const pngBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, "image/png");
        });

        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": pngBlob,
          }),
        ]);

        URL.revokeObjectURL(img.src);

        toast.success("Image copied to clipboard");
      } else {
        throw new Error("Clipboard API not supported");
      }
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy image");
    }
  };

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          <div className="absolute z-[60] right-4 top-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" size="icon" onClick={zoomIn} aria-label="Zoom in">
              <ZoomInIcon size={20} />
            </Button>
            <Button variant="secondary" size="icon" onClick={zoomOut} aria-label="Zoom out">
              <ZoomOutIcon size={20} />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleCopy} aria-label="Copy image">
              <CopyIcon size={20} />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleDownload} aria-label="Download">
              <DownloadIcon size={20} />
            </Button>
            <Button variant="secondary" size="icon" onClick={close} aria-label="Close">
              <XIcon size={20} />
            </Button>
          </div>

          <div className="flex items-center justify-center h-full w-full">
            <motion.img
              src={src}
              alt={alt}
              animate={{ scale }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className={`max-h-full max-w-full object-contain ${scale === 1 ? "cursor-zoom-in" : "cursor-zoom-out"}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <img src={src} alt={alt} className={className} onClick={() => setOpen(true)} />
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
