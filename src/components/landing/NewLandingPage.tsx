import { ArrowRight, ChevronRight, Globe, Lock, MessageSquare, Shield, Users, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "~/components/Link";
import LandingHeader from "./LandingHeader";
import { FaGithub } from "react-icons/fa6";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Own Your Data",
    description: "Content stored on decentralized networks. No central authority.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Censorship Resistant",
    description: "Your voice, unfiltered. No algorithms deciding what you see.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Portable Social Graph",
    description: "Take your followers anywhere in the Lens ecosystem.",
  },
  // {
  //   icon: <Zap className="h-6 w-6" />,
  //   title: "Lightning Fast",
  //   description: "Built with Next.js 14 for blazing performance.",
  // },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Privacy First",
    description: "Web3 wallet integration. You control access.",
  },
  // {
  //   icon: <MessageSquare className="h-6 w-6" />,
  //   title: "Rich Communities",
  //   description: "Join topic-based groups. Connect with like minds.",
  // },
];

const NewLandingPage = () => {

  return (
    <div className="min-h-screen bg-white text-black">
      <LandingHeader />

      <section className="relative flex min-h-screen items-center justify-center px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl font-light leading-tight md:text-6xl">
            a <span className="font-bold">better</span> social
            <br />
            {/* <span className="font-medium">Reimagined.</span> */}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 md:text-xl">
            Pingpad is a decentralized social network where clarity leads to pure connections.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#features">Explore Features</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/pingpad-io/ping-pad" target="_blank" rel="noopener noreferrer">
                <FaGithub className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-12 w-1 bg-gray-300" />
        </div>
      </section>

      <section id="features" className="bg-gray-50 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h3 className="mb-4 text-4xl font-light md:text-5xl">Built different.</h3>
            <p className="text-lg text-gray-600">Every feature designed with your freedom in mind.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={index} className="group transition-all duration-300 hover:border-black">
                <CardHeader>
                  <div className="flex justify-start"> 

                  <div className="mb-4 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h3 className="mb-8 text-4xl font-light md:text-5xl">
                Why choose
                <br />
                <span className="font-medium">decentralization?</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <ChevronRight className="mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 font-medium">Your content, forever</h4>
                    <p className="text-gray-600">Stored on Arweave and Grove. No platform can delete your thoughts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ChevronRight className="mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 font-medium">True chronological feed</h4>
                    <p className="text-gray-600">See what your friends post, when they post it. No manipulation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ChevronRight className="mr-3 mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 font-medium">Cross-platform identity</h4>
                    <p className="text-gray-600">Built on Lens Protocol. Your profile works across Web3.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-6xl font-light">∞</div>
                    <p className="text-gray-600">Infinite possibilities</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="bg-black px-6 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-6 text-4xl font-light md:text-5xl">Join the revolution.</h3>
          <p className="mb-12 text-xl text-gray-300">
            Be part of a community that values privacy, ownership, and authentic connection.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="/home">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="https://docs.lens.xyz" target="_blank" rel="noopener noreferrer">
                Read Documentation
              </Link>
            </Button>
          </div>

          <div className="mt-16 border-t border-gray-800 pt-16">
            <p className="text-sm text-gray-400">Built on Lens Protocol v3 • Powered by Web3</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <h1 className="mb-2 text-xl font-semibold">Pingpad</h1>
              <p className="text-sm text-gray-600">Clarity paves the way for brilliance.</p>
            </div>

            <div className="flex space-x-6">
              <Link
                href="https://github.com/pingpad-io/ping-pad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                GitHub
              </Link>
              <Link
                href="https://discord.gg/lens-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                Discord
              </Link>
              <Link
                href="https://twitter.com/pingpad_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                Twitter
              </Link>
              <Link
                href="https://docs.lens.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors hover:text-black"
              >
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;