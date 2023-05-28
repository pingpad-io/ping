import { FiGlobe, FiMessageCircle, FiX } from "react-icons/fi";
import { api } from "~/utils/api";
import { MenuItem } from "./MenuItem";

import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_THREAD_ID, State } from "~/utils/store";
import ModalWizard from "./ModalWizard";
import ThreadWizard from "./ThreadWizard";

export default function Thread() {
  let { data: threads, isLoading } = api.threads.getAll.useQuery();
  let currentThread = useSelector((state: State) => state.currentThread);
  let setCurrentThread = useDispatch();
  let user = useUser();
  let ctx = api.useContext();

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

  let threadList = threads?.map((thread) => {
    return (
      <div
        key={thread.id}
        className="flex flex-row place-items-center gap-2 px-4 py-2"
      >
        <button
          onClick={() =>
            setCurrentThread({ type: "SET_CURRENT_THREAD", payload: thread.id })
          }
          className="hover:underline"
        >
          {thread.title}
        </button>

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
        <div className="flex flex-row place-content-between">
          <div className="card-title">Threads</div>
          <ModalWizard wizardChildren={<ThreadWizard />}>
            <BsPlus size={27} />
          </ModalWizard>
        </div>
        <div className="card-content">{threadList}</div>
      </div>
    </>
  );
}
