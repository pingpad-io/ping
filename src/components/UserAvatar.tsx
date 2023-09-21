import Image from "next/image";
import Link from "next/link";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";

export function UserAvatar({
	profile,
}: {
	profile?: { avatar_url: string | null; username: string | null };
}) {
	return (
		<Link href={`/${profile?.username}`}>
			<Avatar className="w-full h-full">
				<AvatarImage
					alt={profile?.avatar_url ?? undefined}
					src={profile?.avatar_url ?? undefined}
				/>
				<AvatarFallback>{profile?.username?.slice(0, 2)}</AvatarFallback>
			</Avatar>
		</Link>
	);
}
