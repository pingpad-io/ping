import type { GetStaticProps } from "next";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

import {
  AnyPublicationFragment,
  IStorageProvider,
  LensClient,
  PublicationMetadataMainFocusType,
  development,
  production,
} from "@lens-protocol/client";
import { useEffect, useState } from "react";
import { textOnly } from "@lens-protocol/metadata/*";

class LocalStorageProvider implements IStorageProvider {
  getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }
}

const lensClientConfig = {
  environment: production,
  storage: new LocalStorageProvider(),
};

const lensClient = new LensClient(lensClientConfig);

const HomePage = () => {
  // const posts = api.posts.get.useQuery({});
  const [posts, setPosts] = useState<AnyPublicationFragment[]>();
  console.log(lensClient);

  useEffect(() => {
    const fetchPosts = async () => {
      const publications = await lensClient.publication.fetchAll({
        where: { from: ["0x027290"] },
      });
      setPosts(publications.items);
      console.log(publications.items.map((publication) => publication.id));
    };

    fetchPosts();
  }, []);
  const post = posts?.map((publication) => publication.by.id);

  console.log(post);
  return (
    <PageLayout>
      {/* <Card className="z-[30] sticky top-0 flex-col hidden sm:flex flex-none p-4 border-0"> */}
      {/* <PostWizard /> */}
      {/* </Card> */}
      {/* {publications.items} */}
      {post}

      {/* <Feed {...posts} /> */}
    </PageLayout>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const ssg = getSSGHelper();

//   await ssg.posts.get.prefetch({});
//   await ssg.threads.get.prefetch({});

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//     revalidate: 1,
//   };
// };

export default HomePage;
