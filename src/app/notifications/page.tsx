import ErrorPage from "~/components/ErrorPage";
import { getLensClient } from "~/utils/getLensClient";

const home = async () => {
  const { client, isAuthenticated, profileId } = await getLensClient();

  if (isAuthenticated) {
    const data = await client.notifications.fetch({ where: { timeBasedAggregation: true } });

    if (data.isFailure()) return <ErrorPage title={`Couldn't fetch posts: ${data.error} `} />;

    const items = data.unwrap().items;
    console.log(items);
    // const posts = items?.map((publication) => lensItemToPost(publication)).filter((post) => post);
    return (
      <>notifications</>
      // <Card className="z-[30] hover:bg-card p-4 border-0">
      //   <Feed data={posts} />
      // </Card>
    );
  }
};

export default home;
