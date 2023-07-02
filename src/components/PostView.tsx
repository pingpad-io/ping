import Link from "next/link";
import { useState, type Dispatch, type SetStateAction } from "react";
import { PostMenu } from "./PostMenu";

import { FiEdit2 } from "react-icons/fi";
import { LuReply } from "react-icons/lu";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { type RouterOutputs } from "~/utils/api";
import { FlairView } from "./FlairView";
import { TimeElapsedSince } from "./TimeLabel";
import { UserAvatar } from "./UserAvatar";
import { ReactionBadge } from "./Reactions";
import { Post } from "~/server/api/routers/posts";

const maxLength = 45 * 3 - 3;

export const PostView = ({ post }: { post: Post }) => {
	const author = post.author;
	const [collapsed, setCollapsed] = useState(true);
	const expandable = post.content.length > maxLength;

	return (
		<div className="flex flex-row gap-4 rounded-box h-min max-w-2xl border border-base-300 p-2 sm:p-4">
			<div className="w-8 h-8 shrink-0 grow-0 sm:w-12 sm:h-12 ring rounded-full ring-1 ring-base-300">
				<UserAvatar profile={author} />
			</div>
			<div className="flex w-3/4 shrink max-w-2xl grow flex-col place-content-start">
				<ReplyInfo post={post} />
				<PostInfo post={post} />
				<PostContent post={post} collapsed={collapsed} />
				<MetaInfo post={post} />
				<PostExtensionButton
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					expandable={expandable}
				/>
			</div>
			{/* <LikeButton post={post} /> */}
		</div>
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
					<RiArrowDownSLine />
				</button>
			) : (
				<button type="button" onClick={() => setCollapsed(true)}>
					<RiArrowUpSLine />
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
			<LuReply className="shrink-0 scale-x-[-1] transform" strokeWidth={1.5} />
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
				<AuthorFlair author={author} />
				<span className="">{`@${username}`}</span>
			</Link>
			<span>{"·"}</span>
			<TimeElapsedSince date={post.createdAt} />
			<span className="hidden group-hover:flex">
				<PostMenu post={post} />
			</span>
		</div>
	);
};

export const AuthorFlair = ({ author }: { author: Post["author"] }) => {
	return (
		<>
			{author.flairs.length > 0 && (
				<span className="hidden sm:flex py-0.5">
					<FlairView flair={author.flairs.at(0)} size="xs" />
				</span>
			)}
		</>
	);
};

export const PostContent = ({
	post,
	collapsed,
}: { post: Post; collapsed: boolean }) => {
	return (
		<Link href={`/p/${post.id}`}>
			<p
				className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-min ${
					collapsed ? "line-clamp-2" : "line-clamp-none"
				}`}
			>
				{post.content}
			</p>
		</Link>
	);
};

export const MetaInfo = ({ post }: { post: Post }) => {
	return (
		<div className="flex flex-row gap-2 leading-3 pt-2 -mb-1 text-secondary-content/50 ">
			<ReactionList post={post} />
			<ReplyCount post={post} />
			<EditedIndicator post={post} />
		</div>
	);
};

export const ReactionList = ({ post }: { post: Post }) => {
	const list = post.reactions.map((reaction) => {
		return <ReactionBadge reaction={reaction} key={reaction.id} />;
	});

	return <>{list}</>;
};

export const ReplyCount = ({ post }: { post: Post }) => {
	return (
		<>
			{post.replies.length > 0 && (
				<span className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline ">
					{post.replies.length}
					<LuReply className="shrink-0 scale-x-[-1] transform" />
				</span>
			)}
		</>
	);
};

export const EditedIndicator = ({ post }: { post: Post }) => {
	return (
		<>
			{post.createdAt.toUTCString() !== post.updatedAt.toUTCString() && (
				<span className="flex flex-row gap-1 leading-3 badge badge-sm sm:badge-md badge-outline ">
					<FiEdit2 className="shrink-0 scale-x-[-1] transform" />
					edited
				</span>
			)}
		</>
	);
};
