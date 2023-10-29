import Feed from "~/components/Feed";
import { api } from "~/utils/api";
import { GetStaticProps } from "next";
import { getSSGHelper } from "~/utils/getSSGHelper";
import { raleway } from "~/styles/fonts";
import Link from "next/link";
import { ArrowRight, AtSign, LogInIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PostView } from "~/components/Post";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import PingAuth from "~/components/Auth";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const HomePage = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const posts = api.posts.get.useQuery({ take: 3 });
  const postsList = posts.data?.map((post) => (
    <div
      key={post.id}
      className="duration-150 hover:-skew-x-3 hover:scale-105 hover:dark:drop-shadow-glow hover:drop-shadow-md"
    >
      <PostView post={post} />
    </div>
  ));
  if (!postsList) return;

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        router.push({ pathname: "/home" });
      }
    });
  }, []);

  return (
    <div className="w-full h-full">
      <div className={`flex flex-col mx-auto max-w-5xl min-w-0 ${raleway.className}`}>
        {/* <div className="-z-1 absolute inset-0 w-screen h-screen">
        <Image src={grid} alt="background image" fill={true} />
      </div> */}
        <Card className="p-4 rounded-t-none flex place-content-between">
          <Link className="flex flex-row gap-4 items-center " href="/">
            <AtSign className="sm:ml-2" size={30} strokeWidth={2.5} />
            <div className="font-bold -mt-1 text-3xl">ping</div>
          </Link>
          {session?.user ? (
            <Button variant="default" size="sm_icon">
              <Link href="/home">Home</Link>
              <ArrowRight />
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm_icon">
                  <div className="hidden sm:flex">sign in</div>
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[350px]">
                <DialogTitle>
                  <h3 className="text-center">Sign in to Ping </h3>
                </DialogTitle>
                <PingAuth />
              </DialogContent>
            </Dialog>
          )}
        </Card>

        <div className="grid lg:grid-cols-2 items-center justify-center p-10">
          <div className="text-2xl p-8 text-center drop-shadow-md dark:drop-shadow-glow">
            <h1>
              a <b>better </b> microblogging experience
            </h1>
            <br />
            <h1>
              staying <b>out of your way</b>
            </h1>
            <h1>
              to reach <b>your</b> people
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <Card className="h-4" />
            {postsList}
            <Card className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const ssg = getSSGHelper();

  await ssg.posts.get.prefetch({ take: 3 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
};

export default HomePage;
