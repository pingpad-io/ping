"use client";

import { ImagesIcon, MessageCircle, MessageSquare } from "lucide-react";
import { NavigationItem } from "../menu/Navigation";

export const UserNavigation = ({ handle }: { handle: string }) => {
  return (
    <nav className="sticky top-3 w-fit max-w-full mx-auto glass border border-muted rounded-xl z-[40] flex flex-row justify-start items-start gap-2 p-1 overflow-x-auto">
      <NavigationItem href={`/u/${handle}`}>
        <MessageCircle size={18} />
        posts
      </NavigationItem>
      <NavigationItem href={`/u/${handle}/comments`}>
        <MessageSquare size={18} />
        comments
      </NavigationItem>
      <NavigationItem href={`/u/${handle}/gallery`}>
        <ImagesIcon size={18} />
        gallery
      </NavigationItem>
    </nav>
  );
};
