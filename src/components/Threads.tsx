import { FiMessageSquare, FiX } from "react-icons/fi";
import { api } from "~/utils/api";
import { BiLabel } from "react-icons/bi";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import ModalWizard from "./ModalWizard";
import { ThreadLink } from "./ThreadLink";
import ThreadWizard from "./ThreadWizard";
import { Thread } from "~/server/api/routers/threads";

export function GlobalThreads() {
	const { data: threads } = api.threads.get.useQuery({});
	const globalThreads = threads?.filter((thread) => thread.authorId === null);

	const globalThreadList = globalThreads?.map((thread) => {
		if (!thread.name) return null;

		return <ThreadEntry key={thread.id} thread={thread} />;
	});

	return <div className="card-content">{globalThreadList}</div>;
}

export function UserThreads() {
	const { data: threads } = api.threads.get.useQuery({});
	const userThreads = threads?.filter((thread) => thread.authorId !== null);

	const userThreadList = userThreads?.map((thread) => {
		return <ThreadEntry thread={thread} key={thread.id} />;
	});

	return <div className="card-content">{userThreadList}</div>;
}

const ThreadEntry = ({ thread }: { thread: Thread }) => {
	const user = useUser();
	const ctx = api.useContext();

	if (!thread || !thread.name) return null;

	const isGlobal = thread.authorId === null;
	const deleteThread = api.threads.delete.useMutation({
		onSuccess: async () => {
			await ctx.threads.invalidate();
			await ctx.posts.invalidate();
			toast.success("Thread deleted!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div
			key={thread.id}
			className="flex flex-row place-items-center gap-2 px-4 py-2"
		>
			<ThreadLink thread={thread.name}>
				<span className="flex flex-row items-center gap-2">
					{isGlobal && <BiLabel />}
					<span className="hover:underline">{thread.title}</span>
					<span className={"text-sm"}>{thread.posts.length}</span>
					<FiMessageSquare />
				</span>
			</ThreadLink>

			{user?.id === thread.authorId && (
				<button
					type="submit"
					onClick={() => deleteThread.mutate({ name: thread.name ?? "" })}
				>
					<FiX />
				</button>
			)}
		</div>
	);
};

export default function Threads() {
	return (
		<div className="card flex-col justify-center p-4 ">
			<div className="flex gap-4">
				<Link href={"/t"} className="card-title">
					Threads
				</Link>
				<ModalWizard wizardChildren={<ThreadWizard />}>
					<BsPlus size={27} />
				</ModalWizard>
			</div>
			<div className="card-content">
				<GlobalThreads />
			</div>
			<div className="card-content">
				<UserThreads />
			</div>
		</div>
	);
}
