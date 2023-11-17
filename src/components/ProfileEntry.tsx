import { Profile } from "@prisma/client";
import { UserAvatar } from "./UserAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const ProfileEntry = ({ profile }: { profile: Profile }) => {
  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Avatar className="w-8 h-8">
        <AvatarImage alt={profile?.avatar_url ?? undefined} src={profile?.avatar_url ?? undefined} />
        <AvatarFallback>{profile?.username?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <p className="font-bold truncate min-w-fit">{profile.full_name}</p>
      <p className="font-light truncate">(@{profile.username})</p>
    </div>
  );
};
