import { Post } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { RouterOutputs, api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";

export type AuthoredPost = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({
  data,
  collapsed,
}: {
  data: AuthoredPost;
  collapsed?: boolean;
}) => {
  // Prisma doesn't strongly type implicit relationships, but we know that this field exists
  const post = data.post as Post & { likers: { id: string }[] };
  if (post.likers === undefined) {
    throw new Error("likers is undefined");
  }

  const author = data.author;
  const username = author.username;
  const postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();
  const user = useUser();
  const queryClient = useQueryClient();
  let wasLiked =
    post.likers.find((liker) => liker.id === user?.id) !== undefined;
  const [isCollapsed, setCollapsed] = useState(collapsed ?? true);
  const [liked, setLiked] = useState(wasLiked);
  const [likesAmount, setLikesAmount] = useState(
    post.likers.length > 0 ? post.likers.length : 0
  );
  const like_text_color = liked ? "text-base-100" : "text-base-content";

  useEffect(() => {
    if (!user) {
      setLiked(false);
    }
  }, [user]);

  const sendLike = api.posts.like.useMutation({
    onSuccess: async () => {
      await queryClient.refetchQueries({ stale: true });
    },
    onError: (error) => {
      toast.error("Error liking post " + error.message);
    },
  });

  let like = () => {
    setLiked(!liked);
    liked ? setLikesAmount(likesAmount - 1) : setLikesAmount(likesAmount + 1);
    sendLike.mutate(post.id);
  };

  let avatar = (
    <Link className="" href={`/${username}`}>
      <Image
        className="avatar rounded-full"
        src={author.avatar_url ?? ""}
        alt={`${author.username}'s profile image`}
        width={48}
        height={48}
      />
    </Link>
  );

  let metadata = (
    <div className="flex flex-row gap-2 text-sm text-base-content">
      <Link className="" href={`/${username}`}>
        {`@${username}`} {user?.id === author.id && <span>(you)</span>}
      </Link>
      {`·`}
      <TimeSinceLabel date={post.createdAt} />
      {`·`}
      <Link className="" href={`/post/${post.id}`}>
        <div className="">{postId}</div>
      </Link>
    </div>
  );

  let content = (
    <Link className="" href={`/post/${post.id}`}>
      <div className="overflow-hidden overflow-ellipsis text-lg text-base-content">
        {post.content}
      </div>
    </Link>
  );

  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  let likes_text = formatter.format(likesAmount);

  const likes = (
    <div className="flex h-full w-full items-center justify-center">
      <button
        className="btn-square btn relative border-0 bg-base-100 hover:bg-base-100"
        onClick={() => like()}
      >
        <span
          className={
            `text-md absolute z-10 flex items-center justify-center font-bold ` +
            like_text_color
          }
        >
          {likesAmount > 0 ? likes_text : ""}
        </span>
        <span className="absolute flex items-center justify-center">
          {liked ? <AiFillHeart size={35} /> : <AiOutlineHeart size={35} />}
        </span>
      </button>
    </div>
  );

  let expandable = post.content.length > 65;

  return (
    <div
      className={
        `my-1 flex flex-col gap-2 rounded-xl border border-base-300 p-4 ` +
        (expandable ? "pb-2" : "pb-4")
      }
    >
      <div className="flex flex-row gap-4">
        <div className="h-12 w-12 shrink-0 grow-0">{avatar}</div>
        <div className={`grow ` + (isCollapsed ? " truncate" : "")}>
          {metadata}
          {content}
        </div>
        <div className="h-12 w-12 items-center justify-center">{likes}</div>
      </div>
      <div className="flex flex-row justify-center">
        {expandable &&
          (isCollapsed ? (
            <button onClick={() => setCollapsed(false)}>
              <RiArrowDownSLine />
            </button>
          ) : (
            <button onClick={() => setCollapsed(true)}>
              <RiArrowUpSLine />
            </button>
          ))}
      </div>
    </div>
  );
};
