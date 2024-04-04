import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { DropdownMenuSub, DropdownMenuSubContent } from "@radix-ui/react-dropdown-menu";
import { useUser } from "@supabase/auth-helpers-react";
import { EditIcon, HeartIcon, LinkIcon, MoreHorizontalIcon, ReplyIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import type { Post } from "~/server/api/routers/posts";
import { api } from "~/utils/api";
import { ReactionsList } from "./ReactionsList";
import { SignedIn } from "./Signed";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

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
          <PostMenuContent post={post} />
        </DropdownMenuContent>
      </DropdownMenu>
    </SignedIn>
  );
};

export const PostMenuContent = ({ post }: { post: Post }) => {
  const ctx = api.useUtils();
  const router = useRouter();
  const user = useUser();
  const author = post.author;

  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const postLink = `${origin}/p/${post.id}`;

  const setEditingQuery = () => {
    router.query.editing = post.id;
    router.push(router);
  };

  const { mutate: deletePost } = api.posts.delete.useMutation({
    onSuccess: async () => {
      await ctx.posts.invalidate();
    },
    onError: (error) => {
      toast.error(`Error deleting post ${error.message}`);
    },
  });

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
      {user?.id === author.id && (
        <>
          <DropdownMenuItem onClick={setEditingQuery}>
            <EditIcon size={14} className="mr-2 h-4 w-4" />
            edit post
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              deletePost(post.id);
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
