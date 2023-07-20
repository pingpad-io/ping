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
	const user = useUser();
	const ctx = api.useContext();
	const addReaction = () => {};
	const { data: reactions } = api.reactions.get.useQuery({});
	if (!reactions) return null;

	const reactionBadges = reactions.map((reaction) => (
		<button
			type="button"
			className="btn btn-xs btn-circle"
			onClick={addReaction}
			key={reaction.id}
		>
			{ReactionToIcon({ reaction: reaction.name })}
		</button>
	));

	return (
		<SignedIn>
			<div className="dropdown-right dropdown font-normal">
				<button
					onClick={addReaction}
					type="button"
					className="hidden text-xs text-center btn btn-ghost btn-xs group-hover:flex leading-3 btn-circle -my-1"
				>
					<AiOutlinePlus />
				</button>

				<div className="dropdown-content dropdown-right dropdown-end flex flex-row rounded-box gap-1 justify-center bg-base-200 p-2 -mt-2 shadow">
					{reactionBadges}
				</div>
			</div>
		</SignedIn>
	);
};
