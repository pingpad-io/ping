import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { Post } from "~/server/api/routers/posts";
import { ReactionsList } from "./ReactionsMenu";
import { EditIcon, LinkIcon, MoreHorizontalIcon, ReplyIcon, TrashIcon } from "lucide-react";

export const PostMenu = ({ post }: { post: Post }) => {
	const user = useUser();
	const ctx = api.useContext();

	const author = post.author;
	const origin =
		typeof window !== "undefined" && window.location.origin
			? window.location.origin
			: "";
	const postLink = `${origin}/p/${post.id}`;

	const todo = () => {
		toast.error("Not	implemented yet");
	};

	const { mutate: deletePost } = api.posts.delete.useMutation({
		onSuccess: async () => {
			await ctx.posts.invalidate();
		},
		onError: (error) => {
			toast.error(`Error deleting post ${error.message}`);
		},
	});

	const copyLink = () => {
		navigator.clipboard.writeText(postLink).then(
			function () {
				toast.success("Copied link to clipboard");
			},
			function () {
				toast.error("Error copying link to clipboard!");
			},
		);
	};

	return (
		<SignedIn>
			<div className="dropdown-right dropdown -mb-1 font-normal">
				<button type="button">
					<MoreHorizontalIcon size={14} />
				</button>

				<div className="dropdown-content rounded-box h-min w-52 gap-4 overflow-visible bg-base-200 p-2 shadow">
					<span className="pl-1">
						<ReactionsList post={post} />
					</span>
					{user?.id === author.id && (
						<>
							<CompactMenuItem
								onClick={todo}
								side="left"
								icon={<EditIcon size={14} />}
								text="edit post"
							/>
							<CompactMenuItem
								onClick={() => {
									deletePost(post.id);
								}}
								side="left"
								icon={<TrashIcon size={14} />}
								text="delete post"
							/>
						</>
					)}

					<CompactMenuItem
						href={`/p/${post.id}`}
						side="left"
						icon={<ReplyIcon size={14} />}
						text="reply"
					/>
					<CompactMenuItem
						onClick={() => {
							copyLink();
						}}
						side="left"
						icon={<LinkIcon size={14} />}
						text="copy link"
					/>
				</div>
			</div>
		</SignedIn>
	);
};
