import { FiX } from "react-icons/fi";
import { api } from "~/utils/api";

import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_THREAD_ID, State } from "~/utils/store";
import ModalWizard from "./ModalWizard";
import { ThreadLink } from "./ThreadLink";
import ThreadWizard from "./ThreadWizard";

export function GlobalThreads() {
  const { data: threads } = api.threads.getAll.useQuery();
  const globalThreads = threads?.filter((thread) => thread.authorId === null);

  const globalThreadList = globalThreads?.map((thread) => {
    return (
      <div
        key={thread.id}
        className="flex flex-row place-items-center gap-2 px-4 py-2"
      >
        <ThreadLink id={thread.id} text={thread.title} />
      </div>
    );
  });

  return (
    <div className="card-content">
      <div className="card-title">Threads</div>
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
        payload: DEFAULT_THREAD_ID,
      });
      toast.success("Thread deleted!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const userThreadList = userThreads?.map((thread) => {
    return (
      <div
        key={thread.id}
        className="flex flex-row place-items-center gap-2 px-4 py-2"
      >
        <ThreadLink id={thread.id} text={thread.title} />

        <span className="text-xs text-base-content">
          (@{thread.author?.username})
        </span>

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
  const { data: threads } = api.threads.getAll.useQuery();
  const currentThread = useSelector((state: State) => state.currentThread);

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
