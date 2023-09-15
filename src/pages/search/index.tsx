import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { PageLayout } from "~/components/Layout";
import Feed from "~/components/Feed";
import ErrorPage from "~/components/ErrorPage";
import Link from "next/link";
import { SearchBar } from "../../components/SearchBar";
import { GlassBar } from "~/components/GlassBar";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SearchPage() {
	const router = useRouter();
	const { q } = router.query;
	const query = q ? q.toString() : "";

	const posts = api.posts.get.useQuery(
		{ contains: query },
		{
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
		},
	);

	return (
		<PageLayout>
			<div className=" h-16 flex flex-row gap-2 items-center justify-center sticky top-0 z-10 border-b">
				<Link href={"/"}>
					<Button variant="outline" className="">
						<ChevronLeft className="w-5 h-5" />
					</Button>
				</Link>
				<SearchBar defaultText={query} />
			</div>
			<Feed {...posts} />
		</PageLayout>
	);
}
