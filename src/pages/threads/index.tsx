import Head from "next/head";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { GlobalThreads, UserThreads } from "~/components/Threads";

const ThreadsPage = () => {
  return (
    <>
      <Head>
        <title>Twotter Privacy Policy</title>
      </Head>

      <PageLayout>
        <CollapsedContext.Provider value={false}>
          <div className="flex items-center justify-center">
            <div className="m-8 flex flex-col">
              <div className="m-8 rounded-xl bg-base-300 p-4">
                <GlobalThreads />
              </div>
              <div className="m-8 rounded-xl bg-base-300 p-4">
                <UserThreads />
              </div>
            </div>
          </div>
        </CollapsedContext.Provider>
      </PageLayout>
    </>
  );
};

export default ThreadsPage;
