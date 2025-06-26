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
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { toast } from "sonner";
import Link from "~/components/Link";
import { useUserActions } from "~/hooks/useUserActions";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { ContextMenu as Context, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";

export const PostContextMenu = (props: PropsWithChildren & { post: Post; onReply?: () => void }) => {
  const router = useRouter();
  const author = props.post.author;
  const { user } = useUser();
  const { muteUser, unmuteUser, blockUser, unblockUser } = useUserActions(author);

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${props.post.id}`;
  const shareLink = postLink;
  const isMuted = props.post.author.actions.muted;
  const isBlocked = props.post.author.actions.blocked;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
  };

  const deletePost = async () => {
    const result = await fetch(`/api/posts?id=${props.post.id}`, {
      method: "DELETE",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("Post deleted successfully!");
    } else {
      toast.error(`${data.error}`);
    }
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
  };

  const handleReply = () => {
    props.onReply?.();
  };

  const handleExpand = () => {
    router.push(`/p/${props.post.id}`);
  };

  return (
    <Context>
      <ContextMenuContent
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col w-max gap-1 p-1 rounded-lg border"
      >
        {props.onReply && (
          <ContextMenuItem onClick={handleReply}>
            <ReplyIcon size={12} className="mr-2 h-4 w-4" />
            reply
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={handleExpand}>
          <MaximizeIcon size={12} className="mr-2 h-4 w-4" />
          expand
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Link href={postLink} referrerPolicy="no-referrer" target="_blank">
            <ExternalLinkIcon size={12} className="mr-2 h-4 w-4" />
            open in new tab
          </Link>
        </ContextMenuItem>
        <ContextMenuItem onClick={share}>
          <Share2Icon size={12} className="mr-2 h-4 w-4" />
          share
        </ContextMenuItem>
        {user?.id !== author.id && (
          <>
            <ContextMenuItem
              onClick={() => {
                isMuted ? unmuteUser() : muteUser();
              }}
            >
              {isMuted ? (
                <Volume2Icon size={12} className="mr-2 h-4 w-4" />
              ) : (
                <VolumeXIcon size={12} className="mr-2 h-4 w-4" />
              )}
              {isMuted ? "unmute user" : "mute user"}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                isBlocked ? unblockUser() : blockUser();
              }}
            >
              {isBlocked ? (
                <ShieldOffIcon size={12} className="mr-2 h-4 w-4" />
              ) : (
                <ShieldIcon size={12} className="mr-2 h-4 w-4" />
              )}
              {isBlocked ? "unblock user" : "block user"}
            </ContextMenuItem>
          </>
        )}
        {user?.id === author.id && (
          <>
            <ContextMenuItem onClick={setEditingQuery} disabled>
              <EditIcon size={12} className="mr-2 h-4 w-4" />
              edit post
            </ContextMenuItem>

            <ContextMenuItem
              onClick={() => {
                deletePost();
              }}
            >
              <TrashIcon size={12} className="mr-2 h-4 w-4" />
              delete post
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
    </Context>
  );
};
