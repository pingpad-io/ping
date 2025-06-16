import { Github, Heart, InfoIcon, LogInIcon } from "lucide-react";
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
      <div className="fixed inset-0 -z-10 dark:block hidden">
        <Squares
          direction="up"
          speed={0.5}
          borderColor="#1a1a1a"
          hoverFillColor="#0a0a0a"
        />
      </div>
      <div className="flex flex-col min-h-screen items-center justify-center relative z-10">
        <div className="text-3xl text-center drop-shadow-md dark:drop-shadow-glow">
          <FadeIn className="duration-1000 delay-100">
            <h1>
              a <b>better</b> social
            </h1>
          </FadeIn>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
