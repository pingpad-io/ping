import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export const UserAvatar = () => {
  let { user } = useUser();
  if (!user) return null;

  return (
    <div className="online avatar ">
      <div className="w-12 rounded-full ">
        <Image
          src={user.profileImageUrl}
          alt={"profile image"}
          width={48}
          height={48}
          placeholder="empty"
        />
      </div>
    </div>
  );
};
