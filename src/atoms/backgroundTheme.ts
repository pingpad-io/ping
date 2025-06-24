import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { BackgroundMode } from "~/hooks/useBackgroundTheme";
import type { PhotoCredits } from "~/utils/unsplash";

const STORAGE_KEY = "leading-color";
const MODE_KEY = "background-mode";
const IMAGE_KEY = "background-image";
const CREDITS_KEY = "background-image-credits";
const INTENSITY_KEY = "background-intensity";
const BLUR_KEY = "background-blur";
const IMAGE_TYPE_KEY = "background-image-type";

export const backgroundColorIdAtom = atomWithStorage<string>(STORAGE_KEY, "default");
export const backgroundModeAtom = atomWithStorage<BackgroundMode>(MODE_KEY, "none");
export const backgroundImageUrlAtom = atomWithStorage<string>(IMAGE_KEY, "");
export const imageCreditsAtom = atomWithStorage<PhotoCredits | null>(CREDITS_KEY, null);
export const intensityAtom = atomWithStorage<number>(INTENSITY_KEY, 0.5);
export const blurAtom = atomWithStorage<number>(BLUR_KEY, 0);
export const imageTypeAtom = atomWithStorage<"unsplash" | "local">(IMAGE_TYPE_KEY, "unsplash");

export const imageLoadingAtom = atom(false);
