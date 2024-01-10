import { useUser } from "@supabase/auth-helpers-react";
import { MessageSquareIcon, XIcon } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { PrivateThread, Thread } from "~/server/api/routers/threads";
import { api } from "~/utils/api";
import { ChatLink, ThreadLink } from "./Link";
import Image from "next/image";
import { Card } from "./ui/card";

export const PublicThread = ({ thread }: { thread: Thread }) => {
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
    <Card key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2">
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
    </Card>
  );
};

export const PirvateThread = ({ thread }: { thread: PrivateThread }) => {
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

  // Get avatars of other user in this thread
  const avatars = thread.users
    .map((threadMember) => {
      if (threadMember.id !== user?.id) {
        return threadMember.avatar_url;
      }
    })
    .filter((avatar) => avatar !== undefined);

  const otherUser = thread.users.find((threadMember) => threadMember.id !== user?.id);
  const title = thread.users.length === 2 ? otherUser?.full_name : thread.title;

  return (
    <div key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2">
      {avatars[0] && <Image src={avatars[0] ?? ""} className="rounded-full mx-1" alt="avatar" width={30} height={30} />}

      <ChatLink chat={thread.name}>
        <span className={`flex flex-row items-center gap-2 ${isCurrent && "font-bold"}`}>
          <span className={"hover:underline"}>{title}</span>
        </span>
      </ChatLink>

      {user?.id === thread.authorId && (
        <button type="submit" onClick={() => deleteThread.mutate({ name: thread.name ?? "" })}>
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
};
