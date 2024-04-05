import { LensClient, production } from "@lens-protocol/client";
import { HomePage } from "./HomePage";
import { localStorage } from "~/utils/storage";

const home = async () => {
  const client = new LensClient({ environment: production, storage: localStorage() });
  const publications = await client.publication.fetchAll({ where: { from: ["0x04359b"] } });

  // console.log(`Is LensClient authenticated? `, await client.authentication.isAuthenticated());
  // console.log(`Authenticated profileId: `, profileId);
  // console.log(`Access token: `, accessToken);
  // console.log(`Is access token valid? `, await client.authentication.verify({ accessToken }));
  // const post = posts?.map((publication) => publication.by.id);
  const posts = publications.items.map((publication) => publication.by.metadata.bio);

  console.log(publications.items);
  return (
    <>
      {/* <Card className="z-[30] sticky top-0 flex-col hidden sm:flex flex-none p-4 border-0"> */}
      {/* <PostWizard /> */}
      {/* </Card> */}
      {/* {publications.items} */}
      {posts}

      {/* {publications.items} */}
      {/* <Feed {...posts} /> */}
      <HomePage />
    </>
  );
};

export default home;
