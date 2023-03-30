import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";

export default function PostWizard() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.invalidate();
    },
    onError: (e) => {
      let errorText = e.data?.zodError?.fieldErrors.content || [
        "Failed to post. Try again later",
      ];
      toast.error(errorText[0]!);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ content: input });
  };

  const postButton = isPosting ? (
    <>
      <div className="loading btn-outline btn w-16"></div>
    </>
  ) : (
    <>
      {input !== "" && (
        <button className="btn-outline btn w-16" type="submit">
          Post
        </button>
      )}
    </>
  );

  if (!user) return null;

  return (
    <div className="z-10 flex flex-col sticky top-0 ">
      <div className="flex flex-row gap-4 z-10 p-4 bg-base-100">
        <UserAvatar />
        <form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            className="input-bordered input-ghost input shrink grow"
            placeholder="write a new twot?.."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isPosting}
          />
          {postButton}
        </form>
      </div>
      <div className="divider m-0 bg-base-100/[.5]">Global</div>
    </div>
  );
}
