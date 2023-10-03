import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { type GetServerSideProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { Separator } from "~/components/ui/separator";
import { useRouter } from "next/router";

const HomePage = () => {
	const router = useRouter();
	const thread = router.asPath.split("/")[2];
	const posts = api.posts.get.useQuery({});

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

export const getServerSideProps: GetServerSideProps = async () => {
	const ssg = getSSGHelper();

	await ssg.posts.get.prefetch({});
	await ssg.threads.get.prefetch({});

	return {
		props: {
			trpcState: ssg.dehydrate(),
		},
	};
};

export default HomePage;
