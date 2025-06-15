import { AtSign, Github, Heart, InfoIcon, LogInIcon } from "lucide-react";
import type { Metadata } from "next";
import { EmailSubscription } from "~/components/EmailSubscription";
import { LensTextDark, LensTextLight } from "~/components/Icons";
import Link from "~/components/Link";
import { ThemeToggle } from "~/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Pingpad",
  description: "reach your people on pingpad",
  openGraph: {
    title: "Pingpad",
    description: "reach your people on pingpad",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};
import { FadeIn } from "~/components/Transitions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Squares } from "~/components/ui/squares";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#1a1a1a"
          hoverFillColor="#0a0a0a"
        />
      </div>
      <div className={"flex flex-col min-h-screen mx-auto max-w-5xl min-w-0 relative z-10"}>
      <div className="w-full h-full">
        <div className="p-4 rounded-t-none flex place-content-between">
          <Link className="flex flex-row gap-4 items-center " href="/">
            <AtSign className="dark:drop-shadow-glow-sm drop-shadow-md" size={35} />
            <div className="text-3xl font-semibold dark:drop-shadow-glow drop-shadow-md  -mt-1.5 -ml-2">pingpad</div>
          </Link>

          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Link href="/home">
              <Button variant="secondary" className="p-3 rounded-lg h-12 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 hover:bg-primary hover:text-primary-foreground">
                <span className="hidden sm:flex text-sm font-medium">Join</span>
                <LogInIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 px-auto grow items-center justify-center py-10 mt-16 text-3xl p-8 text-center drop-shadow-md dark:drop-shadow-glow place-items-center flex-col gap-6">
          <div className="col-span-1 flex flex-col gap-2">
            <FadeIn className="duration-1000 delay-100">
              <h1>
                a <b>better </b> decentralized social,
              </h1>
            </FadeIn>
            <FadeIn className="duration-1000 delay-300">
              <h1>
                staying <b>out of the way</b>
              </h1>
            </FadeIn>
            <FadeIn className="duration-1000 delay-500">
              <h1>
                to reach <b>your</b> people
              </h1>
            </FadeIn>
          </div>

          <FadeIn className="duration-1000 delay-1000">
            <div className="col-span-1 flex flex-row gap-4 items-center justify-center">
              <h1>built on</h1>
              <Link className="hover:underline -mt-24 -mb-24  flex items-center relative" href={"https://lens.xyz"}>
                <div className="dark:hidden">
                  <LensTextDark />
                </div>
                <div className="dark:flex hidden">
                  <LensTextLight />
                </div>
                <div className="absolute -bottom-6 -right-6 text-xs font-bold transform  border border-primary/80 text-primary px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Now on v3!
                </div>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* <FadeIn className="">
          <div className="w-full p-8 mt-24 text-center drop-shadow-lg dark:drop-shadow-glow flex flex-col justify-center items-center">
            <div className="text-xl font-bold flex flex-col gap-4">
              {/* Now on Lens v3! moved to Lens logo */}
        {/* <EmailSubscription /> */}
        {/* </div>
          </div> */}

        {/* <FadeIn className="">
          <Card className="hover:bg-card flex flex-col gap-4 place-items-center mx-auto w-full p-4 my-32">
            <CardHeader>
              <CardTitle> FAQ </CardTitle>
            </CardHeader>
            <CardContent className="w-full max-w-3xl">
              <div className="w-full max-w-3xl">
                <Accordion type="single">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Current status?</AccordionTrigger>
                    <AccordionContent>
                      In open beta. We are currently fixing bugs and adding new features before the v1.0 release. <br />{" "}
                      <br />
                      We are waiting for your{" "}
                      <a className="underline" href="https://github.com/pingpad-io/ping">
                        feedback
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it any good?</AccordionTrigger>
                    <AccordionContent>
                      Yes. <Link href={"/home"}>check it out</Link> for yourself.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </FadeIn> */}

        <FadeIn className="">
          <div className="flex flex-col md:flex-row gap-2 place-items-center justify-center p-4 my-20">
            <div className="flex items-center gap-2 p-2 rounded-2xl backdrop-blur-lg border shadow-lg bg-background/90 border-border hover:shadow-xl transition-shadow duration-300">
              <Link href="https://kualta.dev">
                <Button variant="ghost" className="p-3 rounded-lg h-12 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">by kualta</span>
                </Button>
              </Link>
              <Link href="https://github.com/pingpad-io/ping">
                <Button variant="ghost" className="p-3 rounded-lg h-12 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <Github className="w-5 h-5" />
                  <span className="text-sm font-medium">github</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="p-3 rounded-lg h-12 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <InfoIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">about</span>
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
    </div>
  );
};

export default LandingPage;
