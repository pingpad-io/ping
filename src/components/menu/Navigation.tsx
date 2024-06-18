"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  BirdIcon,
  ClockIcon,
  CrownIcon,
  DogIcon,
  FishIcon,
  Globe2Icon,
  HammerIcon,
  HomeIcon,
  NewspaperIcon,
  PlusCircleIcon,
  SquirrelIcon,
  TelescopeIcon,
  WormIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export const Navigation = () => {
  return (
    <nav className="z-[40] w-full max-w-2xl  flex flex-row justify-center items-center py-2 px-4 sticky top-0 bg-background/50 backdrop-blur-lg rounded-b-lg">
      <Carousel
        opts={{ dragFree: true, align: "start", watchDrag: true, slidesToScroll: 6, loop: true }}
        plugins={[WheelGesturesPlugin({ active: true })]}
        className="w-full h-10 max-w-xl select-none"
      >
        <CarouselPrevious className="mx-1" />
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
          <NavigationCarouselItem href={"/home"} disabled>
            <Globe2Icon size={18} />
            community 1
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <SquirrelIcon size={18} />
            community 2
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <DogIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <BirdIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <TelescopeIcon size={18} />
            community 3
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <FishIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <WormIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <HammerIcon size={18} />
            community 4
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <Globe2Icon size={18} />
            community 5
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <SquirrelIcon size={18} />
            wow comunity 6
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <DogIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <BirdIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <TelescopeIcon size={18} />
            telescope
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <FishIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <WormIcon size={18} />
          </NavigationCarouselItem>
          <NavigationCarouselItem href={"/home"} disabled>
            <HammerIcon size={18} />
            builders
          </NavigationCarouselItem>
        </CarouselContent>
        <CarouselNext className="mx-1" />
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
  const selectedStyle = (path: string) => (path === pathname ? "font-bold bg-accent text-accent-foreground" : "");
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
