import { FiGlobe, FiMessageCircle } from "react-icons/fi";
import { MenuItem } from "./MenuItem";
import { api } from "~/utils/api";

export const Threads = () => {
  let {data: threads, isLoading} = api.threads.getAll.useQuery();

  let threadList = threads?.map((thread) => {
    return (
      <div key={thread.id} className="px-4 py-2">
        <a href="" className="hover:underline">{thread.title}</a>
      </div>
    );
  })

  return (
    <>
      <div className="flex-col gap-2 sm:flex xl:hidden">
        <MenuItem name={""} icon={<FiMessageCircle />}></MenuItem>
        <MenuItem name={""} icon={<FiGlobe />}></MenuItem>
      </div>

      <div className="card hidden flex-col justify-center bg-base-300 p-4 xl:flex">
        <div className="card-title">Threads</div>
        {threadList}
      </div>
    </>
  );
};
