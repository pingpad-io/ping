import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { ArrowRight, AtSign, Cookie, Github, InfoIcon, LogInIcon, MoonIcon, SunIcon } from "lucide-react";
import type { GetStaticProps } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PingAuth from "~/components/Auth";
import { PostView } from "~/components/PostView";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { quicksand } from "~/styles/fonts";
import { api } from "~/utils/api";
import { getSSGHelper } from "~/utils/getSSGHelper";

const LandingPage = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  const posts = api.posts.get.useQuery({ take: 3 });
  const postsList = posts.data?.map((post) => (
    <div
      key={post.id}
      className="duration-150 hover:-skew-x-3 hover:scale-105 hover:dark:drop-shadow-glow-sm hover:drop-shadow-lg overflow-visible"
    >
      <PostView showBadges={false} post={post} />
    </div>
  ));

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") {
        router.push({ pathname: "/home" });
      }
    });
  }, [router.push, supabase.auth.onAuthStateChange]);

  if (!postsList) return;

  return (
    <div className={`flex flex-col mx-auto max-w-5xl min-w-0 w-fit ${quicksand.className}`}>
      <div className="h-screen">
        <div className="p-4 rounded-t-none flex place-content-between">
          <Link className="flex flex-row gap-4 items-center " href="/">
            <AtSign className="dark:drop-shadow-glow-sm drop-shadow-md" size={35} />
            <div className="text-3xl font-bold dark:drop-shadow-glow drop-shadow-md  -mt-1.5 -ml-2">ping</div>
          </Link>

          <div className="flex gap-4 items-center ">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <SunIcon /> : <MoonIcon />}
            </Button>
            <div className="dark:drop-shadow-glow drop-shadow-md ">
              {session?.user ? (
                <Button variant="default" size="sm_icon">
                  <Link className="pr-2" href="/home">
                    Home
                  </Link>
                  <ArrowRight />
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm_icon">
                      <div className="hidden  sm:flex mr-2">Join Beta</div>
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
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 items-center justify-center py-10 mt-24">
          <div className="text-3xl p-8 text-center drop-shadow-md dark:drop-shadow-glow place-items-center flex flex-col gap-6 justify-center">
            <h1>
              a <b>better </b> microblogging experience
            </h1>
            <div className="hidden md:block">
              <br />
              <h1>
                staying <b>out of the way</b>
              </h1>
              <h1>
                to reach <b>your</b> people
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-2 w-2/3 md:w-full mx-auto">{postsList}</div>

          <div className="block md:hidden text-3xl p-8 text-center drop-shadow-lg dark:drop-shadow-glow">
            <h1>
              staying <b>out of the way</b> to reach <b>your</b> people.
            </h1>
          </div>
        </div>

        <div className="w-full text-4xl p-8 mt-10 md:mt-20 text-center drop-shadow-lg dark:drop-shadow-glow flex flex-col justify-center items-center">
          <h1 className="w-fit min-w-0">
            A{" "}
            <Link className="hover:underline" href={"https://kualta.dev/"}>
              <b>KUALTA</b>
            </Link>{" "}
            PROJECT
          </h1>
          <p className="text-lg">
            part of{" "}
            <a className="hover:underline" href="https://net.kualta.dev/">
              Kunet Global Network
            </a>
          </p>
        </div>
        <Card className="flex flex-col gap-4 place-items-center mx-auto max-w-3xl p-4 my-32">
          <CardHeader>
            <CardTitle> FAQ </CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-3xl">
            <div className="w-full max-w-3xl">
              <Accordion type="single">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Current status?</AccordionTrigger>
                  <AccordionContent>
                    In development. Right now in open beta.{" "}
                    <a className="underline" href="https://github.com/kualta/ping">
                      Contributions
                    </a>{" "}
                    are welcome.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it free?</AccordionTrigger>
                  <AccordionContent>Free forever.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it any good?</AccordionTrigger>
                  <AccordionContent>Yes.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 place-items-center justify-center p-4 drop-shadow-lg dark:drop-shadow-glow my-20">
          <Link href="https://github.com/kualta/ping">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <Github /> GitHub
            </Button>
          </Link>
          <Link href="https://ping.kualta.dev/about">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <InfoIcon /> About
            </Button>
          </Link>
          <Link href="https://ping.kualta.dev/policy">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <Cookie /> Privacy
            </Button>
          </Link>
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

export default LandingPage;
