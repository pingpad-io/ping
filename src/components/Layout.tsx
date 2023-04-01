import { PropsWithChildren } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Menu />
      <div className="min-h-full max-w-full shrink-0 grow border-x border-base-300 sm:shrink lg:max-w-2xl">
        {props.children}
      </div>
      <Sidebar />
    </>
  );
};
