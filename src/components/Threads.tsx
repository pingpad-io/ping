import { FiMessageSquare, FiX } from "react-icons/fi";
import { api, type RouterOutputs } from "~/utils/api";

import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { GLOBAL_THREAD_ID } from "~/utils/store";
import ModalWizard from "./ModalWizard";
import { ThreadLink } from "./ThreadLink";
import ThreadWizard from "./ThreadWizard";

export function GlobalThreads() {
  const { data: threads } = api.threads.getAll.useQuery();
  const globalThreads = threads?.filter((thread) => thread.authorId === null);

  const globalThreadList = globalThreads?.map((thread) => {
    if (!thread.name) return null;

    return <ThreadEntry key={thread.id} thread={thread} />;
  });

  return (
    <div className="card-content">
      <Link href={"/threads"} className="card-title">
        Threads
      </Link>
      {globalThreadList}
    </div>
  );
}

export function UserThreads() {
  const { data: threads } = api.threads.getAll.useQuery();
  const userThreads = threads?.filter((thread) => thread.authorId !== null);

  const userThreadList = userThreads?.map((thread) => {
    return <ThreadEntry thread={thread} key={thread.id} />;
  });

  return (
    <div className="card-content">
      <div className="flex gap-4">
        <div className="card-title">User Threads</div>
        <ModalWizard wizardChildren={<ThreadWizard />}>
          <BsPlus size={27} />
        </ModalWizard>
      </div>
      {userThreadList}
    </div>
  );
}

export type Thread = RouterOutputs["threads"]["getById"];

const ThreadEntry = ({ thread }: { thread: Thread }) => {
  const setCurrentThread = useDispatch();
  const user = useUser();
  const ctx = api.useContext();

  if (!thread || !thread.name) return null;

  const deleteThread = api.threads.delete.useMutation({
    onSuccess: async () => {
      await ctx.threads.invalidate();
      await ctx.posts.invalidate();
      setCurrentThread({
        type: "SET_CURRENT_THREAD",
        payload: { id: GLOBAL_THREAD_ID, name: "global" },
      });
      toast.success("Thread deleted!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2">
      <ThreadLink threadName={thread.name}>
        <span className="flex flex-row items-center gap-2">
          <span className=" hover:underline">{thread.title}</span>
          <span className={`text-sm`}>{thread.posts.length}</span>
          <FiMessageSquare />
        </span>
      </ThreadLink>
      {user?.id === thread.authorId && (
        <button onClick={() => deleteThread.mutate({ id: thread.id })}>
          <FiX />
        </button>
      )}
    </div>
  );
};

export default function Threads() {
  return (
    <>
      <div className="card flex-col justify-center p-4 ">
        <div className="card-content">
          <GlobalThreads />
        </div>
        <div className="card-content">
          <UserThreads />
        </div>
      </div>
    </>
  );
}
