"use client";

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

  const close = () => setOpen(false);

  return (
    <>
      <img src={src} alt={alt} className={className} onClick={() => setOpen(true)} />
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" onClick={close} />
        </div>
      )}
    </>
  );
}
