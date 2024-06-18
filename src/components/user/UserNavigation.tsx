"use client";

import { ImagesIcon, MessageCircle, MessageSquare, PlusCircleIcon } from "lucide-react";
import { NavigationItem } from "../menu/Navigation";

export const UserNavigation = ({ handle }: { handle: string }) => {
  return (
    <nav className="z-[40] flex flex-row justify-start items-center gap-2 pt-2 px-4">
      <NavigationItem href={`/u/${handle}`}>
        <MessageCircle size={18} />
        posts
      </NavigationItem>
      <NavigationItem href={`/u/${handle}/comments`}>
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
    </nav>
  );
};
