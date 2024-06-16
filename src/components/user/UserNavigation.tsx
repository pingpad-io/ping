"use client";

import { ImagesIcon, MessageCircle, MessageSquare, PlusCircleIcon, SquirrelIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

export const UserNavigation = ({ handle }: { handle: string }) => {
  return (
    <nav className="z-[40] flex flex-row justify-center items-center gap-2 pt-2 px-4">
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
      className={`rounded-md w-1/4 px-1 h-10 disabled p-2 overflow-hidden inline-flex gap-1 items-center justify-center text-sm font-medium ring-offset-background transition-colors hover:bg-muted 
        hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${selectedStyle(href)} ${disabledStyle}`}
      href={href}
    >
      {children}
    </Link>
  );
};
