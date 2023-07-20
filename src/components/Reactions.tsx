import { AiOutlineBulb, AiOutlineHeart } from "react-icons/ai";
import { BsExclamation, BsQuestion } from "react-icons/bs";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { RiEmotionLaughLine } from "react-icons/ri";
import { TbConfetti } from "react-icons/tb";
import { ImWondering } from "react-icons/im";
import { RiEmotionNormalLine } from "react-icons/ri";
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

	return (
		<span className="tooltip tooltip-bottom" data-tip={reaction.description}>
			<span
				key={reaction.postId + reaction.reactionId}
				className={`flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline ${badgeColor}`}
			>
				{reaction.count}
				<ReactionToIcon reaction={reaction} />
			</span>
		</span>
	);
};

export const ReactionToIcon = ({
	reaction,
}: { reaction: Post["reactions"][number] }) => {
	switch (reaction.name) {
		case "Like":
			return <AiOutlineHeart />;
		case "Agree":
			return <GiCheckMark />;
		case "Disagree":
			return <GiCrossMark />;
		case "Question":
			return <BsQuestion />;
		case "Important":
			return <BsExclamation />;
		case "Thinking":
			return <ImWondering />;
		case "Funny":
			return <RiEmotionLaughLine />;
		case "Neutral":
			return <RiEmotionNormalLine />;
		case "Exciting":
			return <TbConfetti />;
		case "Isightful":
			return <AiOutlineBulb />;
		default:
			return <></>;
	}
};
