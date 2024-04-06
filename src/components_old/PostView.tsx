"use client";
import Link from "next/link";
import { type KeyboardEvent, type PropsWithChildren, forwardRef, useEffect, useRef, useState } from "react";
import { PostMenu, PostMenuContent } from "./PostMenu";

import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenu, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, Edit2Icon, ReplyIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import type { Post } from "~/server/api/routers/posts";
import Markdown from "./Markdown";
import Metadata from "./Metadata";
import { ReactionBadge } from "./Reactions";
import { ReactionsList } from "./ReactionsList";
import { SignedIn } from "./Signed";
import { TimeElapsedSince } from "./TimeLabel";
import { UserAvatar } from "./UserAvatar";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Textarea } from "../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

export const PostView = ({ post, showBadges = true }: { post: Post; showBadges?: boolean }) => {
  const author = post.author;
  const [collapsed, setCollapsed] = useState(true);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <ContextMenu post={post}>
      <Card className="">
        <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
          <div className="w-10 h-10 shrink-0 grow-0 rounded-full">
            <UserAvatar userId={author.id} />
          </div>
          <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
            <ReplyInfo post={post} />
            <PostInfo post={post} />
            <PostContent ref={postContentRef} post={post} collapsed={collapsed} setCollapsed={setCollapsed} />
            {showBadges && (
              <PostBadges
                postContentRef={postContentRef}
                post={post}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </ContextMenu>
  );
};

export const ContextMenu = (props: PropsWithChildren & { post: Post }) => {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  const handleClick = () => setClicked(false);
  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setClicked(true);
        setPoints({
          x: e.pageX,
          y: e.pageY,
        });
      }}
    >
      <SignedIn>
        {clicked && (
          <div className="z-[10] absolute" style={{ top: `${points.y}px`, left: `${points.x}px` }}>
            <DropdownMenu open={true}>
              <DropdownMenuTrigger />
              <DropdownMenuContent>
                <Card className="hover:bg-card">
                  <PostMenuContent post={props.post} />
                </Card>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SignedIn>

      {props.children}
    </div>
  );
};

export const ReplyInfo = ({ post }: { post: Post }) => {
  const username = post.repliedTo?.author.username;
  const content = post.repliedTo?.content.substring(0, 100);
  const id = post.repliedTo?.id;

  if (!post.repliedToId) return null;

  return (
    <Link href={`/p/${id ?? ""}`} className="flex flex-row items-center gap-1 -mt-2 text-xs font-light leading-3">
      <ReplyIcon size={14} className="shrink-0 scale-x-[-1] transform" />
      <span className="pb-0.5">@{username}:</span>
      <span className="truncate pb-0.5 ">{content}</span>
    </Link>
  );
};

export const PostInfo = ({ post }: { post: Post }) => {
  const author = post.author;
  const username = author.username ?? "";

  return (
    <div className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm">
      <Link className="flex gap-2" href={`/${username}`}>
        <span className="w-fit truncate font-bold">{author.full_name}</span>
        <span className="">{`@${username}`}</span>
      </Link>
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
      <PostMenu post={post} />
    </div>
  );
};

export const PostEditor = ({ post }: { post: Post }) => {
  const router = useRouter();
  const ctx = api.useUtils();
  const user = useUser();

  const removeEditingQuery = () => {
    const { ...routerQuery } = router.query;
    router.replace({
      query: { ...routerQuery },
    });
  };

  useEffect(() => {
    if (!user) return;

    if (user.id !== post.authorId) {
      removeEditingQuery();
      toast.error("You are not allowed to edit this post");
    }
  }, [user]);

  const { mutate: updatePost, isLoading: isPosting } = api.posts.update.useMutation({
    onSuccess: async () => {
      removeEditingQuery();
      await ctx.posts.invalidate();
    },
    onError: (e) => {
      let error = "Something went wrong";
      switch (e.data?.code) {
        case "UNAUTHORIZED":
          error = "You must be logged in to post";
          break;
        case "FORBIDDEN":
          error = "You are not allowed to edit this post";
          break;
        case "TOO_MANY_REQUESTS":
          error = "Slow down! You are editing too often";
          break;
        case "BAD_REQUEST":
          error = "Invalid request";
          break;
        case "PAYLOAD_TOO_LARGE":
          error = "Your message is too big";
          break;
      }
      toast.error(error);
    },
  });

  const FormSchema = z.object({
    content: z.string().max(3000, {
      message: "Post must not be longer than 3000 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: post.content,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    updatePost({
      content: data.content,
      id: post.id,
    });
  }

  const updateHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
    }
  };

  const onChange = () => {
    updateHeight();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      onSubmit(form.getValues());
    }
  };

  const textarea = useRef<HTMLTextAreaElement>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} onChange={onChange} className="flex flex-col gap-2 p-1 w-full h-fit">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Textarea
                  {...field}
                  onKeyDown={onKeyDown}
                  disabled={isPosting}
                  placeholder="Update this post..."
                  className="min-h-12 resize-none"
                  ref={textarea}
                  rows={1}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button size="default" className="flex gap-2" type="reset" variant={"ghost"} onClick={removeEditingQuery}>
            Cancel
          </Button>

          <Button disabled={isPosting} size="default" className="flex gap-2" type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  const router = useRouter();
  const editing = router.query.editing === post.id;

  return editing ? (
    <>
      <div className="truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto line-clamp-none">
        <PostEditor post={post} />
      </div>
    </>
  ) : (
    <div
      ref={ref}
      className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
        collapsed ? "line-clamp-2" : "line-clamp-none"
      }`}
    >
      <Markdown content={post.content} />
      <Metadata metadata={post.metadata} />
    </div>
  );
});

export const PostBadges = ({
  post,
  collapsed,
  setCollapsed,
  postContentRef,
}: {
  post: Post;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  postContentRef: React.RefObject<HTMLDivElement>;
}) => {
  const extensionButton = PostExtensionButton({
    postContentRef,
    post,
    collapsed,
    setCollapsed,
  });
  const replyButton = ReplyCount({ post });
  const editedButton = EditedIndicator({ post });
  const reactionsButton = PostReactionList({ post });

  const buttons = (
    <>
      {extensionButton}
      {replyButton}
      {editedButton}
      {reactionsButton}
    </>
  );
  const hasButtons = extensionButton || replyButton || editedButton || reactionsButton;

  return (
    <div className="flex grow flex-row items-center gap-2 leading-3 -mb-1 mt-2">
      {buttons}
      <SignedIn>
        {hasButtons && (
          <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 duration-300 delay-150">
            <ReactionsList post={post} />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export function ReplyCount({ post }: { post: Post }) {
  const replyCount = post.replies.length;
  const replyText = replyCount <= 1 ? "reply" : "replies";
  const tooltipText = `${replyCount} ${replyText}`;

  if (post.replies.length <= 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/p/${post.id}`}
            className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline hover:bg-base-200"
          >
            <Button variant="outline" size="icon" className="w-10 h-6 flex flex-row gap-1 leading-3 ">
              {post.replies.length}
              <ReplyIcon size={14} className="" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export function PostExtensionButton({
  collapsed,
  setCollapsed,
  postContentRef,
}: {
  post: Post;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  postContentRef: React.RefObject<HTMLDivElement>;
}): JSX.Element | null {
  const [collapsable, setCollapsable] = useState(false);

  useEffect(() => {
    const postContentElement = postContentRef.current;
    if (postContentElement) {
      const hasLineClamp2Effect = postContentElement.scrollHeight > postContentElement.clientHeight;
      setCollapsable(hasLineClamp2Effect);
    }
  }, [postContentRef.current]);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  if (!collapsable) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              toggleCollapsed();
            }}
            variant="outline"
            size="icon"
            className="w-10 h-6 flex flex-row gap-1 leading-3 "
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{collapsed ? "show more" : "show less"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PostReactionList({ post }: { post: Post }) {
  if (post.reactions.length === 0) return null;

  return (
    <>
      {post.reactions.map((reaction) => (
        <ReactionBadge key={post.id + reaction.reactionId} reaction={reaction} post={post} />
      ))}
    </>
  );
}

export function EditedIndicator({ post }: { post: Post }) {
  const _editCount = 1; // TODO: add editCount to schema
  const lastUpdated = post.updatedAt.toLocaleString();
  const tooltipText = `last updated at ${lastUpdated}`;

  if (post.createdAt.toUTCString() === post.updatedAt.toUTCString()) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-6 flex flex-row gap-1 leading-3 ">
            {/* TODO: Add edited count */}
            <Edit2Icon size={14} className="shrink-0 scale-x-[-1] transform" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
