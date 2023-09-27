import { Post } from "~/server/api/routers/posts";
import { useUser } from "@supabase/auth-helpers-react";
import {
	AlertCircleIcon,
	CheckIcon,
	HeartIcon,
	HelpCircleIcon,
	LightbulbIcon,
	PartyPopperIcon,
	XIcon,
} from "lucide-react";

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
			return <HeartIcon size={14} />;
		case "Agree":
			return <CheckIcon size={14} />;
		case "Disagree":
			return <XIcon size={14} />;
		case "Question":
			return <HelpCircleIcon size={14} />;
		case "Important":
			return <AlertCircleIcon size={14} />;
		case "Insightful":
			return <LightbulbIcon size={14} />;
		case "Exciting":
			return <PartyPopperIcon size={14} />;
		default:
			return <></>;
	}
};
