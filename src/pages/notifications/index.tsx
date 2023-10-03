import { PageLayout } from "~/components/Layout";

const NotificationsPage = () => {
	return (
		<PageLayout>
			Notifications
		</PageLayout>
	);
};

// export const getServerSideProps = async (
// 	context:
// 		| GetServerSidePropsContext
// 		| { req: NextApiRequest; res: NextApiResponse },
// ) => {
// 	const ssg = getSSGHelper();
// 	const supabase = createServerSupabaseClient(context);

// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();

// 	if (!user) return;

// 	await ssg.profiles.get.prefetch({
// 		id: user.id,
// 	});

// 	return {
// 		props: {
// 			trpcState: ssg.dehydrate(),
// 			id: user.id,
// 		},
// 	};
// };

export default NotificationsPage;
