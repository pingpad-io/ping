import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { PrivateThreads, PublicThreads } from "~/components/ThreadList";

const ThreadsPage = () => {
  return (
    <>
      <Head>
        <title>Chats</title>
      </Head>

      <PageLayout>
        <CollapsedContext.Provider value={false}>
          <div className="rounded-box m-2 flex flex-col flex-wrap place-items-center justify-center p-4 ">
            <div className="w-full">
              <PrivateThreads />
            </div>
          </div>
        </CollapsedContext.Provider>
      </PageLayout>
    </>
  );
};

export default ThreadsPage;
