import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsReply, BsTrash } from "react-icons/bs";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { RiArrowDownSLine, RiArrowUpSLine, RiHashtag } from "react-icons/ri";
import { api, type RouterOutputs } from "~/utils/api";
import { FlairView } from "./FlairView";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { TimeElapsedSince } from "./TimeLabel";
import { UserAvatar } from "./UserAvatar";

export type Post = RouterOutputs["posts"]["getAll"][number];
export const lineHeight = 1.5;
export const maxHeight = 6 * lineHeight * 16; // Assumes font size of 16px
export const maxLength = 45 * 3 - 3;

export const PostView = ({ data }: { data: Post }) => {
  const post = data.post;
  const author = data.author;
  const [collapsed, setCollapsed] = useState(true);
  const expandable = post.content.length > maxLength;

  return (
    <div className={`rounded-box flex h-min max-w-2xl shrink flex-col border border-base-300 p-4 ${expandable ? "pb-2" : ""}`}>
      <div className="flex flex-row gap-4">
        <UserAvatar profile={author} />

        <div className="grow flex-col">
          <PostInfo data={data} />
          <PostContent post={post} collapsed={collapsed} />
        </div>

        <LikeButton post={post} />
      </div>

      <PostExtensionButton collapsed={collapsed} setCollapsed={setCollapsed} expandable={expandable} />
    </div>
  );
};

export const PostExtensionButton = ({
  expandable,
  collapsed,
  setCollapsed,
}: {
  expandable: boolean;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className={`flex flex-row justify-center ` + (expandable ? "mb-2" : "")}>
      {expandable &&
        (collapsed ? (
          <button onClick={() => setCollapsed(false)}>
            <RiArrowDownSLine />
          </button>
        ) : (
          <button onClick={() => setCollapsed(true)}>
            <RiArrowUpSLine />
          </button>
        ))}
    </div>
  );
};

export const PostContent = ({ post, collapsed }: { post: Post["post"]; collapsed: boolean }) => {
  const needsTruncation = post.content.length > maxLength;
  const truncatedMessage = needsTruncation ? post.content.slice(0, maxLength) + "..." : post.content;

  return (
    <Link className="w-9/12 grow flex-col" href={`/post/${post.id}`}>
      <p className="truncate whitespace-pre-wrap break-words">{collapsed ? truncatedMessage : post.content}</p>
    </Link>
  );
};

export const PostInfo = ({ data }: { data: Post }) => {
  const post = data.post;
  const author = data.author;
  const username = author.username ?? "";

  return (
    <div className=" group flex flex-row place-items-center gap-2 text-sm font-light text-base-content ">
      <Link className="flex gap-2" href={`/${username}`}>
        <span className="font-bold ">{author.full_name}</span>
        <AuthorFlair author={author} />

        <span className="">{`@${username}`}</span>
      </Link>
      <span>{`·`}</span>
      <span>
        <TimeElapsedSince date={post.createdAt} />
      </span>

      <span className="hidden group-hover:flex">
        <PostMenu data={data} />
      </span>
    </div>
  );
};

export const AuthorFlair = ({ author }: { author: Post["author"] }) => {
  return (
    <>
      {author.flairs.length > 0 && (
        <span className="h-min">
          <FlairView flair={author.flairs.at(0)} size="xs" />
        </span>
      )}
    </>
  );
};

export const PostMenu = ({ data }: { data: Post }) => {
  const user = useUser();
  const ctx = api.useContext();

  const author = data.author;
  const post = data.post;

  const postIdText = "#" + post.id.substring(post.id.length - 8).toLowerCase();

  const todo = () => {
    Function.prototype();
  };
  const { mutate: deletePost } = api.posts.deleteById.useMutation({
    onSuccess: async () => {
      await ctx.posts.invalidate();
    },
    onError: (error) => {
      toast.error("Error deleting post " + error.message);
    },
  });

  const copyLink = () => {
    navigator.clipboard.writeText(postIdText).then(
      function () {
        toast.success("Copied link to clipboard");
      },
      function () {
        toast.error("Error copying link to clipboard!");
      }
    );
  };

  return (
    <SignedIn>
      <div className="dropdown-right dropdown -mb-1 mt-1 font-normal">
        <button>
          <FiMoreHorizontal strokeWidth={1.5} size={15} />
        </button>

        <div className="dropdown-content rounded-box h-min w-52 gap-4 overflow-visible bg-base-200 p-2 shadow">
          {user?.id === author.id && (
            <>
              <CompactMenuItem onClick={todo} side="left" icon={<FiEdit2 />} text="edit post" />
              <CompactMenuItem
                onClick={() => {
                  deletePost(post.id);
                }}
                side="left"
                icon={<BsTrash />}
                text="delete post"
              />
            </>
          )}
          <CompactMenuItem onClick={todo} side="left" icon={<BsReply />} text="reply" />
          <CompactMenuItem
            onClick={() => {
              copyLink();
            }}
            side="left"
            icon={<RiHashtag />}
            text="copy link"
          />
        </div>
      </div>
    </SignedIn>
  );
};

export const LikeButton = ({ post }: { post: Post["post"] }) => {
  const user = useUser();
  const ctx = api.useContext();
  const wasLiked = post.likers.find((liker) => liker.id === user?.id) !== undefined;
  const [liked, setLiked] = useState(wasLiked);
  const [likesAmount, setLikesAmount] = useState(post.likers.length > 0 ? post.likers.length : 0);

  const { mutate: sendLike } = api.posts.likeById.useMutation({
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
    sendLike(post.id);
  };

  useEffect(() => {
    if (!user) {
      setLiked(false);
    }
  }, [user]);

  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  const likes_text = formatter.format(likesAmount);
  const like_text_color = liked ? "text-base-100" : "text-secondary-content";

  return (
    <div className="h-12 w-12 items-center justify-center">
      <button className="btn-secondary btn-square btn relative border-0 bg-base-100 hover:bg-base-100" onClick={() => like()}>
        <span className={`text-md absolute z-10 flex items-center justify-center font-bold ` + like_text_color}>
          {likesAmount > 0 ? likes_text : ""}
        </span>

        <span className="absolute flex items-center justify-center">
          {liked ? <AiFillHeart size={35} /> : <AiOutlineHeart size={35} />}
        </span>
      </button>
    </div>
  );
};
