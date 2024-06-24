"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
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
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export const Navigation = () => {
  return (
    <nav className="z-[40] w-full max-w-2xl flex flex-row justify-center items-center p-4 px-0 sticky top-0 bg-background/50 backdrop-blur-lg rounded-b-lg overflow-visible">
      <Carousel
        opts={{ dragFree: true, watchDrag: true, slidesToScroll: 6, loop: true, active: true, align: "start" }}
        plugins={[WheelGesturesPlugin({ active: true })]}
        className="w-full h-10 max-w-[32rem] select-none"
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
          <NavigationCarouselItem href={"/explore/curated"}>
            <NewspaperIcon size={18} />
            explore
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/explore/collected"}>
            <PlusCircleIcon size={18} />
            collect
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/explore/latest"}>
            <ClockIcon size={18} />
            latest
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitieslens"}>
            <SproutIcon size={18} />
            orb/lens
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesart"}>
            <PaletteIcon size={18} />
            orb/art
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiestrading"}>
            <LineChartIcon size={18} />
            orb/trading
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesraave"}>
            <PartyPopperIcon size={18} />
            orb/raave
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesafk"}>
            <KeyboardOffIcon size={18} />
            orb/afk
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiestouchgrass"}>
            <LeafIcon size={18} />
            orb/touchgrass
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesphotography"}>
            <CameraIcon size={18} />
            orb/photography
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesbonsai"}>
            <TreeDeciduousIcon size={18} />
            orb/bonsai
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesdefi"}>
            <Bitcoin size={18} />
            orb/defi
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitieszk"}>
            <CircleSlashIcon size={18} />
            orb/zk
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitieslips"}>
            <SproutIcon fill="hsl(var(--primary))" size={18} />
            orb/LIPs
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesmetaverse"}>
            <GlobeIcon size={18} />
            orb/metaverse
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesdesign"}>
            <FrameIcon size={18} />
            orb/design
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesvinylandmusic"}>
            <MusicIcon size={18} />
            orb/music
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesmemes"}>
            <LaughIcon size={18} />
            orb/memes
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesbooks"}>
            <LibraryIcon size={18} />
            orb/books
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesdevelopers"}>
            <WrenchIcon size={18} />
            orb/developers
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/c/orbcommunitiesbuild"}>
            <HammerIcon size={18} />
            orb/build
          </NavigationCarouselItem>
        </CarouselContent>
        <CarouselNext variant="ghost" />
      </Carousel>
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
      className={`rounded-md w-max h-10 disabled p-2 overflow-hidden inline-flex gap-1 items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted 
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
