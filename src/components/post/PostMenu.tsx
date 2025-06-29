"use client";
import {
  EditIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  ReplyIcon,
  Share2Icon,
  ShieldIcon,
  ShieldOffIcon,
  TrashIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "~/components/Link";
import { useUserActions } from "~/hooks/useUserActions";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { Button } from "../ui/button";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";

export type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconSize?: number;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  variant?: "default" | "destructive";
  condition?: "always" | "isAuthor" | "notAuthor" | "hasReply";
  getDynamicProps?: (context: MenuContext) => Partial<MenuItem>;
};

export type MenuContext = {
  post: Post;
  user: any;
  isMuted: boolean;
  isBlocked: boolean;
  share: () => void;
  handleReply: () => void;
  handleExpand: () => void;
  deletePost: () => void;
  setEditingQuery: () => void;
  muteUser: () => void;
  unmuteUser: () => void;
  blockUser: () => void;
  unblockUser: () => void;
  postLink: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "reply",
    label: "Reply",
    icon: ReplyIcon,
    iconSize: 18,
    condition: "hasReply",
  },
  {
    id: "share",
    label: "Share",
    icon: Share2Icon,
    iconSize: 18,
    condition: "always",
  },
  // {
  //   id: "expand",
  //   label: "Expand",
  //   icon: MaximizeIcon,
  //   iconSize: 18,
  //   condition: "always",
  // },
  {
    id: "open-new-tab",
    label: "Open in new tab",
    icon: ExternalLinkIcon,
    iconSize: 18,
    condition: "always",
  },
  {
    id: "mute-user",
    label: "Mute user",
    icon: VolumeXIcon,
    iconSize: 18,
    condition: "notAuthor",
    getDynamicProps: (context) => ({
      label: context.isMuted ? "Unmute user" : "Mute user",
      icon: context.isMuted ? Volume2Icon : VolumeXIcon,
      onClick: context.isMuted ? context.unmuteUser : context.muteUser,
    }),
  },
  {
    id: "block-user",
    label: "Block user",
    icon: ShieldIcon,
    iconSize: 18,
    condition: "notAuthor",
    getDynamicProps: (context) => ({
      label: context.isBlocked ? "Unblock user" : "Block user",
      icon: context.isBlocked ? ShieldOffIcon : ShieldIcon,
      onClick: context.isBlocked ? context.unblockUser : context.blockUser,
    }),
  },
  {
    id: "edit-post",
    label: "Edit post",
    icon: EditIcon,
    iconSize: 18,
    condition: "isAuthor",
    disabled: true,
  },
  {
    id: "delete-post",
    label: "Delete post",
    icon: TrashIcon,
    iconSize: 18,
    condition: "isAuthor",
    variant: "destructive",
  },
];

export const PostMenu = ({
  post,
  onReply,
  onMenuAction,
}: {
  post: Post;
  onReply?: () => void;
  onMenuAction?: () => void;
}) => {
  const router = useRouter();
  const author = post.author;
  const { user } = useUser();
  const { muteUser, unmuteUser, blockUser, unblockUser } = useUserActions(author, onMenuAction);

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${post.id}`;
  const shareLink = postLink;
  const isMuted = post.author.actions.muted;
  const isBlocked = post.author.actions.blocked;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
    onMenuAction?.();
  };

  const deletePost = async () => {
    // TODO: add confirmation dialog
    const result = await fetch(`/api/posts?id=${post.id}`, {
      method: "DELETE",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("Post deleted successfully!");
    } else {
      toast.error(`${data.error}`);
    }
    onMenuAction?.();
  };

  const share = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        toast.success("Copied link to clipboard");
      },
      () => {
        toast.error("Error copying link to clipboard!");
      },
    );
    onMenuAction?.();
  };

  const handleReply = () => {
    onReply?.();
    onMenuAction?.();
  };

  const handleExpand = () => {
    router.push(`/p/${post.id}`);
    onMenuAction?.();
  };

  const handleOpenInNewTab = () => {
    onMenuAction?.();
  };

  const context: MenuContext = {
    post,
    user,
    isMuted,
    isBlocked,
    share,
    handleReply,
    handleExpand,
    deletePost,
    setEditingQuery,
    muteUser,
    unmuteUser,
    blockUser,
    unblockUser,
    postLink,
  };

  const shouldShowItem = (item: MenuItem) => {
    switch (item.condition) {
      case "always":
        return true;
      case "isAuthor":
        return user?.id === author.id;
      case "notAuthor":
        return user?.id !== author.id;
      case "hasReply":
        return !!onReply;
      default:
        return true;
    }
  };

  const getItemProps = (item: MenuItem) => {
    const baseProps = {
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
      disabled: item.disabled,
      variant: item.variant,
    };

    if (item.getDynamicProps) {
      return { ...baseProps, ...item.getDynamicProps(context) };
    }

    switch (item.id) {
      case "share":
        return { ...baseProps, onClick: share };
      case "reply":
        return { ...baseProps, onClick: handleReply };
      case "expand":
        return { ...baseProps, onClick: handleExpand };
      case "open-new-tab":
        return { ...baseProps, href: postLink };
      case "edit-post":
        return { ...baseProps, onClick: setEditingQuery };
      case "delete-post":
        return { ...baseProps, onClick: deletePost };
      default:
        return baseProps;
    }
  };

  return (
    <>
      {menuItems.map((item) => {
        if (!shouldShowItem(item)) return null;

        const itemProps = getItemProps(item);
        const Icon = itemProps.icon;

        if (item.id === "open-new-tab") {
          return (
            <Link key={item.id} href={postLink} referrerPolicy="no-referrer" target="_blank">
              <Button
                className="flex gap-4 justify-start w-full pl-3"
                variant="ghost"
                onClick={handleOpenInNewTab}
                disabled={itemProps.disabled}
              >
                <Icon size={item.iconSize} />
                {itemProps.label}
              </Button>
            </Link>
          );
        }

        return (
          <Button
            key={item.id}
            className="flex gap-4 justify-start w-full pl-3"
            variant="ghost"
            onClick={itemProps.onClick}
            disabled={itemProps.disabled}
          >
            <Icon size={item.iconSize} />
            {itemProps.label}
          </Button>
        );
      })}
    </>
  );
};
