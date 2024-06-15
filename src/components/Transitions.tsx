"use client";

import { type PropsWithChildren, useRef } from "react";
import { useInViewport } from "react-in-viewport";

export const FadeIn = ({
  children,
  oneShot = true,
  className,
}: PropsWithChildren & { oneShot?: boolean; className?: string }) => {
  const myRef = useRef();
  let fired = false;

  const { inViewport, enterCount, leaveCount } = useInViewport(
    myRef,
    { rootMargin: "0px", threshold: 0.5, root: null },
    { disconnectOnLeave: true },
    {},
  );

  if (oneShot && enterCount > 0) {
    fired = true;
  }

  const viewportStyle = inViewport || fired ? "opacity-100" : "opacity-0";

  return (
    <div ref={myRef} className={`transition duration-500 ease-in-out ${viewportStyle} ${className}`}>
      {children}
    </div>
  );
};
