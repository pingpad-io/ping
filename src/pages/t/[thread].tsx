import { useSelector } from "react-redux";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard, { ThreadDivider } from "~/components/PostWizard";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ThreadPage = ({ thread }: { thread: string }) => {
	// const currentThreadId = useSelector((state: State) => state.currentThreadId);
	const posts = api.posts.getAllInThread.useQuery(thread);

	return (
		<PageLayout>
			<div className="sticky top-0 z-10 flex w-full flex-col">
				<PostWizard placeholder="write a new twot..." />
				<ThreadDivider />
			</div>
			<div className="px-2">
				<Feed {...posts} />
			</div>
		</PageLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssg = getSSGHelper();
	const thread = context.params?.thread;

	if (typeof thread !== "string") throw new Error("Bad URL");

	await ssg.posts.getAllInThread.prefetch(thread);
	await ssg.threads.getAll.prefetch();

	return {
		props: {
			trpcState: ssg.dehydrate(),
			thread,
		},
	};
};

export default ThreadPage;
