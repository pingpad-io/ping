"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  AtSignIcon,
  Bitcoin,
  CameraIcon,
  CircleSlashIcon,
  ClockIcon,
  CrownIcon,
  FrameIcon,
  GlobeIcon,
  HammerIcon,
  HomeIcon,
  KeyboardOffIcon,
  LaughIcon,
  LeafIcon,
  LibraryIcon,
  LineChartIcon,
  MusicIcon,
  NewspaperIcon,
  PaletteIcon,
  PartyPopperIcon,
  PlusCircleIcon,
  SproutIcon,
  TreeDeciduousIcon,
  TrendingUpIcon,
  WrenchIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import Link from "~/components/Link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export const Navigation = () => {
  return (
    <nav className="z-[40] w-full max-w-2xl flex flex-row justify-center items-center border border-muted p-1 sticky top-3 bg-background/50 backdrop-blur-lg rounded-xl overflow-visible">
      <Carousel
        opts={{ dragFree: true, watchDrag: true, slidesToScroll: 6, loop: true, active: true, align: "start" }}
        plugins={[WheelGesturesPlugin({ active: true })]}
        className="w-full h-10 max-w-[80%] select-none"
      >
        <CarouselPrevious variant="ghost" />
        <CarouselContent className="-ml-1">
          <NavigationCarouselItem href={"/home"}>
            <HomeIcon size={18} />
            home
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/best"}>
            <CrownIcon size={18} />
            best
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/pingpad"}>
            <AtSignIcon size={18} />
            pingpad
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/lens"}>
            <SproutIcon size={18} />
            lens
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/art"}>
            <PaletteIcon size={18} />
            art
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/trading"}>
            <LineChartIcon size={18} />
            trading
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/raave"}>
            <PartyPopperIcon size={18} />
            raave
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/afk"}>
            <KeyboardOffIcon size={18} />
            afk
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/touchgrass"}>
            <LeafIcon size={18} />
            touchgrass
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/photography"}>
            <CameraIcon size={18} />
            photography
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/bonsai"}>
            <TreeDeciduousIcon size={18} />
            bonsai
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/defi"}>
            <Bitcoin size={18} />
            defi
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/zk"}>
            <CircleSlashIcon size={18} />
            zk
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/lips"}>
            <SproutIcon fill="hsl(var(--primary))" size={18} />
            LIPs
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/metaverse"}>
            <GlobeIcon size={18} />
            metaverse
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/design"}>
            <FrameIcon size={18} />
            design
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/music"}>
            <MusicIcon size={18} />
            music
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/memes"}>
            <LaughIcon size={18} />
            memes
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/books"}>
            <LibraryIcon size={18} />
            books
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/developers"}>
            <WrenchIcon size={18} />
            developers
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/build"}>
            <HammerIcon size={18} />
            build
          </NavigationCarouselItem>
        </CarouselContent>
        <CarouselNext variant="ghost" />
      </Carousel>
    </nav>
  );
};

export const ExploreNavigation = () => {
  return (
    <nav className="z-[40] flex flex-row justify-start items-center gap-2 p-4 px-0 sticky top-3 border border-muted bg-background/50 backdrop-blur-lg rounded-b-lg overflow-visible">
      <NavigationItem href={"/explore/curated"}>
        <NewspaperIcon size={18} />
        explore
      </NavigationItem>
      <NavigationItem href={"/explore/collected"}>
        <PlusCircleIcon size={18} />
        collected
      </NavigationItem>
      <NavigationItem href={"/explore/latest"}>
        <ClockIcon size={18} />
        latest
      </NavigationItem>
      <NavigationItem href={"/explore/trends"} disabled>
        <TrendingUpIcon size={18} />
        trending
      </NavigationItem>
    </nav>
  );
};

export const NavigationItem = ({
  children,
  href,
  disabled = false,
}: PropsWithChildren<{ href: string; disabled?: boolean }>) => {
  const pathname = usePathname();
  const selectedStyle = (path: string) => (path === pathname ? "font-bold bg-secondary text-secondary-foreground" : "");
  const disabledStyle = disabled ? "opacity-50 pointer-events-none select-none" : "";

  return (
    <Link
      className={`rounded-md w-max h-10 disabled p-1 overflow-hidden inline-flex gap-1 items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted
        hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${selectedStyle(href)} ${disabledStyle}`}
      href={href}
    >
      {children}
    </Link>
  );
};

export const NavigationCarouselItem = ({
  children,
  href,
  disabled = false,
}: PropsWithChildren<{ href: string; disabled?: boolean }>) => {
  return (
    <CarouselItem className="basis-auto pl-1">
      <NavigationItem href={href} disabled={disabled}>
        {children}
      </NavigationItem>
    </CarouselItem>
  );
};
