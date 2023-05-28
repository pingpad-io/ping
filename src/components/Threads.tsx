import { FiGlobe, FiMessageCircle, FiX } from "react-icons/fi";
import { api } from "~/utils/api";
import { MenuItem } from "./MenuItem";

import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_THREAD_ID, State } from "~/utils/store";
import ModalWizard from "./ModalWizard";
import { ThreadLink } from "./ThreadLink";
import ThreadWizard from "./ThreadWizard";

export default function Thread() {
  let { data: threads } = api.threads.getAll.useQuery();
  let currentThread = useSelector((state: State) => state.currentThread);
  let setCurrentThread = useDispatch();
  let user = useUser();
  let ctx = api.useContext();

  let globalThreads = threads?.filter((thread) => thread.authorId === null);
  let userThreads = threads?.filter((thread) => thread.authorId !== null);

  let deleteThread = api.threads.delete.useMutation({
    onSuccess: () => {
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

  let globalThreadList = globalThreads?.map((thread) => {
    return (
      <div
        key={thread.id}
        className="flex flex-row place-items-center gap-2 px-4 py-2"
      >
        <ThreadLink id={thread.id} title={thread.title} />
      </div>
    );
  });

  let userThreadList = userThreads?.map((thread) => {
    return (
      <div
        key={thread.id}
        className="flex flex-row place-items-center gap-2 px-4 py-2"
      >
        <ThreadLink id={thread.id} title={thread.title} />

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
    <>
      <div className="flex-col gap-2 sm:flex xl:hidden">
        <MenuItem name={""} icon={<FiMessageCircle />}></MenuItem>
        <MenuItem name={""} icon={<FiGlobe />}></MenuItem>
      </div>

      <div className="card hidden flex-col justify-center bg-base-300 p-4 xl:flex">
        <div className="card-title">Threads</div>
        <div className="card-content">{globalThreadList}</div>
        <div className="flex flex-row place-content-between">
          <div className="card-title">User Threads</div>
          <ModalWizard wizardChildren={<ThreadWizard />}>
            <BsPlus size={27} />
          </ModalWizard>
        </div>
        <div className="card-content">{userThreadList}</div>
      </div>
    </>
  );
}
