import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RouterOutputs, api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";

export type Post = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({ data }: { data: Post }) => {
  const author = data.author;
  const post = data.post;
  const username = author.username;
  const postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();
  const [liked, setLiked] = useState(false);
  const user = useUser();

  const sendLike = api.posts.like.useMutation({
    onSuccess: () => {},
    onError: () => {
      toast.error("Error liking post");
    },
  });

  let like = () => {
    setLiked(!liked);
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
      <div className="text-lg text-base-content">{post.content}</div>
    </Link>
  );

  let hearts = (
    <div className="flex h-full w-full items-center justify-center">
      <button
        className="btn-square btn border-0 bg-base-100 hover:bg-base-100"
        onClick={() => like()}
      >
        {liked ? <AiFillHeart size={30} /> : <AiOutlineHeart size={30} />}
      </button>
    </div>
  );

  return (
    <div className="my-1 flex flex-row gap-4 rounded-xl border border-base-300 p-4">
      <div className="h-12 w-12 shrink-0 grow-0">{avatar}</div>
      <div className="grow">
        {metadata}
        {content}
      </div>
      <div className="h-12 w-12 items-center justify-center">{hearts}</div>
    </div>
  );
};
