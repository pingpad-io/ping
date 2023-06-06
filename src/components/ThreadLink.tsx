import { useDispatch } from "react-redux";
import { api } from "~/utils/api";

export const ThreadLink = (props: { name: string; text?: string | null }) => {
  const setCurrentThread = useDispatch();
  const {
    data: thread,
    isLoading,
    isError,
  } = api.threads.getByName.useQuery(props.name, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: Infinity,
  });

  if (isLoading || isError || !thread) return null;

  return (
    <button
      onClick={() =>
        setCurrentThread({
          type: "SET_CURRENT_THREAD",
          payload: { id: thread.id, name: thread.name },
        })
      }
      className="hover:underline"
    >
      {props.text}
    </button>
  );
};
