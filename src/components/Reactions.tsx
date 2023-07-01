import { AiOutlineBulb, AiOutlineHeart } from "react-icons/ai";
import { BsExclamation, BsQuestion } from "react-icons/bs";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { RiEmotionLaughLine } from "react-icons/ri";
import { TbConfetti } from "react-icons/tb";
import { ImWondering } from "react-icons/im";
import { RiEmotionNormalLine } from "react-icons/ri";
import { Reaction } from "@prisma/client";

export const ReactionBadge = ({ reaction }: { reaction: Reaction }) => {
	return (
		<span className="tooltip tooltip-bottom" data-tip={reaction.description}>
			<span
				key={reaction.id}
				className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline "
			>
				{reaction.id}
				<ReactionToIcon reaction={reaction} />
			</span>
		</span>
	);
};

export const ReactionToIcon = ({ reaction }: { reaction: Reaction }) => {
	/// TODO
	switch (reaction.name) {
		case "Like":
			return <>Like</>;
		default:
			return <></>;
	}
};
