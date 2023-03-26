import { Post } from "@prisma/client";

export const PostView = ({ post }: { post: Post }) => {
  let date = post.createdAt.toLocaleDateString();
  let time = post.createdAt.toLocaleTimeString();
  let user = "@" + post.authorId;

  return (
    <div className="mt-10 border-2 border-slate-800 p-4">
      <div className="flex flex-row gap-2 text-xs">
        <div className="">{user}</div>
        <div>|</div>
        <div className="">{date}</div>
        <div>|</div>
        <div className="">{time}</div>
      </div>
      <div className="">{post.content}</div>
    </div>
  );
};
