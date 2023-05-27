import { FiCrosshair, FiGlobe, FiMessageCircle } from "react-icons/fi";
import { MenuItem } from "./MenuItem";
import { api } from "~/utils/api";

import { connect, ConnectedProps, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { RiCloseLine } from "react-icons/ri";
import { BsPlus } from "react-icons/bs";
import { State } from "~/utils/store";

export default function Thread() {
  let { data: threads, isLoading } = api.threads.getAll.useQuery();
  let currentThread = useSelector((state: State) => state.currentThread);
  let setCurrentThread = useDispatch();

  let threadList = threads?.map((thread) => {
    return (
      <div key={thread.id} className="px-4 py-2">
        <button
          onClick={() =>
            setCurrentThread({ type: "SET_CURRENT_THREAD", payload: thread.id })
          }
          className="hover:underline"
        >
          {thread.title}
        </button>
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
            <button onClick={() => {}}>
                <BsPlus size={27} />
            </button>
        </div>
        <div className="card-content">
            {threadList}
        </div>
      </div>
    </>
  );
}