import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/Layout";
import { CollapsedContext } from "~/components/Menu";
import { GlobalThreads, UserThreads } from "~/components/Threads";

const ThreadsPage = () => {
  return (
    <>
      <Head>
        <title>Threads</title>
      </Head>

      <PageLayout>
        <CollapsedContext.Provider value={false}>
          <div className="rounded-box m-2 flex flex-col flex-wrap place-items-center justify-center p-4 ">
            <Link href={"/threads"} className="text-2xl font-bold">
              Threads
            </Link>
            <div className="w-full">
              <GlobalThreads />
              <UserThreads />
            </div>
          </div>
        </CollapsedContext.Provider>
      </PageLayout>
    </>
  );
};

export default ThreadsPage;
