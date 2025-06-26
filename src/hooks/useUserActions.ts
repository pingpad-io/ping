import { toast } from "sonner";
import { useFilteredUsers } from "~/components/FilteredUsersContext";
import type { User } from "~/components/user/User";

export const useUserActions = (user: User, onComplete?: () => void) => {
  const { addMutedUser, removeMutedUser, addBlockedUser, removeBlockedUser } = useFilteredUsers();

  const muteUser = async () => {
    // Optimistic update
    addMutedUser(user.id);

    const result = await fetch(`/api/user/${user.id}/mute`, {
      method: "POST",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("User muted successfully!", {
        action: {
          label: "Undo",
          onClick: () => {
            removeMutedUser(user.id);
            unmuteUser();
          },
        },
      });
    } else {
      // Revert on error
      removeMutedUser(user.id);
      toast.error(`${data.error}`);
    }
    onComplete?.();
  };

  const unmuteUser = async () => {
    // Optimistic update
    removeMutedUser(user.id);

    const result = await fetch(`/api/user/${user.id}/unmute`, {
      method: "POST",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("User unmuted successfully!", {
        action: {
          label: "Undo",
          onClick: () => muteUser(),
        },
      });
    } else {
      // Revert on error
      addMutedUser(user.id);
      toast.error(`${data.error}`);
    }
    onComplete?.();
  };

  const blockUser = async () => {
    // Optimistic update
    addBlockedUser(user.id);

    const result = await fetch(`/api/user/${user.id}/block`, {
      method: "POST",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("User blocked successfully!", {
        action: {
          label: "Undo",
          onClick: () => {
            removeBlockedUser(user.id);
            unblockUser();
          },
        },
      });
    } else {
      // Revert on error
      removeBlockedUser(user.id);
      toast.error(`${data.error}`);
    }
    onComplete?.();
  };

  const unblockUser = async () => {
    // Optimistic update
    removeBlockedUser(user.id);

    const result = await fetch(`/api/user/${user.id}/unblock`, {
      method: "POST",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("User unblocked successfully!", {
        action: {
          label: "Undo",
          onClick: () => blockUser(),
        },
      });
    } else {
      // Revert on error
      addBlockedUser(user.id);
      toast.error(`${data.error}`);
    }
    onComplete?.();
  };

  return { muteUser, unmuteUser, blockUser, unblockUser };
};
