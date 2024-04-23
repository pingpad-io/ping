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
        <div className="flex flex-col px-auto grow items-center justify-center py-10 text-3xl text-center drop-shadow-md dark:drop-shadow-glow place-items-center flex flex-col gap-6 justify-center">
          <div className="col-span-1 flex flex-row gap-2 items-center justify-center">
            <Link className="hover:underline  flex items-center gap-2" href={"https://lens.xyz"}>
              <div className="dark:hidden">
                <LensTextDark />
              </div>
              <div className="dark:flex hidden">
                <LensTextLight />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
