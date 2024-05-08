import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { DropdownMenuSub, DropdownMenuSubContent } from "@radix-ui/react-dropdown-menu";
import { EditIcon, HeartIcon, LinkIcon, MoreHorizontalIcon, ReplyIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SignedIn } from "../Authenticated";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Post } from "./Post";
import { ReactionsList } from "./PostReactions";

export const PostMenu = ({ post }: { post: Post }) => {
  return (
    <SignedIn>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" size="icon" className="w-6 h-4" variant="ghost">
            <MoreHorizontalIcon className="w-4 h-4" strokeWidth={1} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <PostMenuContent post={post} profileId="" />
        </DropdownMenuContent>
      </DropdownMenu>
    </SignedIn>
  );
};

export const PostMenuContent = ({ post, profileId }: { post: Post; profileId: string }) => {
  const router = useRouter();
  const author = post.author;

  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const postLink = `${origin}/p/${post.id}`;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
  };

  const deletePost = () => {
    toast.error("Not implemented yet");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(postLink).then(
      () => {
        toast.success("Copied link to clipboard");
      },
      () => {
        toast.error("Error copying link to clipboard!");
      },
    );
  };
  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <HeartIcon size={14} className="mr-2 h-4 w-4" />
          reactions
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <Card className="p-1 -mt-1 ml-2">
              <ReactionsList post={post} />
            </Card>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem onClick={() => router.push(`/p/${post.id}`)}>
        <ReplyIcon size={14} className="mr-2 h-4 w-4" />
        reply
      </DropdownMenuItem>
      <DropdownMenuItem onClick={copyLink}>
        <LinkIcon size={14} className="mr-2 h-4 w-4" />
        copy link
      </DropdownMenuItem>
      {profileId === author.id && (
        <>
          <DropdownMenuItem onClick={setEditingQuery}>
            <EditIcon size={14} className="mr-2 h-4 w-4" />
            edit post
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              deletePost();
            }}
          >
            <TrashIcon size={14} className="mr-2 h-4 w-4" />
            delete post
          </DropdownMenuItem>
        </>
      )}
    </>
  );
};
