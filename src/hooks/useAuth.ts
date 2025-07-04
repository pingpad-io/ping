import { useAtom, useSetAtom } from "jotai";
import { useCallback, useContext } from "react";
import { closeWalletDialogAtom, isWalletDialogOpenAtom, openWalletDialogAtom } from "../atoms/auth";
import { UserContext } from "../components/user/UserContext";

export const useAuth = () => {
  // Try to get user context, but don't throw if it doesn't exist
  const userContext = useContext(UserContext);
  const user = userContext?.user || null;
  
  const [isWalletDialogOpen] = useAtom(isWalletDialogOpenAtom);
  const openWalletDialog = useSetAtom(openWalletDialogAtom);
  const closeWalletDialog = useSetAtom(closeWalletDialogAtom);

  const requireAuth = useCallback(
    (callback?: () => void) => {
      if (!user) {
        openWalletDialog();
        return false;
      }
      callback?.();
      return true;
    },
    [user, openWalletDialog],
  );

  return {
    user,
    isAuthenticated: !!user,
    isWalletDialogOpen,
    openWalletDialog,
    closeWalletDialog,
    requireAuth,
  };
};