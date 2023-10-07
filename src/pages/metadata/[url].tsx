import { api } from "~/utils/api";
import { NextPage, type GetServerSideProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";

const Metadata: NextPage<{ url: string }> = ({ url }) => {
	const { data: metadata } = api.metadata.get.useQuery({ url });

	if (!metadata) {
		return <span>Loading preview...</span>;
	}

	return (
		<>
			<a className="truncate no-underline hover:underline" href={metadata.url}>
				{metadata.url}
			</a>
			<span className="max-w-sm min-w-0">
				<a href={metadata.url} className="no-underline">
					<span className="rounded-lg border text-card-foreground shadow-sm bg-slate-100 select-none truncate line-clamp-1 dark:bg-slate-900 mt-2 sm:mt-4 p-2 sm:p-4 flex flex-col gap-2">
						{metadata.publisher && <span>{metadata.publisher}</span>}
						<span className="truncate hover:underline"> {metadata.title} </span>
						{metadata.image && (
							<img
								className="rounded-lg m-0 mt-4"
								src={metadata.image}
								alt={`${metadata.title} preview`}
							/>
						)}
					</span>
				</a>
			</span>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssg = getSSGHelper();
	const url = context.params?.url;

	if (typeof url !== "string") throw new Error("Invalid URL passed to SSR");

	await ssg.metadata.get.prefetch({ url });

	return {
		props: {
			trpcState: ssg.dehydrate(),
			url,
		},
	};
};

export default Metadata;
