import { useUser } from "@supabase/auth-helpers-react";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import ErrorPage from "~/components/ErrorPage";
import Feed from "~/components/Feed";
import { FlairView } from "~/components/FlairView";
import { GlassBar } from "~/components/GlassBar";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { MenuItem } from "~/components/MenuItem";
import { TimeSince } from "~/components/TimeLabel";
import { UserAvatar } from "~/components/UserAvatar";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
	const user = useUser();
	const { data: profile } = api.profiles.getProfileByUsername.useQuery({
		username,
	});
	const posts = api.posts.getAllByAuthorUsername.useQuery(username);

	if (!profile) return <ErrorPage title="∑(O_O;) Not Found" />;

	const isUserProfile = profile?.id === user?.id;
	const title = `Twotter (@${profile.username ?? ""})`;

	const flair = profile.flairs.length > 0 && (
		<span className="h-min">
			<FlairView flair={profile.flairs.at(0)} size="md" />
		</span>
	);

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<PageLayout>
				<div className="sticky top-0 z-10 border-b border-base-300 ">
					<GlassBar>
						<UserAvatar profile={profile} />

						<div className="flex flex-col grow">
							<div className="flex flex-row gap-2">
								<div className="text-lg font-bold">{profile.full_name}</div>
								{flair}
							</div>
							<Link className="grow" href={`/${profile.username ?? ""}`}>
								<div className="text-sm text-base-content font-light">
									@{profile.username}
								</div>
							</Link>
							<div className="text-sm text-base-content pt-2 ">
								{profile.description}
							</div>
						</div>

						<div className="flex flex-col place-content-between gap-1">
							{profile.created_at && (
								<div className="text-sm text-base-content">
									Joined <TimeSince date={profile.created_at} />
								</div>
							)}
						</div>

						{isUserProfile && (
							<CollapsedContext.Provider value={true}>
								<MenuItem
									href="/settings"
									icon={<FiEdit2 />}
									text="Edit Profile"
								/>
							</CollapsedContext.Provider>
						)}
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

	await ssg.profiles.getProfileByUsername.prefetch({ username });
	await ssg.posts.getAllByAuthorUsername.prefetch(username);

	return {
		props: {
			trpcState: ssg.dehydrate(),
			username,
		},
	};
};

export default ProfilePage;
