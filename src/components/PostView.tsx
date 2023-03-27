import { useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const PostView = ({ post }: { post: Post }) => {
  const { user } = useUser();

  let date = post.createdAt.toLocaleDateString(); // TODO: add tooltip
  let time = dayjs(post.createdAt).fromNow();
  let id = post.authorId.substring(post.authorId.length - 7);
  let username = "@" + id.toLocaleLowerCase();
  let youText =
    user?.id === post.authorId ? (
      <span className="text-slate-400">(you)</span>
    ) : (
      <></>
    );

  return (
    <div className="mt-2 border-b-2 border-slate-700 p-4">
      <div className="flex flex-row gap-2 text-sm">
        <div className="">
          {username} {youText}
        </div>
        <div>·</div>
        <div className="">{time}</div>
      </div>
      <div className="text-lg">{post.content}</div>
    </div>
  );
};