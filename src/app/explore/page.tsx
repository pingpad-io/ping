import { ExplorePublicationsOrderByType, LensClient, production } from "@lens-protocol/client";
import { Post } from "@lens-protocol/react-web";
import { cookies } from "next/headers";
import ErrorPage from "~/components/ErrorPage";
import { Feed } from "~/components/Feed";
import { lensItemToPost } from "~/components/post/Post";
import { SuspenseView } from "~/components/post/SuspenseView";

const lensClient = new LensClient({
  environment: production,
});

const home = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken").value;
  await lensClient.authentication.authenticateWith({ refreshToken });
  const data = await lensClient.feed.fetch({
    where: {
      for: "0x01"
    }
  });

  const suspense = [...Array(12)].map((_v, idx) => <SuspenseView key={`suspense-${idx}`} />);

  if (data.isFailure()) return <ErrorPage title={`Couldn't fetch posts: ${data.error} `}/>;
  if (!data.isSuccess()) return suspense;

  const items = data.unwrap().items;
  const posts = items.map((publication) => lensItemToPost(publication)).filter((post) => post);
  return <Feed data={posts} />;
};

export default home;
