import { GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/Post";
import PostWizard from "~/components/PostWizard";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
	const { data, isError, error } = api.posts.get.useQuery(
		{ postId: id },
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: false,
		},
	);
	const router = useRouter();

	if (isError)
		return <ErrorPage title={error.data?.code ?? "Something went wrong..."} />;
	if (data?.length !== 1)
		return <ErrorPage title={"Something went wrong..."} />;

	const post = data[0];
	if (!post) return <ErrorPage title={"Post not found qwq"} />;

	const author = post.author;
	const replies = api.posts.get.useQuery({ repliedToPostId: id });

	return (
		<>
			<Head>
				<title>
					@{author?.username}: {post.content} / Ping
				</title>
			</Head>

			<PageLayout>
				<div className="flex flex-col items-center justify-center p-2">
					<PostView post={post} />

					<div className="flex w-full flex-row ">
						<div className="place-end my-1 flex grow flex-col px-4">
							<Feed {...replies} />
							<PostWizard replyingTo={id} />
						</div>
					</div>

					<Button variant="outline" type="button" onClick={() => router.back()}>
						{"< Back "}
					</Button>
				</div>
			</PageLayout>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const ssg = getSSGHelper();
	const id = context.params?.id;

	if (typeof id !== "string") throw new Error("Bad post id");

	await ssg.posts.get.prefetch({ postId: id });

	return {
		props: {
			trpcState: ssg.dehydrate(),
			id: id,
		},
		revalidate: 1,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const ssg = getSSGHelper();
	const posts = await ssg.posts.get.fetch({ take: 1000 });

	return {
		paths: posts.map((post) => ({
			params: {
				id: post.id,
			},
		})),
		fallback: "blocking",
	};
};

export default PostPage;
