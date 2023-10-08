import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GetStaticProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { Separator } from "~/components/ui/separator";

const HomePage = () => {
	const posts = api.posts.get.useQuery({});

	return (
		<PageLayout>
			<div className="sticky inset-x-0 top-0 z-10 flex w-full flex-col">
				<PostWizard />
				<div className="px-2">
					<Separator />
				</div>
			</div>

			<div className="p-2">
				<Feed {...posts} />
			</div>
		</PageLayout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const ssg = getSSGHelper();

	await ssg.posts.get.prefetch({});
	await ssg.threads.get.prefetch({});

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
		revalidate: 1,
	};
};

export default HomePage;
