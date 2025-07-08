"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Embed, detectEmbedType } from "./Embed";

interface LinkPreviewData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
  skipPreview?: boolean;
}

interface LinkPreviewProps {
  url: string;
  className?: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, className = "" }) => {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const embedInfo = detectEmbedType(url);

  useEffect(() => {
    if (embedInfo.type) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchPreview = async () => {
      try {
        const response = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch preview");
        }

        const data = await response.json();

        if (!cancelled) {
          setPreview(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchPreview();

    return () => {
      cancelled = true;
    };
  }, [url, embedInfo.type]);

  if (embedInfo.type) {
    return <Embed url={url} className={className} />;
  }

  if (loading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="flex gap-4 p-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-24 w-24 rounded" />
        </div>
      </Card>
    );
  }

  if (error || !preview) {
    return null;
  }

  if (preview.skipPreview) {
    return null;
  }

  const displayUrl = preview.url || url;
  const domain = new URL(displayUrl).hostname.replace("www.", "");
  const hasContent = preview.title || preview.description || preview.image;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  const isFullWidthLayout = imageDimensions && imageDimensions.width > 600;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  if (preview.image && !imageLoaded) {
    return (
      <>
        <img
          src={preview.image}
          alt=""
          className="hidden"
          onLoad={handleImageLoad}
          onError={() => setImageLoaded(true)}
        />
        <Card className={`overflow-hidden ${className}`}>
          <div className="flex gap-4 p-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-24 w-24 rounded" />
          </div>
        </Card>
      </>
    );
  }

  if (preview.image && isFullWidthLayout) {
    return (
      <Link href={displayUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Card className={`overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer ${className}`}>
          <div className="relative w-full" style={{ aspectRatio: "1.91 / 1" }}>
            <img
              src={preview.image}
              alt={preview.title || "Link preview"}
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="p-4">
            {preview.title && (
              <h3 className="font-semibold line-clamp-2 mb-1">{preview.title}</h3>
            )}
            {preview.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                {preview.description}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span>{preview.siteName || domain}</span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (!hasContent) {
    return (
      <Link href={displayUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Card className={`overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer ${className}`}>
          <div className="flex items-center gap-3 p-4">
            <img
              src={faviconUrl}
              alt={`${domain} favicon`}
              className="h-4 w-4 rounded"
              onError={(e) => {
                // If favicon fails, show the external link icon
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate text-muted-foreground">{domain}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={displayUrl} target="_blank" rel="noopener noreferrer" className="block">
      <Card className={`overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer ${className}`}>
        <div className="flex gap-4 p-4">
          <div className="flex-1 min-w-0">
            {preview.title ? (
              <h3 className="font-semibold line-clamp-2 mb-1">{preview.title}</h3>
            ) : (
              <span className="font-medium text-sm">{domain}</span>
            )}
            {preview.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {preview.description}
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {!preview.image && (
                <img
                  src={faviconUrl}
                  alt=""
                  className="h-3 w-3 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <ExternalLink className="h-3 w-3" />
              <span className="truncate text-muted-foreground">{preview.siteName || domain}</span>
            </div>
          </div>
          {preview.image && (
            <div className="flex-shrink-0">
              <img
                src={preview.image}
                alt={preview.title || "Link preview"}
                className="h-24 w-24 object-cover rounded"
                onLoad={handleImageLoad}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};