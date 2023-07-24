import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { BsReply, BsTrash } from "react-icons/bs";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { RiHashtag } from "react-icons/ri";
import { api } from "~/utils/api";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { Post } from "~/server/api/routers/posts";
import { AiOutlinePlus } from "react-icons/ai";
import { ReactionBadge, ReactionToIcon } from "./Reactions";

export const ReactionsMenu = ({ post }: { post: Post }) => {
	return (
		<SignedIn>
			<div className="dropdown-right dropdown dropdown-hover">
				<button
					type="button"
					className="hidden text-xs text-center btn btn-ghost btn-xs group-hover:flex leading-3 btn-circle -my-1"
				>
					<AiOutlinePlus />
				</button>

				<div className="dropdown-content dropdown-right dropdown-end flex flex-row rounded-box gap-1 justify-center bg-base-200 p-2 -mt-3 shadow">
					<ReactionsList post={post} />
				</div>
			</div>
		</SignedIn>
	);
};

export function ReactionsList  ({ post }: { post: Post }) {
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

	const reactionsList = reactions.map((reaction) => (
		<button
			type="button"
			className="btn btn-xs btn-circle"
			onClick={(_e) => addReaction(reaction.id)}
			key={reaction.id}
		>
			{ReactionToIcon({ reaction: reaction.name })}
		</button>
	));

	return <>{reactionsList}</>
}
