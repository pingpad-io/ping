import { useEffect, type PropsWithChildren, useRef } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

export const PageLayout = (props: PropsWithChildren) => {
  const targetRef = useRef<HTMLElement | null>(null);
  const currentRef = useRef(null);

  useEffect(() => {
    const element = document.querySelector(".scrollable");
    if (element instanceof HTMLElement) {
      targetRef.current = element;
    }
  }, []);

  const handleMouseWheel = (event: WheelEvent) => {
    const { deltaY } = event;
    if (targetRef.current) {
      targetRef.current.scrollTop += deltaY * 2;
    }
  };

  useEffect(() => {
    const ref = currentRef.current;
    if (ref) {
      (ref as HTMLElement).addEventListener("wheel", handleMouseWheel);
    }

    return () => {
      if (ref) {
        (ref as HTMLElement).removeEventListener("wheel", handleMouseWheel);
      }
    };
  }, [targetRef]);

  return (
    <div
      className="flex flex-row justify-center shrink grow w-full shrink"
      ref={currentRef}
    >
      <div className="hidden sm:flex sticky top-0 h-fit">
        <Menu />
      </div>

      <div className="min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl h-fit">
        <div className="z-[100] flex sm:hidden h-fit w-full sticky top-0 bg-card rounded-b-lg drop-shadow-xl">
          <Menu />
        </div>
        {props.children}
      </div>

      <div className="hidden lg:flex sticky top-0 h-fit max-w-xs w-max">
        <Sidebar />
      </div>
    </div>
  );
};
