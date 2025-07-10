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
        router.push('/login');
        return false;
      }
      callback?.();
      return true;
    },
    [user, router],
  );

  const redirectToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isWalletDialogOpen,
    redirectToLogin,
    closeWalletDialog,
    requireAuth,
  };
};