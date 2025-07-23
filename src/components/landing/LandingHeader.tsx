"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "~/components/Link";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils";

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const viewport = event.target as HTMLElement;
      const threshold = 1000;
      console.log("🌊 Scroll position:", viewport.scrollTop);
      
      if (viewport.scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const findAndAttachScrollListener = () => {
      const viewport = document.querySelector("[data-overlayscrollbars-viewport]");
      
      if (viewport) {
        console.log("✅ Viewport found!");
        viewport.addEventListener("scroll", handleScroll);
        return () => viewport.removeEventListener("scroll", handleScroll);
      } else {
        console.log("⏳ Viewport not found, retrying...");
        // Retry after 100ms
        setTimeout(findAndAttachScrollListener, 100);
      }
    };

    // Start looking for the viewport
    const cleanup = findAndAttachScrollListener();
    
    return cleanup;
  }, []);

 

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#why", label: "Why Pingpad" },
    { href: "#community", label: "Community" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-2 z-50 w-full max-w-2xl transition-all duration-300",
        "bg-white/60 backdrop-blur-md rounded-xl",
        // scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200 bg-pink-300" : "bg-yellow-300",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Pingpad</h1>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm transition-colors hover:text-gray-600"
              >
                {item.label}
              </a>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href="/home">Launch App</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 md:hidden">
          <div className="space-y-4 px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/home">Launch App</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingHeader;