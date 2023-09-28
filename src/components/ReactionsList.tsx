import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { Post } from "~/server/api/routers/posts";
import { ReactionIcon } from "./Reactions";
import { Button } from "./ui/button";

export function ReactionsList({ post }: { post: Post }) {
	const user = useUser();
	const ctx = api.useContext();
	const { data: reactions } = api.reactions.get.useQuery({});
	const { mutate: react } = api.reactions.react.useMutation({
		onSuccess: () => {
			ctx.posts.invalidate();
		},
		onError: (e) => {
			toast.error(e.message);
		},
	});

	if (!reactions || !user) return null;

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
					<ReactionIcon reaction={reaction.name} />
				</Button>
			))}
		</div>
	);
}
