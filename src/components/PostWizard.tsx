import { useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { api } from "~/utils/api";
import { type State } from "~/utils/store";
import { UserAvatar } from "./UserAvatar";

export default function PostWizard({ placeholder, replyingTo }: { placeholder: string; replyingTo?: string | undefined }) {
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const user = useUser();
  const currentThreadId = useSelector((state: State) => state.currentThreadId);
  const { mutate: createPost, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async () => {
      setInput("");
      await ctx.posts.invalidate();
    },
    onError: (e) => {
      let error = "Something went wrong";
      switch (e.data?.code) {
        case "UNAUTHORIZED":
          error = "You must be logged in to post";
          break;
        case "FORBIDDEN":
          error = "You are not allowed to post";
          break;
        case "TOO_MANY_REQUESTS":
          error = "Slow down! You are posting too fast";
          break;
        case "BAD_REQUEST":
          error = "Invalid request";
          break;
        case "PAYLOAD_TOO_LARGE":
          error = "Your message is too big";
          break;
      }
      toast.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost({ content: input, threadId: currentThreadId, repliedToId: replyingTo });
  };

  const postButton = isPosting ? (
    <div className="btn-outline loading btn-circle btn"></div>
  ) : (
    input !== "" && (
      <button className="btn-outline btn-primary btn w-16" type="submit">
        Twot
      </button>
    )
  );

  return (
    <div className="z-20 flex w-full flex-row gap-4 bg-base-100/30 p-4 backdrop-blur-sm">
      {user && <PostWizardAuthed userId={user.id} />}
      <form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
        <input
          type="text"
          className="input-bordered input-ghost input shrink grow"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
        />
        {postButton}
      </form>
    </div>
  );
}

export const ThreadDivider = () => {
  const currentThreadId = useSelector((state: State) => state.currentThreadId);
  const { data: currentThread } = api.threads.getById.useQuery(currentThreadId);

  return (
    <div className="divider z-20 mx-2 -mt-2 mb-2 before:h-0 before:border-b before:border-base-300 after:h-0 after:border-b after:border-base-300">
      {currentThread?.name}
    </div>
  );
};

export const PostWizardAuthed = ({ userId }: { userId: string }) => {
  const { data: profile } = api.profiles.getProfileById.useQuery({
    id: userId,
  });

  return <UserAvatar profile={profile} online={true} />;
};
