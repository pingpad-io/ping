import { useUser } from "@clerk/nextjs";
import { UserAvatar } from "./UserAvatar";

export default function PostWizard() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex flex-row gap-4 p-4">
      <UserAvatar />
      <input
        type="text"
        className="input-bordered input-ghost input w-full"
        placeholder="write a new twot?.."
      />
    </div>
  );
}
