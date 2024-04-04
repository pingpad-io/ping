import type { GetStaticPaths, GetStaticProps } from "next";
import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const ThreadPage = ({ thread }: { thread: string }) => {
  const posts = api.posts.get.useQuery({ thread });

  return (
    <PageLayout>
      <Card className="sticky top-0 z-10 flex w-full flex-col p-4">
        <PostWizard />
      </Card>

      <Feed {...posts} />
    </PageLayout>
  );
};

// export const getStaticProps: GetStaticProps = async (context) => {
//   const ssg = getSSGHelper();
//   const thread = context.params?.thread;

//   if (typeof thread !== "string") throw new Error("Bad URL");

//   await ssg.posts.get.prefetch({ thread });
//   await ssg.threads.get.prefetch({});
//   await ssg.reactions.get.prefetch({});

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       thread,
//     },
//     revalidate: 1,
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const ssg = getSSGHelper();
//   const threads = await ssg.threads.get.fetch({});

//   return {
//     paths: threads.map((thread) => ({
//       params: {
//         thread: thread.name ?? "",
//       },
//     })),
//     fallback: "blocking",
//   };
// };

export default ThreadPage;
