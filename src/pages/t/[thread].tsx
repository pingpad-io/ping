import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GetStaticProps, type GetServerSideProps, GetStaticPaths } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { Separator } from "~/components/ui/separator";

const ThreadPage = ({ thread }: { thread: string }) => {
	const posts = api.posts.get.useQuery({ thread});

	return (
		<PageLayout>
			<div className="sticky top-0 z-10 flex w-full flex-col">
				<PostWizard />
				<div className="px-2">
					<Separator />
				</div>
			</div>
			<div className="px-2">
				<Feed {...posts} />
			</div>
		</PageLayout>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const ssg = getSSGHelper();
	const thread = context.params?.thread;

	if (typeof thread !== "string") throw new Error("Bad URL");

	await ssg.posts.get.prefetch({ thread});
	await ssg.threads.get.prefetch({});
	await ssg.reactions.get.prefetch({});

	return {
		props: {
			trpcState: ssg.dehydrate(),
			thread,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const ssg = getSSGHelper();
	const threads = await ssg.threads.get.fetch({});

	return {
		paths: threads.map((thread) => ({
			params: {
				thread: thread.name ?? ""
			},
		})),
		fallback: "blocking",
	};
};

export default ThreadPage;
