import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard, { ThreadDivider } from "~/components/PostWizard";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";

const HomePage = () => {
	const posts = api.posts.get.useQuery({});

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

export const getServerSideProps: GetServerSideProps = async () => {
	const ssg = getSSGHelper();

	await ssg.posts.get.prefetch({});
	await ssg.threads.getAll.prefetch();

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
};

export default HomePage;
