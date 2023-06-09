import { FiX } from "react-icons/fi";
import { api } from "~/utils/api";

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

    return (
      <div key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2 hover:underline">
        <ThreadLink threadName={thread.name} text={thread.title} />
      </div>
    );
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
  const user = useUser();
  const userThreads = threads?.filter((thread) => thread.authorId !== null);
  const deleteThread = api.threads.delete.useMutation({
    onSuccess: () => {
      const ctx = api.useContext();
      const setCurrentThread = useDispatch();
      ctx.threads.invalidate();
      ctx.posts.invalidate();
      setCurrentThread({
        type: "SET_CURRENT_THREAD",
        payload: GLOBAL_THREAD_ID,
      });
      toast.success("Thread deleted!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const userThreadList = userThreads?.map((thread) => {
    if (!thread.name) return null;

    return (
      <div key={thread.id} className="flex flex-row place-items-center gap-2 px-4 py-2 hover:underline">
        <ThreadLink threadName={thread.name} text={thread.title} />

        <span className="text-xs text-base-content">(@{thread.author?.username})</span>

        {user?.id === thread.authorId && (
          <button
            onClick={() => {
              deleteThread.mutate({ id: thread.id });
            }}
          >
            <FiX />
          </button>
        )}
      </div>
    );
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
