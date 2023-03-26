import { useUser } from "@clerk/nextjs";

export const UserAvatar = () => {
  let user = useUser();
  if (!user) return null;

  return (
    <div className="online avatar ">
      <div className="w-14 rounded-full ">
        <img
          src={user.user?.profileImageUrl}
          alt={"profile image"}
        />
      </div>
    </div>
  );
};
