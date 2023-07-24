import {
	AiOutlineBulb,
	AiOutlineCheck,
	AiOutlineClose,
	AiOutlineExclamation,
	AiOutlineHeart,
	AiOutlineQuestion,
} from "react-icons/ai";
import { TbConfetti } from "react-icons/tb";
import { Post } from "~/server/api/routers/posts";
import { useUser } from "@supabase/auth-helpers-react";

export const ReactionBadge = ({
	reaction,
}: { reaction: Post["reactions"][number] }) => {
	const user = useUser();
	if (!user) return null;

	const isUserReacted = reaction.profileIds.find(
		(profileId) => profileId === user.id,
	);

	const badgeColor = isUserReacted ? "text-primary" : "";
	const personText = reaction.count <= 1 ? " person " : " people ";
	const tooltipText = reaction.count + personText + reaction.description;

	return (
		<span className="tooltip tooltip-bottom" data-tip={tooltipText}>
			<span
				key={reaction.postId + reaction.reactionId}
				className={`flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md hover:bg-base-200 badge-outline ${badgeColor}`}
			>
				{reaction.count}
				<ReactionToIcon reaction={reaction.name} />
			</span>
		</span>
	);
};

export const ReactionToIcon = ({ reaction }: { reaction: string }) => {
	switch (reaction) {
		case "Like":
			return <AiOutlineHeart />;
		case "Agree":
			return <AiOutlineCheck />;
		case "Disagree":
			return <AiOutlineClose />;
		case "Question":
			return <AiOutlineQuestion />;
		case "Important":
			return <AiOutlineExclamation />;
		case "Insightful":
			return <AiOutlineBulb />;
		case "Exciting":
			return <TbConfetti />;
		default:
			return <></>;
	}
};
