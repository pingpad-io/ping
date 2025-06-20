"use client";

import { ImagesIcon, MessageCircle, MessageCircleCode, MessageSquare } from "lucide-react";
import { NavigationItem } from "../menu/Navigation";

export const UserNavigation = ({ handle }: { handle: string }) => {
  return (
    <nav className="sticky top-3 w-fit max-w-2xl mx-auto glass border border-muted rounded-xl z-[40] flex flex-row justify-start items-start gap-2 p-1">
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
      <NavigationItem href={`/u/${handle}/all`}>
        <MessageCircleCode size={18} />
        all
      </NavigationItem>
    </nav>
  );
};
