import { Post } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsReply, BsTrash } from "react-icons/bs";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { RiArrowDownSLine, RiArrowUpSLine, RiHashtag } from "react-icons/ri";
import { RouterOutputs, api } from "~/utils/api";
import { FlairView } from "./FlairView";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { TimeElapsedSince } from "./TimeLabel";
import { UserAvatar } from "./UserAvatar";

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
  const wasLiked =
    post.likers.find((liker) => liker.id === user?.id) !== undefined;
  const [isCollapsed, setCollapsed] = useState(collapsed ?? true);
  const [liked, setLiked] = useState(wasLiked);
  const [likesAmount, setLikesAmount] = useState(
    post.likers.length > 0 ? post.likers.length : 0
  );
  const ctx = api.useContext();

  const todo = () => {};
  const deletePost = api.posts.deleteById.useMutation({
    onSuccess: async () => {
      await ctx.posts.invalidate();
    },
    onError: (error) => {
      toast.error("Error deleting post " + error.message);
    },
  });

  const sendLike = api.posts.likeById.useMutation({
    onSuccess: async () => {
      await ctx.posts.invalidate();
    },
    onError: (error) => {
      toast.error("Error liking post " + error.message);
    },
  });

  const like = () => {
    setLiked(!liked);
    liked ? setLikesAmount(likesAmount - 1) : setLikesAmount(likesAmount + 1);
    sendLike.mutate(post.id);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(postId).then(
      function () {
        toast.success("Copied link to clipboard");
      },
      function (err) {
        toast.error("Error copying link to clipboard " + err);
      }
    );
  };

  useEffect(() => {
    if (!user) {
      setLiked(false);
    }
  }, [user]);

  let flair =
    author.flairs.length > 0 ? (
      <span className="h-min">
        <FlairView flair={author.flairs.at(0)} size="xs" />
      </span>
    ) : (
      <></>
    );
  let metadata = (
    <div className="flex  flex-row place-items-center gap-2 text-sm font-light text-base-content ">
      <Link className="flex gap-2" href={`/${username}`}>
        <span className="font-bold ">{author.full_name}</span>
        {flair}
        <span className="">{`@${username}`}</span>
      </Link>

      <span className="">{`·`}</span>

      <span className="">
        <TimeElapsedSince date={post.createdAt} />
      </span>

      <SignedIn>
        <div className="dropdown-right dropdown pt-2 font-normal">
          <button>
            <FiMoreHorizontal strokeWidth={1.5} size={15} />
          </button>

          <div className="dropdown-content rounded-box h-min w-52 gap-4 overflow-visible bg-base-200 p-2 shadow">
            {user?.id === author.id && (
              <>
                <CompactMenuItem
                  onClick={todo}
                  side="left"
                  icon={<FiEdit2 />}
                  name="edit post"
                />
                <CompactMenuItem
                  onClick={() => {
                    deletePost.mutate(post.id);
                  }}
                  side="left"
                  icon={<BsTrash />}
                  name="delete post"
                />
              </>
            )}
            <CompactMenuItem
              onClick={todo}
              side="left"
              icon={<BsReply />}
              name="reply"
            />
            <CompactMenuItem
              onClick={() => {
                copyLink();
              }}
              side="left"
              icon={<RiHashtag />}
              name="copy link"
            />
          </div>
        </div>
      </SignedIn>
    </div>
  );

  let content = (
    <div className="w-[30rem] text-ellipsis  text-base-content">
      <Link href={`/post/${post.id}`}>{post.content}</Link>
    </div>
  );

  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  let likes_text = formatter.format(likesAmount);
  let like_text_color = liked ? "text-base-100" : "text-secondary-content";

  const likes = (
    <div className="flex h-full w-full items-center justify-center">
      <button
        className="btn-secondary btn-square btn relative border-0 bg-base-100 hover:bg-base-100"
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
        `my-1 flex h-min flex-col rounded-xl border border-base-300 p-4 ` +
        (expandable ? "pb-2" : "pb-4")
      }
    >
      <div className="flex flex-row gap-4">
        <div className="h-12 w-12 shrink-0 grow-0">
          {<UserAvatar profile={author} />}
        </div>

        <div className="relative flex grow flex-col">
          {metadata}

          <div className="flex grow flex-row overflow-hidden">
            <div className={isCollapsed ? " truncate" : ""}>{content}</div>
          </div>
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
