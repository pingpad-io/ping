import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { BsReply, BsTrash } from "react-icons/bs";
import { FiEdit2, FiMoreHorizontal } from "react-icons/fi";
import { RiHashtag } from "react-icons/ri";
import { api } from "~/utils/api";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { Post } from "./PostView";

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
		Function.prototype();
	};

	const { mutate: deletePost } = api.posts.deleteById.useMutation({
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
					<FiMoreHorizontal strokeWidth={1.5} size={15} />
				</button>

				<div className="dropdown-content rounded-box h-min w-52 gap-4 overflow-visible bg-base-200 p-2 shadow">
					{user?.id === author.id && (
						<>
							<CompactMenuItem
								onClick={todo}
								side="left"
								icon={<FiEdit2 />}
								text="edit post"
							/>
							<CompactMenuItem
								onClick={() => {
									deletePost(post.id);
								}}
								side="left"
								icon={<BsTrash />}
								text="delete post"
							/>
						</>
					)}
					<CompactMenuItem
						onClick={todo}
						side="left"
						icon={<BsReply />}
						text="reply"
					/>
					<CompactMenuItem
						onClick={() => {
							copyLink();
						}}
						side="left"
						icon={<RiHashtag />}
						text="copy link"
					/>
				</div>
			</div>
		</SignedIn>
	);
};
