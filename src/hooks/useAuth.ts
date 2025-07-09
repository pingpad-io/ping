import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";
import { closeWalletDialogAtom, isWalletDialogOpenAtom, openWalletDialogAtom } from "../atoms/auth";
import { UserContext } from "../components/user/UserContext";

export const useAuth = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user || null;
  const router = useRouter();
  
  const [isWalletDialogOpen] = useAtom(isWalletDialogOpenAtom);
  const openWalletDialog = useSetAtom(openWalletDialogAtom);
  const closeWalletDialog = useSetAtom(closeWalletDialogAtom);

  const requireAuth = useCallback(
    (callback?: () => void) => {
      if (!user) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return false;
      }
      callback?.();
      return true;
    },
    [user, router],
  );

  const redirectToLogin = useCallback(() => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isWalletDialogOpen,
    openWalletDialog: redirectToLogin, // Keep same interface but redirect instead
    closeWalletDialog,
    requireAuth,
  };
};