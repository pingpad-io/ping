import { useUser } from "@supabase/auth-helpers-react";
import { MessageSquareIcon, XIcon } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Thread } from "~/server/api/routers/threads";
import { api } from "~/utils/api";
import { ThreadLink } from "./ThreadLink";

export const ThreadEntry = ({ thread }: { thread: Thread }) => {
  if (!thread || !thread.name) return null;

  const user = useUser();
  const ctx = api.useUtils();
  const router = useRouter();
  const currentThread = router.asPath.split("/")[2] ?? "";
  const isCurrent = currentThread === thread.name;

  const deleteThread = api.threads.delete.useMutation({
    onSuccess: async () => {
      await ctx.threads.invalidate();
      await ctx.posts.invalidate();
      toast.success("Thread deleted!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2">
      <ThreadLink thread={thread.name}>
        <span className={`flex flex-row items-center gap-2 ${isCurrent && "font-bold"}`}>
          <span className={"hover:underline "}>{thread.title}</span>
          <span className={"text-sm"}>{thread.posts.length}</span>
          <MessageSquareIcon size={15} />
        </span>
      </ThreadLink>

      {user?.id === thread.authorId && (
        <button type="submit" onClick={() => deleteThread.mutate({ name: thread.name ?? "" })}>
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
};
