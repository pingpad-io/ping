"use client";

import { CopyIcon, DownloadIcon, XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { useState } from "react";
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

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = alt || 'image';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    }
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
          }, 'image/png');
        });

        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': pngBlob
          })
        ]);

        URL.revokeObjectURL(img.src);

        toast.success('Image copied to clipboard');
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy image');
    }
  };

  return (
    <>
      <img src={src} alt={alt} className={className} onClick={() => setOpen(true)} />
      {open && (
        <div
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

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${scale})` }}
              className="max-h-full max-w-full object-contain transition-transform"
            />
          </div>
        </div>
      )}
    </>
  );
}
