import Feed from "~/components/Feed";
import { PageLayout } from "~/components/Layout";
import PostWizard from "~/components/PostWizard";
import { api } from "~/utils/api";
import { GetStaticProps, type GetServerSideProps, GetStaticPaths } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { Card } from "~/components/ui/card";
import Chat from "~/components/Chat";

const ChatsPage = ({ chat }: { chat: string }) => {
  const posts = api.posts.get.useQuery({ thread: chat });

  return (
    <PageLayout>
      <Card className="sticky top-0 z-10 flex w-full flex-col p-4">
        <PostWizard />
      </Card>

      <Chat {...posts} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
  const chat = context.params?.chat;

  if (typeof chat !== "string") throw new Error("Bad URL");

  await ssg.posts.get.prefetch({ thread: chat });
  await ssg.threads.get.prefetch({});
  await ssg.reactions.get.prefetch({});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      chat,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ssg = getSSGHelper();
  const chats = await ssg.threads.get.fetch({});

  return {
    paths: chats.map((chat) => ({
      params: {
        chat: chat.name ?? "",
      },
    })),
    fallback: "blocking",
  };
};

export default ChatsPage;
