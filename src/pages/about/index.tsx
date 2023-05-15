import Head from "next/head";
import { PageLayout } from "~/components/Layout";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>

      <PageLayout>
        <div className="flex h-screen w-full flex-col items-center gap-8 p-20 text-center font-mono">
          <div className="flex flex-col items-center text-2xl">
            <h1 className="font-bold">About Twotter</h1>
            <h2>an anonymised twitter</h2>
          </div>
          <div className="mt-10 flex flex-col gap-8 p-8">
            <div className="card m-4 bg-base-200 p-4">
              <b>what?</b>
              <div className="text-left">
                this website is an experiment of combining two of the most
                controversial places on the internet: <b>twitter.com</b> and{" "}
                <b>4chan.org</b>
              </div>
            </div>
            <div className="card m-4 bg-base-200 p-4">
              <b>why?</b>
              <div className="text-left">
                it's an attempt to find out what happens when an unstoppable
                force meets an immovable object.
              </div>
            </div>
            <div className="card m-4 bg-base-200 p-4">
              <b>who?</b>
              <div className="text-left">
                made with ❤ by{" "}
                <a className="underline" href="https://kualta.dev">
                  kualta
                </a>
                {/* {" & "}
                <a className="underline" href="https://github.com/kualta/twot">
                  contributors
                </a> */}
              </div>
            </div>
            <div className="card m-4 bg-base-100 p-4"></div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default AboutPage;
