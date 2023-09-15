import { FiMessageSquare, FiX } from "react-icons/fi";
import { api } from "~/utils/api";
import { BiLabel } from "react-icons/bi";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BsPlus, BsStar } from "react-icons/bs";
import { ThreadLink } from "./ThreadLink";
import ThreadWizard from "./ThreadWizard";
import { Thread } from "~/server/api/routers/threads";
import { useRouter } from "next/router";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { PlusIcon } from "lucide-react";
import { DialogContent } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

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
		<div className="card flex-col justify-center p-4 ">
			<div className="flex gap-4">
				<Link href={"/t"} className="card-title">
					Threads
				</Link>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" size="icon">
							<PlusIcon />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<ThreadWizard />
					</DialogContent>
				</Dialog>
			</div>
			<div className="card-content">
				<GlobalThreads />
			</div>
		</div>
	);
}
