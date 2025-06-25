"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  backgroundColorIdAtom,
  backgroundImageUrlAtom,
  backgroundModeAtom,
  blurAtom,
  imageCreditsAtom,
  imageLoadingAtom,
  imageTypeAtom,
  intensityAtom,
} from "~/atoms/backgroundTheme";
import { type PhotoCredits, unsplash } from "~/utils/unsplash";

export type BackgroundMode = "none" | "gradient" | "image";

export const backgroundColors: BackgroundColor[] = [
  {
    id: "default",
    name: "Default",
    rgb: { r: 148, g: 158, b: 158 }, // A neutral gray-green that matches the theme
  },
  {
    id: "black_and_white",
    name: "B&W",
    rgb: { r: 128, g: 128, b: 128 },
  },
  {
    id: "yellow",
    name: "Yellow",
    rgb: { r: 251, g: 191, b: 36 },
  },
  {
    id: "orange",
    name: "Orange",
    rgb: { r: 251, g: 146, b: 60 },
  },
  {
    id: "red",
    name: "Red",
    rgb: { r: 239, g: 68, b: 68 },
  },
  {
    id: "purple",
    name: "Purple",
    rgb: { r: 139, g: 92, b: 246 },
  },
  {
    id: "magenta",
    name: "Magenta",
    rgb: { r: 236, g: 72, b: 153 },
  },
  {
    id: "green",
    name: "Green",
    rgb: { r: 34, g: 197, b: 94 },
  },
  {
    id: "teal",
    name: "Teal",
    rgb: { r: 6, g: 182, b: 212 },
  },
  {
    id: "blue",
    name: "Blue",
    rgb: { r: 59, g: 130, b: 246 },
  },
];

export interface BackgroundColor {
  id: string;
  name: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
}

const COLOR_QUERIES: Record<string, string> = {
  default: "abstract minimal neutral texture",
  black_and_white: "abstract minimalist monochrome",
  yellow: "yellow abstract warm golden",
  orange: "orange abstract sunset warm",
  red: "red abstract vibrant bold",
  purple: "purple abstract violet gradient",
  magenta: "magenta pink abstract vibrant",
  green: "green nature abstract fresh",
  teal: "teal turquoise abstract ocean",
  blue: "blue abstract sky ocean",
};

export function useBackgroundTheme() {
  const [backgroundColorId, setBackgroundColorId] = useAtom(backgroundColorIdAtom);
  const [backgroundMode, setBackgroundMode] = useAtom(backgroundModeAtom);
  const [backgroundImageUrl, setBackgroundImageUrl] = useAtom(backgroundImageUrlAtom);
  const [imageCredits, setImageCredits] = useAtom(imageCreditsAtom);
  const [imageLoading, setImageLoading] = useAtom(imageLoadingAtom);
  const [imageType, setImageType] = useAtom(imageTypeAtom);
  const [intensity, setIntensity] = useAtom(intensityAtom);
  const [blur, setBlur] = useAtom(blurAtom);

  const currentColor = backgroundColors.find((c) => c.id === backgroundColorId) || backgroundColors[0];

  const fetchRandomImage = useCallback(
    async (colorId: string) => {
      const query = COLOR_QUERIES[colorId] || "abstract wallpaper";
      setImageLoading(true);

      try {
        const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

        if (UNSPLASH_ACCESS_KEY) {
          const result = await unsplash.photos.getRandom({
            query,
            orientation: "landscape",
            count: 1,
          });

          if (result.type === "success" && result.response) {
            const photo = Array.isArray(result.response) ? result.response[0] : result.response;
            const imageUrl = photo.urls.regular || photo.urls.full;

            const credits: PhotoCredits = {
              id: photo.id,
              username: photo.user.username,
              name: photo.user.name,
              portfolioUrl: photo.user.portfolio_url || undefined,
              photoUrl: photo.links.html,
            };

            setBackgroundImageUrl(imageUrl);
            setImageCredits(credits);
            setImageType("unsplash");

            if (photo.links.download_location) {
              unsplash.photos.trackDownload({ downloadLocation: photo.links.download_location });
            }

            setImageLoading(false);
            return imageUrl;
          }
          if (result.errors?.[0]?.includes("Rate Limit")) {
            alert("Unsplash rate limit exceeded. Please try again later or use a local image.");
          } else {
            console.error("Unsplash API error:", result);
          }
        } else {
          alert("Please add your Unsplash API key to use random images.");
        }
      } catch (error: any) {
        console.error("Failed to fetch image:", error);
        if (error.message?.includes("403") || error.status === 403) {
          alert("Unsplash rate limit exceeded. Please try again later or use a local image.");
        }
      }

      setImageLoading(false);
      return null;
    },
    [setBackgroundImageUrl, setImageCredits, setImageLoading, setImageType],
  );

  const selectLocalImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setBackgroundImageUrl(imageUrl);
        setImageCredits(null);
        setImageType("local");
      };
      reader.readAsDataURL(file);
    },
    [setBackgroundImageUrl, setImageCredits, setImageType],
  );

  return {
    backgroundColorId,
    setBackgroundColorId,
    backgroundMode,
    setBackgroundMode,
    backgroundImageUrl,
    setBackgroundImageUrl,
    imageCredits,
    imageLoading,
    imageType,
    intensity,
    setIntensity,
    blur,
    setBlur,
    currentColor,
    availableColors: backgroundColors,
    fetchRandomImage,
    selectLocalImage,
  };
}
