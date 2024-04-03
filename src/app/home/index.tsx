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


const HomePage = () => {
  const {data: posts} = api.posts.get.useQuery({});
  // const [posts, setPosts] = useState<AnyPublicationFragment[]>();
  // console.log(lensClient);

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
