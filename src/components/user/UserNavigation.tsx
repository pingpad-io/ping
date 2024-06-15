"use client";

import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { HomeIcon, ImagesIcon, MessageCircle, MessageSquare, PlusCircleIcon, SquirrelIcon } from "lucide-react";
import { OtterIcon } from "../Icons";
import { NavigationItem } from "../menu/Navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

export const UserNavigation = ({ handle }: { handle: string }) => {
  return (
    <nav className="z-[40] flex flex-row justify-center items-center py-2">
      <Carousel
        opts={{ dragFree: true, align: "start", watchDrag: true, slidesToScroll: 6, loop: true }}
        plugins={[WheelGesturesPlugin({ active: true })]}
        className="w-full h-10 max-w-lg select-none"
      >
        <CarouselPrevious />
        <CarouselContent className="-ml-1">
          <NavigationItem href={`/u/${handle}`}>
            <MessageCircle size={18} />
            posts
          </NavigationItem>
          <NavigationItem href={`/u/${handle}/comments`} disabled>
            <MessageSquare size={18} />
            comments
          </NavigationItem>
          <NavigationItem href={`/u/${handle}/gallery`} disabled>
            <ImagesIcon size={18} />
            gallery
          </NavigationItem>
          <NavigationItem href={`/u/${handle}/collection`} disabled>
            <PlusCircleIcon size={18} />
            collection
          </NavigationItem>
          <NavigationItem href={`/u/${handle}/community`} disabled>
            <OtterIcon size={18} />
            community 1
          </NavigationItem>
          <NavigationItem href={`/u/${handle}/community`} disabled>
            <SquirrelIcon size={18} />
          </NavigationItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </nav>
  );
};
