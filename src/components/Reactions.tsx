import { AiOutlineBulb, AiOutlineHeart } from "react-icons/ai";
import { BsExclamation, BsQuestion } from "react-icons/bs";
import { GiCheckMark, GiCrossMark } from "react-icons/gi";
import { RiEmotionLaughLine } from "react-icons/ri";
import { TbConfetti } from "react-icons/tb";
import { ImWondering } from "react-icons/im";
import { RiEmotionNormalLine } from "react-icons/ri";
import { Reaction } from "@prisma/client";

export const ReactionBadge = ({
	reaction,
	count,
}: { reaction: Reaction; count: number }) => {
	return (
		<span
			key={reaction}
			className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline "
		>
			{count}
			<ReactionToIcon reaction={reaction} />
		</span>
	);
};

export const ReactionToIcon = ({ reaction }: { reaction: Reaction }) => {
	switch (reaction) {
		case Reaction.Like:
			return <AiOutlineHeart />;
		case Reaction.Agree:
			return <GiCheckMark />;
		case Reaction.Disagree:
			return <GiCrossMark />;
		case Reaction.Funny:
			return <RiEmotionLaughLine />;
		case Reaction.Exciting:
			return <TbConfetti />;
		case Reaction.Important:
			return <BsExclamation />;
		case Reaction.Question:
			return <BsQuestion />;
		case Reaction.Neutral:
			return <RiEmotionNormalLine />;
		case Reaction.Thinking:
			return <ImWondering />;
		case Reaction.Insightful:
			return <AiOutlineBulb />;
	}
};
