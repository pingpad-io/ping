import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { api } from "~/utils/api";

export const ThreadLink = (props: PropsWithChildren & { threadName: string; text?: string | null }) => {
  const setCurrentThread = useDispatch();
  const router = useRouter();

  const {
    data: thread,
    isLoading,
    isError
  } = api.threads.getByName.useQuery(props.threadName, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: Infinity
  });

  const ready = !isLoading && !isError && thread;

  return (
    <>
      {ready ? (
        <button
          onClick={() => {
            setCurrentThread({
              type: "SET_CURRENT_THREAD",

              payload: {
                id: thread?.id,
                name: thread?.name
              }
            });
            router.push("/");
          }}
        >
          {props.text}
          {props.children}
        </button>
      ) : (
        <>
          {props.text}
          {props.children}
        </>
      )}
    </>
  );
};
