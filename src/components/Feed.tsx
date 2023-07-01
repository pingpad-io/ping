/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type RouterOutputs } from "~/utils/api";
import ErrorPage from "./ErrorPage";
import { PostView } from "./PostView";
import { SuspensePostView } from "./SuspensePostView";

export type Post = RouterOutputs["posts"]["getAll"][number];

export default function Feed(props: {
	data?: Post[];
	isLoading?: boolean;
	isError?: boolean;
}) {
	if (props.isLoading) {
		const suspense = [...Array(12)].map((e, i) => (
			<SuspensePostView key={`${i}`} />
		));
		return <div className="flex flex-col gap-1">{suspense}</div>;
	}

	if (props.isError || !props.data)
		return <ErrorPage title="Couldn't fetch posts" />;

	const feed = props.data.map((post) => <PostView key={post.id} post={post} />);

	console.log(props.data);

	return <div className="flex flex-col gap-1">{feed}</div>;
}
