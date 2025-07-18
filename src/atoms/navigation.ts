import { atom } from "jotai";

export const isNavigatingWithShortcutAtom = atom(false);
export const navigationPositionAtom = atom(0);
export const showNavigationIndicatorAtom = atom(false);
export const navigationModeAtom = atom<"history" | "normal">("normal");
export const isNavigatingFromHistoryAtom = atom(false);
