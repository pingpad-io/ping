import { api } from "~/utils/api";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ThreadLink } from "./ThreadLink";
import { Thread } from "~/server/api/routers/threads";
import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageSquareIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import ThreadWizard from "./ThreadWizard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";

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
					<MessageSquareIcon size={15} />
				</span>
			</ThreadLink>

			{user?.id === thread.authorId && (
				<button
					type="submit"
					onClick={() => deleteThread.mutate({ name: thread.name ?? "" })}
				>
					<XIcon size={14} />
				</button>
			)}
		</div>
	);
};

export default function Threads() {
	const [open, setOpen] = useState(false);
	const { data: threads } = api.threads.get.useQuery({});

	const threadList = threads?.map((thread) => {
		return <ThreadEntry key={thread.id} thread={thread} />;
	});

	return (
		<Card>
			<CardHeader className="py-3">
				<CardTitle className="text-lg">
					<div className="flex flex-row place-items-center gap-4">
						<Link href={"/t"}>Threads</Link>

						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button size="icon" variant="ghost" className="w-4 h-4">
									<PlusIcon />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<ThreadWizard setOpen={setOpen} />
							</DialogContent>
						</Dialog>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
			<div className="card-content">{threadList}</div>
			</CardContent>
		</Card>
	);
}
