import { Github, Heart } from "lucide-react";
import Link from "next/link";
import { LensTextDark, LensTextLight } from "~/components/Icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { quicksand } from "~/styles/fonts";

const LandingPage = () => {
  return (
    <div className={`flex flex-col mx-auto max-w-5xl min-w-0 ${quicksand.className}`}>
      <div className="w-full">
        <div className="flex flex-col px-auto grow items-center justify-center py-10 mt-16 text-3xl p-8 text-center drop-shadow-md dark:drop-shadow-glow place-items-center flex flex-col gap-6 justify-center">
          <div className="col-span-1 flex flex-col gap-2">
            <h1>
              a <b>better </b> decentralized social,
            </h1>
            <h1>
              staying <b>out of the way</b>
            </h1>
            <h1>
              to reach <b>your</b> people
            </h1>
          </div>
          <div className="col-span-1 flex flex-row gap-2 items-center justify-center">
            <h1>built on</h1>
            <Link className="hover:underline -mt-24 -mb-24  flex items-center gap-2" href={"https://lens.xyz"}>
              <div className="dark:hidden">
                <LensTextDark />
              </div>
              <div className="dark:flex hidden">
                <LensTextLight />
              </div>
            </Link>
          </div>
        </div>

        <Card className="hover:bg-card flex flex-col gap-4 place-items-center mx-auto max-w-3xl p-4 my-32">
          <CardHeader>
            <CardTitle> FAQ </CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-3xl">
            <div className="w-full max-w-3xl">
              <Accordion type="single">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Current status?</AccordionTrigger>
                  <AccordionContent>
                    In development. Ping (centralized version) has retired, and Pingpad is currently being built. <br />{" "}
                    <br />
                    <a className="underline" href="https://github.com/pingpad-io/ping">
                      Contributions
                    </a>{" "}
                    are welcome.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>When open for all?</AccordionTrigger>
                  <AccordionContent>
                    Pingpad in currently in closed Beta, gathering feedback and improving the experience. <br />
                    <br /> Subscribe to the newsletter above to get in early.
                  </AccordionContent>
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
          <Link href="https://kualta.dev">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <Heart /> by kualta
            </Button>
          </Link>
          <Link href="https://github.com/pingpad-io/ping">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <Github /> github
            </Button>
          </Link>
          {/* <Link href="/about">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <InfoIcon /> About
            </Button>
          </Link> */}
          {/* <Link href="https://ping.kualta.dev/policy">
            <Button variant="ghost" className="p-1 px-4 text-lg gap-4 flex flex-row w-fit rounded-full">
              <Cookie /> Privacy
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
