import { FiMessageSquare, FiX } from "react-icons/fi";
import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ThreadLink } from "./ThreadLink";
import { Thread } from "~/server/api/routers/threads";
import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import ThreadWizard from "./ThreadWizard";

export function GlobalThreads() {
	const { data: threads } = api.threads.get.useQuery({});

	const globalThreadList = threads?.map((thread) => {
		if (!thread.name) return null;

		return <ThreadEntry key={thread.id} thread={thread} />;
	});

	return <div className="card-content">{globalThreadList}</div>;
}

const ThreadEntry = ({ thread }: { thread: Thread }) => {
	if (!thread || !thread.name) return null;

	const user = useUser();
	const ctx = api.useContext();
	const router = useRouter();
	const currentThread = router.asPath.split("/")[2] ?? "";
	const isGlobal = thread.authorId === null;
	const isCurrent = currentThread === thread.name;

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
				<span
					className={`flex flex-row items-center gap-2 ${
						isCurrent && "font-bold"
					}`}
				>
					<span className={"hover:underline "}>{thread.title}</span>
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
		<div className="flex flex-col justify-center p-4 ">
			<div className="flex flex-row place-items-center gap-4">
				<Link href={"/t"}>Threads</Link>

				<Dialog>
					<DialogTrigger asChild>
						<Button size="icon" variant="ghost" className="w-8 h-8">
							<PlusIcon size="20" />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<ThreadWizard />
					</DialogContent>
				</Dialog>
			</div>

			<GlobalThreads />
		</div>
	);
}
