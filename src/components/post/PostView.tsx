"use client";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";
import { forwardRef, useRef, useState } from "react";
import Markdown from "../Markdown";
import { TimeElapsedSince } from "../TimeLabel";
import { UserAvatar } from "../UserAvatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Post } from "./Post";
import { PostContextMenu } from "./PostContextMenu";
import { PostMenu } from "./PostMenu";
import { ReactionsList } from "./PostReactions";

export const PostView = ({ post, showBadges = true }: { post: Post; showBadges?: boolean }) => {
  const [collapsed, setCollapsed] = useState(true);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <PostContextMenu post={post}>
      <Card className="" onClick={() => setCollapsed(false)}>
        <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
          <div className="w-10 h-10 shrink-0 grow-0 rounded-full">
            <UserAvatar user={post.author} link={false} />
          </div>
          <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
            {/* <ReplyInfo post={post} /> */}
            <PostInfo post={post} />
            <PostContent ref={postContentRef} post={post} collapsed={collapsed} setCollapsed={setCollapsed} />
            {showBadges && <PostBadges post={post} />}
          </div>
        </CardContent>
      </Card>
    </PostContextMenu>
  );
};

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  // const router = useRouter();
  // const editing = router.query.editing === post.id;
  const editing = false;

  return editing ? (
    <>
      <div className="truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto line-clamp-none">
        {/* <PostEditor post={post} /> */}
      </div>
    </>
  ) : (
    <div
      ref={ref}
      className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
        collapsed ? "line-clamp-5" : "line-clamp-none"
      }`}
    >
      <Markdown content={post.content} />
      {/* <Metadata metadata={post.metadata} /> */}
    </div>
  );
});

// export const ReplyInfo = ({ post }: { post: Post }) => {
//   const username = post.repliedTo?.author.username;
//   const content = post.repliedTo?.content.substring(0, 100);
//   const id = post.repliedTo?.id;

//   if (!post.repliedToId) return null;

//   return (
//     <Link href={`/p/${id ?? ""}`} className="flex flex-row items-center gap-1 -mt-2 text-xs font-light leading-3">
//       <ReplyIcon size={14} className="shrink-0 scale-x-[-1] transform" />
//       <span className="pb-0.5">@{username}:</span>
//       <span className="truncate pb-0.5 ">{content}</span>
//     </Link>
//   );
// };

export const PostInfo = ({ post }: { post: Post }) => {
  const author = post.author;
  const isLensHandle = author.namespace === "lens";
  const handle = author.handle;

  return (
    <div className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm">
      <Link className="flex gap-2" href={`/${handle}`}>
        <span className="w-fit truncate font-bold">{author.name}</span>
        <span className="">{`${isLensHandle ? "@" : "#"}${handle}`}</span>
      </Link>
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
      <PostMenu post={post} />
    </div>
  );
};

// export const PostEditor = ({ post }: { post: Post }) => {
//   const router = useRouter();
//   const ctx = api.useUtils();
//   const user = useUser();

//   const removeEditingQuery = () => {
//     const { ...routerQuery } = router.query;
//     router.replace({
//       query: { ...routerQuery },
//     });
//   };

//   useEffect(() => {
//     if (!user) return;

//     if (user.id !== post.authorId) {
//       removeEditingQuery();
//       toast.error("You are not allowed to edit this post");
//     }
//   }, [user]);

//   const { mutate: updatePost, isLoading: isPosting } = api.posts.update.useMutation({
//     onSuccess: async () => {
//       removeEditingQuery();
//       await ctx.posts.invalidate();
//     },
//     onError: (e) => {
//       let error = "Something went wrong";
//       switch (e.data?.code) {
//         case "UNAUTHORIZED":
//           error = "You must be logged in to post";
//           break;
//         case "FORBIDDEN":
//           error = "You are not allowed to edit this post";
//           break;
//         case "TOO_MANY_REQUESTS":
//           error = "Slow down! You are editing too often";
//           break;
//         case "BAD_REQUEST":
//           error = "Invalid request";
//           break;
//         case "PAYLOAD_TOO_LARGE":
//           error = "Your message is too big";
//           break;
//       }
//       toast.error(error);
//     },
//   });

//   const FormSchema = z.object({
//     content: z.string().max(3000, {
//       message: "Post must not be longer than 3000 characters.",
//     }),
//   });

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       content: post.content,
//     },
//   });

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     updatePost({
//       content: data.content,
//       id: post.id,
//     });
//   }

//   const updateHeight = () => {
//     if (textarea.current) {
//       textarea.current.style.height = "auto";
//       textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
//     }
//   };

//   const onChange = () => {
//     updateHeight();
//   };

//   const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (event.ctrlKey && event.key === "Enter") {
//       onSubmit(form.getValues());
//     }
//   };

//   const textarea = useRef<HTMLTextAreaElement>(null);

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} onChange={onChange} className="flex flex-col gap-2 p-1 w-full h-fit">
//         <FormField
//           control={form.control}
//           name="content"
//           render={({ field }) => (
//             <FormItem className="grow">
//               <FormControl>
//                 <Textarea
//                   {...field}
//                   onKeyDown={onKeyDown}
//                   disabled={isPosting}
//                   placeholder="Update this post..."
//                   className="min-h-12 resize-none"
//                   ref={textarea}
//                   rows={1}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <div className="flex justify-between">
//           <Button size="default" className="flex gap-2" type="reset" variant={"ghost"} onClick={removeEditingQuery}>
//             Cancel
//           </Button>

//           <Button disabled={isPosting} size="default" className="flex gap-2" type="submit">
//             Update
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

export const PostBadges = ({ post }: { post: Post }) => {
  // const editedIndicator = EditedIndicator({ post });
  const existingReactions = ReactionsList({ post });

  const hasButtons = existingReactions;

  return (
    <div className="flex grow flex-row  grow justify-around w-full items-center -mb-2 -ml-2 mt-2">
      {hasButtons && <ReactionsList post={post} />}
    </div>
  );
};

export function EditedIndicator({ post }: { post: Post }) {
  const lastUpdated = post.updatedAt ? post.updatedAt.toLocaleString() : post.createdAt.toLocaleString();
  const tooltipText = `last updated at ${lastUpdated}`;

  if (post.createdAt.toUTCString() === post.updatedAt.toUTCString()) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-6 flex flex-row gap-1 leading-3 ">
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
