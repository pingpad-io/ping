import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { PublicThreads } from "~/components/ThreadList";

const ThreadsPage = () => {
  return (
    <>
      <Head>
        <title>Threads</title>
      </Head>

      <PageLayout>
        <CollapsedContext.Provider value={false}>
          <div className="rounded-box m-2 flex flex-col flex-wrap place-items-center justify-center p-4 ">
            <div className="w-full">
              <PublicThreads />
            </div>
          </div>
        </CollapsedContext.Provider>
      </PageLayout>
    </>
  );
};

export default ThreadsPage;
