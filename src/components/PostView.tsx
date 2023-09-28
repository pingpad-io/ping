import Link from "next/link";
import { useState, type Dispatch, type SetStateAction, useRef, useEffect } from "react";
import { PostMenu } from "./PostMenu";

import { ArrowDown, ArrowUp, Edit2Icon, ReplyIcon } from "lucide-react";
import { Post } from "~/server/api/routers/posts";
import Markdown from "./Markdown";
import { ReactionBadge } from "./Reactions";
import { ReactionsList } from "./ReactionsList";
import { SignedIn, SignedOut } from "./Signed";
import { TimeElapsedSince } from "./TimeLabel";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

export const PostView = ({ post }: { post: Post }) => {
	const author = post.author;

	return (
		<Card className="h-min max-w-2xl">
			<CardContent className="flex flex-row gap-4 p-2 sm:p-4">
				<div className="w-10 h-10 shrink-0 grow-0 rounded-full">
					<UserAvatar profile={author} />
				</div>
				<div className="flex w-3/4 shrink max-w-2xl grow flex-col place-content-start">
					<ReplyInfo post={post} />
					<PostInfo post={post} />

					<SignedIn>
						<HoverCard openDelay={150} closeDelay={300}>
							<HoverCardTrigger asChild>
								<span>
									<PostContent post={post} />
								</span>
							</HoverCardTrigger>
							<HoverCardContent className="p-1 w-fit" align="start">
								<ReactionsList post={post} />
							</HoverCardContent>
						</HoverCard>
					</SignedIn>

					<SignedOut>
						<PostContent post={post} />
					</SignedOut>

					<PostBadges post={post} />
				</div>
			</CardContent>
		</Card>
	);
};

export const PostExtensionButton = ({
	expandable,
	collapsed,
	setCollapsed,
}: {
	expandable: boolean;
	collapsed: boolean;
	setCollapsed: Dispatch<SetStateAction<boolean>>;
}) => {
	if (!expandable) return <div />;

	return (
		<div className={"flex flex-row justify-center -mb-2 "}>
			{collapsed ? (
				<button type="button" onClick={() => setCollapsed(false)}>
					<ArrowDown size={14} />
				</button>
			) : (
				<button type="button" onClick={() => setCollapsed(true)}>
					<ArrowUp size={14} />
				</button>
			)}
		</div>
	);
};
export const ReplyInfo = ({ post }: { post: Post }) => {
	const empty_space = <div className="" />;

	if (!post.repliedToId) return empty_space;

	const username = post.repliedTo?.author.username;
	const content = post.repliedTo?.content.substring(0, 100);
	const id = post.repliedTo?.id;

	return (
		<Link
			href={`/p/${id ?? ""}`}
			className="flex flex-row items-center gap-1 -mt-2 text-xs font-light leading-3"
		>
			<ReplyIcon size={14} className="shrink-0 scale-x-[-1] transform" />
			<span className="pb-0.5">@{username}:</span>
			<span className="truncate pb-0.5 ">{content}</span>
		</Link>
	);
};

export const PostInfo = ({ post }: { post: Post }) => {
	const author = post.author;
	const username = author.username ?? "";

	return (
		<div className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm">
			<Link className="flex gap-2" href={`/${username}`}>
				<span className="w-fit truncate font-bold">{author.full_name}</span>
				<span className="">{`@${username}`}</span>
			</Link>
			<span>{"·"}</span>
			<TimeElapsedSince date={post.createdAt} />
			<PostMenu post={post} />
		</div>
	);
};

export const PostContent = ({ post }: { post: Post }) => {
	const [collapsed, setCollapsed] = useState(true)
	const ref = useRef(null);

	// FIXME
	useEffect(() => {
	if (ref.current)
		// rome-ignore lint/complexity/useLiteralKeys: intended use
		setCollapsed(ref.current["scrollHeight"] > ref.current["clientHeight"]);
	})

	return (
		<div
			ref={ref}
			className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
				collapsed ? "line-clamp-2" : "line-clamp-none"
			}`}
		>
			<Markdown content={post.content} />
		</div>
	);
};

export const PostBadges = ({ post }: { post: Post }) => {
	return (
		<div className="flex flex-row items-center gap-2 leading-3 group -mb-1 mt-2">
			<ReplyCount post={post} />
			<ReactionList post={post} />
			<EditedIndicator post={post} />
		</div>
	);
};

export const ReplyCount = ({ post }: { post: Post }) => {
	const replyCount = post.replies.length;
	const replyText = replyCount <= 1 ? "reply" : "replies";
	const tooltipText = `${replyCount} ${replyText}`;

	return post.replies.length > 0 ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={`/p/${post.id}`}
						className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline hover:bg-base-200"
					>
						<Button
							variant="outline"
							size="icon"
							className="w-10 h-6 flex flex-row gap-1 leading-3 "
						>
							{post.replies.length}
							<ReplyIcon size={14} className="" />
						</Button>
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	) : (
		<></>
	);
};

export const ReactionList = ({ post }: { post: Post }) => {
	return (
		<>
			{post.reactions.map((reaction) => (
				<ReactionBadge
					key={post.id + reaction.reactionId}
					reaction={reaction}
					post={post}
				/>
			))}
		</>
	);
};

export const EditedIndicator = ({ post }: { post: Post }) => {
	const editCount = 1; // TODO: add editCount to schema
	const lastUpdated = post.updatedAt.toLocaleString();
	const tooltipText = `last updated at ${lastUpdated}`;

	return post.createdAt.toUTCString() !== post.updatedAt.toUTCString() ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="w-8 h-6 flex flex-row gap-1 leading-3 "
					>
						<Edit2Icon size={14} className="shrink-0 scale-x-[-1] transform" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{tooltipText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	) : (
		<></>
	);
};
