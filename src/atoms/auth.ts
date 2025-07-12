import { atom } from "jotai";

export const isWalletDialogOpenAtom = atom(false);

export const openWalletDialogAtom = atom(null, (_get, set) => {
  set(isWalletDialogOpenAtom, true);
});

export const closeWalletDialogAtom = atom(null, (_get, set) => {
  set(isWalletDialogOpenAtom, false);
});
