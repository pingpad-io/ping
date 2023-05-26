import { FiGlobe, FiMessageCircle } from "react-icons/fi";
import { MenuItem } from "./MenuItem";
import { api } from "~/utils/api";

import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { State } from "~/pages/store";
import { Thread } from "@prisma/client";

// Define types for component props
interface ThreadProps extends ConnectedProps<typeof connector> {}

// Define the component
function Thread({ currentThread, setCurrentThread }: ThreadProps) {
  let { data: threads, isLoading } = api.threads.getAll.useQuery();

  let threadList = threads?.map((thread) => {
    return (
      <div key={thread.id} className="px-4 py-2">
        <button
          onClick={() => setCurrentThread(thread)}
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
        <div className="card-title">Threads</div>
        {threadList}
        {currentThread?.title}
      </div>
    </>
  );
}

const mapStateToProps = (state: State) => ({
  currentThread: state.currentThread,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setCurrentThread: (thread: Thread) =>
    dispatch({ type: "SET_CURRENT_THREAD", payload: thread }),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(Thread);