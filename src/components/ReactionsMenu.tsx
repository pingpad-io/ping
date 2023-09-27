import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { SignedIn } from "./Signed";
import { Post } from "~/server/api/routers/posts";
import { ReactionToIcon } from "./Reactions";
import { PlusIcon } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/src/components/ui/hover-card";

import { Button } from "./ui/button";

export const ReactionsMenu = ({ post }: { post: Post }) => {
	return <SignedIn />;
};

export function ReactionsList({ post }: { post: Post }) {
	const user = useUser();
	const ctx = api.useContext();
	const { data: reactions } = api.reactions.get.useQuery({});
	const { mutate: react } = api.reactions.react.useMutation({
		onError: (e) => {
			toast.error(e.message);
		},
		onSuccess: () => {
			ctx.posts.invalidate();
		},
	});

	if (!reactions) return null;
	if (!user) return null;

	const addReaction = (reactionId: number) => {
		react({ postId: post.id, profileId: user.id, reactionId: reactionId });
	};

	return (
		<div className="w-fit">
			{reactions.map((reaction) => (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="w-8 h-8"
					onClick={(_e) => addReaction(reaction.id)}
					key={reaction.id}
				>
					<ReactionToIcon reaction={reaction.name} />
				</Button>
			))}
		</div>
	);
}
