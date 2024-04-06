import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import Link from "next/link";
import { Author } from "~/types/post";

export function UserAvatar({ author }: { author: Author }) {

  return (
    <Link href={`/${author.handle}`}>
      <Avatar className="w-full h-full">
        <AvatarImage alt={author.profilePictureUrl ?? undefined} src={author.profilePictureUrl ?? undefined} />
        <AvatarFallback>{author.handle.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
