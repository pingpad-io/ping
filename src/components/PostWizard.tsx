import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";

export default function PostWizard() {
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.invalidate();
    },
  });
  const [input, setInput] = useState("");

  if (!user) return null;

  return (
    <div className="flex flex-row gap-4 p-4">
      <UserAvatar />
      <form className="w-full" onSubmit={() => mutate({ content: input })}>
        <input
          type="text"
          className="input-bordered input-ghost input w-full"
          placeholder="write a new twot?.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
      </form>
    </div>
  );
}
