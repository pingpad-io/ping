import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import Feed from "~/components/Feed";
import ErrorPage from "~/components/ErrorPage";
import Link from "next/link";
import { SearchBar } from "../../components/SearchBar";
import { GlassBar } from "~/components/GlassBar";

export default function SearchPage() {
	const router = useRouter();
	const { q } = router.query;
	const query = q ? q.toString() : "";

	const posts = api.posts.get.useQuery({contains: query}, {
		onError: (e) => {
			let error = "Something went wrong";
			switch (e.data?.code) {
				case "TOO_MANY_REQUESTS":
					error = "Slow down! You are posting too fast";
					break;
				case "BAD_REQUEST":
					error = "Invalid request";
					break;
				case "PAYLOAD_TOO_LARGE":
					error = "Your message is too big";
					break;
			}
			toast.error(error);
		},
	});

	return (
		<PageLayout>
			<div className="sticky top-0 z-10 border-b">
				<GlassBar>
					<SearchBar defaultText={query} />
				</GlassBar>
			</div>
			<Feed {...posts} />
			<Link className="btn-ghost btn" href={"/"}>
				{"< Home"}
			</Link>
		</PageLayout>
	);
}
