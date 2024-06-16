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
    <nav className="z-[40] flex flex-row justify-center items-center py-2 sticky top-0 backdrop-blur-md rounded-b-lg">
      <Carousel
        opts={{ dragFree: true, align: "start", watchDrag: true, slidesToScroll: 6, loop: true }}
        plugins={[WheelGesturesPlugin({ active: true })]}
        className="w-full h-10  max-w-lg select-none"
      >
        <CarouselPrevious className="mx-1" />
        <CarouselContent className="-ml-1">
          <NavigationItem href={"/home"}>
            <HomeIcon size={18} />
            home
          </NavigationItem>
          <NavigationItem href={"/best"}>
            <CrownIcon size={18} />
            best
          </NavigationItem>
          <NavigationItem href={"/explore/curated"}>
            <NewspaperIcon size={18} />
            explore
          </NavigationItem>
          <NavigationItem href={"/explore/collected"}>
            <PlusCircleIcon size={18} />
            collect
          </NavigationItem>
          <NavigationItem href={"/explore/latest"}>
            <ClockIcon size={18} />
            latest
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <Globe2Icon size={18} />
            community 1
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <SquirrelIcon size={18} />
            community 2
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <DogIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <BirdIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <TelescopeIcon size={18} />
            community 3
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <FishIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <WormIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <HammerIcon size={18} />
            community 4
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <Globe2Icon size={18} />
            community 5
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <SquirrelIcon size={18} />
            wow comunity 6
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <DogIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <BirdIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <TelescopeIcon size={18} />
            telescope
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <FishIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <WormIcon size={18} />
          </NavigationItem>
          <NavigationItem href={"/home"} disabled>
            <HammerIcon size={18} />
            builders
          </NavigationItem>
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
    <CarouselItem className="basis-auto pl-1">
      <Link
        className={`rounded-md h-10 disabled p-2 overflow-hidden inline-flex gap-1 items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted 
        hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${selectedStyle(href)} ${disabledStyle}`}
        href={href}
      >
        {children}
      </Link>
    </CarouselItem>
  );
};
