import { useUser } from "@supabase/auth-helpers-react";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiCalendar, FiEdit2 } from "react-icons/fi";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { GlassBar } from "~/components/GlassBar";
import { PageLayout } from "~/components/Layout";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
	const user = useUser();
	const { data: profile } = api.profiles.get.useQuery({ username });
	const posts = api.posts.get.useQuery({ authorUsername: username });

	if (!profile) return <ErrorPage title="∑(O_O;) Not Found" />;

	const isUserProfile = profile?.id === user?.id;
	const title = `Ping (@${profile.username ?? ""})`;

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<PageLayout>
				<div className="sticky top-0 z-10 border-b border-base-300 bg-base-200/30 ">
					<GlassBar>
						<div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24 ring rounded-full ring-base-200 ring-offset-1">
							<UserAvatar size={100} profile={profile} />
						</div>

						<div className="flex flex-col grow place-content-around">
							<div className="flex flex-row gap-2 place-items-center h-6">
								<div className="text-lg font-bold w-fit truncate">
									{profile.full_name}
								</div>
								{isUserProfile && (
									<Link
										className="btn btn-square btn-sm btn-ghost "
										href="/settings"
									>
										<FiEdit2 />
									</Link>
								)}
							</div>
							<Link className="grow" href={`/${profile.username ?? ""}`}>
								<div className="text-sm text-base-content font-light">
									@{profile.username}
								</div>
							</Link>
							<div className="text-sm text-base-content grow">
								{profile.description}
							</div>
							{profile.created_at && (
								<div className="text-sm text-base-content flex flex-row gap-1 place-items-center">
									<FiCalendar />
									Joined <TimeSince date={profile.created_at} />
								</div>
							)}
						</div>
					</GlassBar>
				</div>

				<div className="px-4 mt-2">
					<Feed {...posts} />
				</div>
			</PageLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const ssg = getSSGHelper();
	const username = context.params?.user;

	if (typeof username !== "string") throw new Error("Bad URL");

	await ssg.profiles.get.prefetch({ username });
	await ssg.posts.get.prefetch({ authorUsername: username });

	return {
		props: {
			trpcState: ssg.dehydrate(),
			username,
		},
	};
};

export default ProfilePage;
