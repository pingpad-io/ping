import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

export default function ThreadWizard() {
  const ctx = api.useContext();
  const [input, setInput] = useState("");

  const { mutate, isLoading } = api.threads.create.useMutation({
    onSuccess: async () => {
      await ctx.threads.invalidate();
    },
    onError: (e) => {
      let error = "Something went wrong";
      switch (e.data?.code) {
        case "UNAUTHORIZED":
          error = "You must be logged in to post";
          break;
        case "FORBIDDEN":
          error = "You are not allowed to create threads";
          break;
        case "TOO_MANY_REQUESTS":
          error = "Slow down! You are too fast";
          break;
        case "BAD_REQUEST":
          error = "Invalid request";
          break;
      }
      toast.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ title: input });
  };

  return (
    <div className="card w-fit bg-base-100 p-4">
      <div className="flex flex-col items-center justify-center gap-2 text-lg">
        <h3>New Thread</h3>
        <form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            className="input-bordered input-ghost input shrink grow"
            placeholder="title..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
