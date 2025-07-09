import { atom } from "jotai";

export interface OnboardingState {
  isOnboarding: boolean;
  username?: string;
  step: "idle" | "username" | "profile" | "complete";
}

export const onboardingStateAtom = atom<OnboardingState>({
  isOnboarding: false,
  step: "idle",
});
